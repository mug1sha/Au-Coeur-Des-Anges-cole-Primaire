import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { hasPermission } from "@/lib/admin-types";
import {
  REVENUE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_COLORS,
  type DashboardStats,
  type DashboardAnnouncement,
  type DashboardTransaction,
  type AuditLog,
} from "@/lib/admin-types";

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function monthRange(offset: number) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const from = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  const to = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
  return { from, to, year: d.getFullYear(), month: String(d.getMonth() + 1).padStart(2, "0") };
}

export async function GET() {
  const auth = await requireAuth("dashboard");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const current = monthRange(0);
  const prev = monthRange(-1);
  const canFinance = hasPermission(auth.user.role, "finance");

  const [teachersRes, servicesRes, announcementsRes, publishedCount, auditRes] = await Promise.all([
    supabase.from("teachers").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("announcements")
      .select("id, title, category, published_at, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("announcements").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  let totalRevenue = 0;
  let totalExpenses = 0;
  let prevRevenue = 0;
  let prevExpenses = 0;
  let comparisonByMonth: { month: string; revenue: number; expenses: number }[] = [];
  let expenseByCategory: { category: string; amount: number; color: string }[] = [];
  let recentTransactions: DashboardTransaction[] = [];

  if (canFinance) {
    const [rev, exp, prevRev, prevExp] = await Promise.all([
      supabase.from("revenues").select("id, amount, status, category, date, description, currency").gte("date", current.from).lte("date", current.to),
      supabase.from("expenses").select("id, amount, status, category, date, description, currency").gte("date", current.from).lte("date", current.to),
      supabase.from("revenues").select("amount, status").gte("date", prev.from).lte("date", prev.to),
      supabase.from("expenses").select("amount, status").gte("date", prev.from).lte("date", prev.to),
    ]);

    const completedRev = (rev.data ?? []).filter((r) => r.status === "completed");
    const completedExp = (exp.data ?? []).filter((r) => r.status === "completed");
    totalRevenue = completedRev.reduce((a, r) => a + Number(r.amount), 0);
    totalExpenses = completedExp.reduce((a, r) => a + Number(r.amount), 0);
    prevRevenue = (prevRev.data ?? []).filter((r) => r.status === "completed").reduce((a, r) => a + Number(r.amount), 0);
    prevExpenses = (prevExp.data ?? []).filter((r) => r.status === "completed").reduce((a, r) => a + Number(r.amount), 0);

    const expMap = new Map<string, number>();
    for (const row of completedExp) {
      expMap.set(row.category, (expMap.get(row.category) ?? 0) + Number(row.amount));
    }
    expenseByCategory = [...expMap.entries()].map(([category, amount]) => ({
      category: EXPENSE_CATEGORY_LABELS[category as keyof typeof EXPENSE_CATEGORY_LABELS] ?? category,
      amount,
      color: EXPENSE_CATEGORY_COLORS[category as keyof typeof EXPENSE_CATEGORY_COLORS] ?? "#94a3b8",
    }));

    comparisonByMonth = [
      { month: prev.month, revenue: prevRevenue, expenses: prevExpenses },
      { month: current.month, revenue: totalRevenue, expenses: totalExpenses },
    ];

    const tx: DashboardTransaction[] = [
      ...completedRev.slice(0, 5).map((r) => ({
        id: r.id,
        date: r.date,
        description: r.description,
        type: "revenue" as const,
        category: REVENUE_CATEGORY_LABELS[r.category as keyof typeof REVENUE_CATEGORY_LABELS] ?? r.category,
        amount: Number(r.amount),
        currency: r.currency ?? "RWF",
        status: "completed" as const,
      })),
      ...completedExp.slice(0, 5).map((r) => ({
        id: r.id,
        date: r.date,
        description: r.description,
        type: "expense" as const,
        category: EXPENSE_CATEGORY_LABELS[r.category as keyof typeof EXPENSE_CATEGORY_LABELS] ?? r.category,
        amount: Number(r.amount),
        currency: r.currency ?? "RWF",
        status: "completed" as const,
      })),
    ].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);
    recentTransactions = tx;
  }

  const recentAnnouncements: DashboardAnnouncement[] = (announcementsRes.data ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    publishedAt: a.published_at ?? a.created_at,
    status: a.status,
  }));

  const recentActivities = (auditRes.data ?? []) as AuditLog[];

  const stats: DashboardStats = {
    totalStudents: 0,
    totalTeachers: teachersRes.count ?? 0,
    activeServices: servicesRes.count ?? 0,
    publishedAnnouncements: publishedCount.count ?? 0,
    monthlyRevenue: totalRevenue,
    monthlyExpenses: totalExpenses,
    monthlyBalance: totalRevenue - totalExpenses,
    revenueChange: pctChange(totalRevenue, prevRevenue),
    expenseChange: pctChange(totalExpenses, prevExpenses),
    balanceChange: pctChange(totalRevenue - totalExpenses, prevRevenue - prevExpenses),
    teachersChange: 0,
    servicesChange: 0,
    announcementsChange: 0,
    comparisonByMonth,
    expenseByCategory,
    recentTransactions,
    recentAnnouncements,
    recentActivities,
    pendingAnnouncements: (announcementsRes.data ?? []).filter((a) => a.status === "draft").length,
    revenueByMonth: comparisonByMonth.map((m) => ({ month: m.month, amount: m.revenue })),
  };

  return NextResponse.json({ data: stats });
}

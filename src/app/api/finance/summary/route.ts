import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { REVENUE_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_COLORS } from "@/lib/admin-types";

export async function GET(request: NextRequest) {
  const auth = await requireAuth("finance");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") ?? new Date().getFullYear().toString();
  const month = searchParams.get("month");

  let dateFrom = `${year}-01-01`;
  let dateTo = `${year}-12-31`;
  if (month) {
    dateFrom = `${year}-${month.padStart(2, "0")}-01`;
    dateTo = new Date(parseInt(year), parseInt(month), 0).toISOString().split("T")[0];
  }

  const [revResult, expResult] = await Promise.all([
    supabase.from("revenues").select("*").gte("date", dateFrom).lte("date", dateTo),
    supabase.from("expenses").select("*").gte("date", dateFrom).lte("date", dateTo),
  ]);

  if (revResult.error) return NextResponse.json({ error: revResult.error.message }, { status: 500 });
  if (expResult.error) return NextResponse.json({ error: expResult.error.message }, { status: 500 });

  const revenues = revResult.data ?? [];
  const expenses = expResult.data ?? [];

  const completed = (rows: typeof revenues) => rows.filter((r) => r.status === "completed");
  const pending = (rows: typeof revenues) => rows.filter((r) => r.status === "pending");
  const sum = (rows: typeof revenues) => rows.reduce((acc, r) => acc + Number(r.amount), 0);

  const totalRevenue = sum(completed(revenues));
  const totalExpenses = sum(completed(expenses));
  const pendingRevenue = sum(pending(revenues));
  const pendingExpenses = sum(pending(expenses));

  // By category
  const revenueByCategory = Object.entries(REVENUE_CATEGORY_LABELS).map(([cat, label]) => {
    const rows = completed(revenues).filter((r) => r.category === cat);
    return { category: cat, label, amount: sum(rows), count: rows.length };
  }).filter((c) => c.count > 0);

  const expenseByCategory = Object.entries(EXPENSE_CATEGORY_LABELS).map(([cat, label]) => {
    const rows = completed(expenses).filter((e) => e.category === cat);
    return {
      category: cat, label, amount: sum(rows), count: rows.length,
      color: EXPENSE_CATEGORY_COLORS[cat as keyof typeof EXPENSE_CATEGORY_COLORS] ?? "#94a3b8",
    };
  }).filter((c) => c.count > 0);

  // Monthly trend — last 6 months
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const y = d.getFullYear().toString();
    const mFrom = `${y}-${m}-01`;
    const mTo = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
    const mRevenues = completed(revenues).filter((r) => r.date >= mFrom && r.date <= mTo);
    const mExpenses = completed(expenses).filter((e) => e.date >= mFrom && e.date <= mTo);
    const rev = sum(mRevenues);
    const exp = sum(mExpenses);
    return {
      month: d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      revenue: rev, expenses: exp, balance: rev - exp,
    };
  });

  return NextResponse.json({
    data: {
      computedAt: new Date().toISOString(),
      totalRevenue, totalExpenses,
      balance: totalRevenue - totalExpenses,
      pendingRevenue, pendingExpenses,
      revenueByCategory, expenseByCategory,
      monthlyTrend,
      revenueCount: revenues.length,
      expenseCount: expenses.length,
    },
  });
}

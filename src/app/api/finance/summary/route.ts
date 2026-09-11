import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import {
  REVENUE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_COLORS,
} from "@/lib/admin-types";

export async function GET(request: NextRequest) {
  const auth = await requireAuth("finance");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") ?? new Date().getFullYear().toString();
  const month = searchParams.get("month");
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  // Determine date range — explicit startDate/endDate take precedence
  let dateFrom: string;
  let dateTo: string;

  if (startDateParam && endDateParam) {
    dateFrom = startDateParam;
    dateTo = endDateParam;
  } else if (month) {
    dateFrom = `${year}-${month.padStart(2, "0")}-01`;
    dateTo = new Date(parseInt(year), parseInt(month), 0).toISOString().split("T")[0];
  } else {
    dateFrom = `${year}-01-01`;
    dateTo = `${year}-12-31`;
  }

  // ── Parallel queries — much faster than sequential ────────────────────────
  const [revResult, expResult] = await Promise.all([
    supabase
      .from("revenues")
      .select("amount, status, category, date")
      .gte("date", dateFrom)
      .lte("date", dateTo),
    supabase
      .from("expenses")
      .select("amount, status, category, date")
      .gte("date", dateFrom)
      .lte("date", dateTo),
  ]);

  if (revResult.error) return NextResponse.json({ error: "Erreur lors de la récupération des revenus." }, { status: 500 });
  if (expResult.error) return NextResponse.json({ error: "Erreur lors de la récupération des dépenses." }, { status: 500 });

  const revenues = revResult.data ?? [];
  const expenses = expResult.data ?? [];

  // ── Compute totals (in-process, minimal data already filtered by DB) ──────
  type Row = { amount: number; status: string; category: string; date: string };
  const completed = (rows: Row[]) => rows.filter((r) => r.status === "completed");
  const pending   = (rows: Row[]) => rows.filter((r) => r.status === "pending");
  const sum       = (rows: Row[]) => rows.reduce((acc, r) => acc + Number(r.amount), 0);

  const completedRevs = completed(revenues);
  const completedExps = completed(expenses);

  const totalRevenue  = sum(completedRevs);
  const totalExpenses = sum(completedExps);
  const pendingRevenue  = sum(pending(revenues));
  const pendingExpenses = sum(pending(expenses));

  // By category
  const revenueByCategory = (Object.entries(REVENUE_CATEGORY_LABELS) as [string, string][]).map(([cat, label]) => {
    const rows = completedRevs.filter((r) => r.category === cat);
    return { category: cat, label, amount: sum(rows), count: rows.length };
  }).filter((c) => c.count > 0);

  const expenseByCategory = (Object.entries(EXPENSE_CATEGORY_LABELS) as [string, string][]).map(([cat, label]) => {
    const rows = completedExps.filter((e) => e.category === cat);
    return {
      category: cat, label, amount: sum(rows), count: rows.length,
      color: EXPENSE_CATEGORY_COLORS[cat as keyof typeof EXPENSE_CATEGORY_COLORS] ?? "#94a3b8",
    };
  }).filter((c) => c.count > 0);

  // Monthly trend — 6 months ending at end of period
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(dateTo);
    d.setMonth(d.getMonth() - (5 - i));
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const y = d.getFullYear().toString();
    const mFrom = `${y}-${m}-01`;
    const mTo = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];

    const mRevenues = completedRevs.filter((r) => r.date >= mFrom && r.date <= mTo);
    const mExpenses = completedExps.filter((e) => e.date >= mFrom && e.date <= mTo);
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
      totalRevenue,
      totalExpenses,
      balance: totalRevenue - totalExpenses,
      pendingRevenue,
      pendingExpenses,
      revenueByCategory,
      expenseByCategory,
      monthlyTrend,
      revenueCount: completedRevs.length,
      expenseCount: completedExps.length,
    },
  }, {
    headers: {
      // Finance summary can be cached for 60 s (private, per-user)
      "Cache-Control": "private, max-age=60, stale-while-revalidate=30",
    },
  });
}

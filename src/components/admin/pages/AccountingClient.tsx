"use client";

/**
 * AccountingClient — /admin/finance/accounting
 *
 * Displays authoritative financial data always sourced from the server.
 * The client never computes its own financial totals — all numbers come
 * from GET /api/finance/summary.
 *
 * Sections:
 *   1. Date-range picker (defaults to current month)
 *   2. KPI strip — balance, revenue, expenses, pending (server-computed)
 *   3. Monthly trend chart (6-month bar chart)
 *   4. Expense distribution by category (progress bars)
 *   5. Revenue breakdown by category
 *   6. Accounting periods table (open / closed)
 *   7. Profit-margin indicator
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, Scale, Clock, RefreshCw,
  AlertCircle, Lock, Unlock, Calculator, ArrowRight, Info,
} from "lucide-react";
import type { FinanceSummary, AccountingPeriod } from "@/lib/admin-types";
import { useAdminSession } from "@/lib/AdminSessionContext";
import { getFinancePermissions } from "@/lib/finance-guard";
import { getAccountingPeriods } from "@/lib/admin-data";
import { Card, CardHeader, CardBody, Button, Badge, Skeleton, useToast } from "@/components/admin/ui";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " RWF";
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "k";
  return String(n);
}

function firstDayOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
}
function lastDayOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
}

// ─────────────────────────────────────────────
// MINI BAR CHART
// ─────────────────────────────────────────────
function BarGroup({
  revenue,
  expenses,
  maxVal,
  label,
}: {
  revenue: number;
  expenses: number;
  maxVal: number;
  label: string;
}) {
  const rPct = maxVal > 0 ? Math.max((revenue / maxVal) * 100, 2) : 0;
  const ePct = maxVal > 0 ? Math.max((expenses / maxVal) * 100, 2) : 0;
  return (
    <div className="flex flex-1 flex-col items-stretch gap-1">
      {/* Labels on top */}
      <div className="flex justify-between text-[9px] font-semibold leading-none">
        <span className="text-emerald-600">{fmtShort(revenue)}</span>
        <span className="text-red-500">{fmtShort(expenses)}</span>
      </div>
      {/* Bar pair */}
      <div className="flex flex-1 items-end gap-0.5 min-h-[80px]">
        <div className="flex flex-1 flex-col justify-end h-full">
          <div
            className="w-full rounded-t-sm bg-emerald-500 transition-all duration-700"
            style={{ height: `${rPct}%` }}
            title={`Revenus: ${fmt(revenue)}`}
          />
        </div>
        <div className="flex flex-1 flex-col justify-end h-full">
          <div
            className="w-full rounded-t-sm bg-red-400 transition-all duration-700"
            style={{ height: `${ePct}%` }}
            title={`Dépenses: ${fmt(expenses)}`}
          />
        </div>
      </div>
      {/* Month label */}
      <p className="text-center text-[10px] font-medium text-slate-400">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function AccountingClient() {
  const { session } = useAdminSession();
  const { canRead } = getFinancePermissions(session?.role);

  const today = new Date();
  const [startDate, setStartDate] = useState(firstDayOfMonth(today));
  const [endDate,   setEndDate]   = useState(lastDayOfMonth(today));

  const [summary,  setSummary]  = useState<FinanceSummary | null>(null);
  const [periods,  setPeriods]  = useState<AccountingPeriod[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const { show, ToastComponent } = useToast();

  // Fetch server-computed summary + accounting periods
  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const [summaryRes, periodsData] = await Promise.all([
          fetch(
            `/api/finance/summary?startDate=${startDate}&endDate=${endDate}`,
            {
              headers: { Authorization: `Bearer ${session?.token ?? ""}` },
              cache: "no-store",
            }
          ),
          getAccountingPeriods(),
        ]);

        if (!summaryRes.ok) {
          const json = await summaryRes.json().catch(() => ({}));
          throw new Error(json.error ?? `HTTP ${summaryRes.status}`);
        }
        const summaryData = await summaryRes.json();
        setSummary(summaryData);
        setPeriods(periodsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [startDate, endDate, session?.token]
  );

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  // ── Permission guard ────────────────────────────────────────────────────
  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={36} className="text-red-400" />
        <p className="mt-3 font-bold text-[#463ACB]">Accès refusé</p>
        <p className="mt-1 text-sm text-slate-400">
          Vous n&apos;avez pas les permissions pour accéder aux données comptables.
        </p>
      </div>
    );
  }

  // ── Derived values ──────────────────────────────────────────────────────
  const trendMax = summary
    ? Math.max(...summary.monthlyTrend.flatMap((m) => [m.revenue, m.expenses]), 1)
    : 1;

  const profitMargin =
    summary && summary.totalRevenue > 0
      ? ((summary.balance / summary.totalRevenue) * 100).toFixed(1)
      : "—";

  const openPeriod  = periods.find((p) => !p.closed);
  const closedPeriods = periods.filter((p) => p.closed);

  return (
    <>
      {ToastComponent}

      <div className="space-y-6">
        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#463ACB]">
              Comptabilité
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Bilan financier — données calculées côté serveur
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date range pickers */}
            <div className="flex items-center gap-2">
              <div>
                <label className="sr-only" htmlFor="acc-from">Début</label>
                <input
                  id="acc-from"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#463ACB] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                />
              </div>
              <span className="text-xs text-slate-400">→</span>
              <div>
                <label className="sr-only" htmlFor="acc-to">Fin</label>
                <input
                  id="acc-to"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#463ACB] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                />
              </div>
            </div>
            <button
              onClick={() => loadData(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              aria-label="Actualiser"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        {/* ── Server trust banner ─────────────────────────────────────────── */}
        <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs text-blue-700">
          <Info size={13} className="mt-0.5 shrink-0" />
          Tous les totaux sont calculés côté serveur via{" "}
          <code className="font-mono font-bold">/api/finance/summary</code>.
          Le client n&apos;effectue jamais de calculs financiers.
          {summary && (
            <span className="ml-1 text-blue-500">
              Dernière mise à jour :{" "}
              {new Date(summary.computedAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* ── Error state ─────────────────────────────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => loadData()}
              className="ml-auto text-xs underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* ── KPI strip ───────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-[20px]" />
            ))}
          </div>
        ) : summary ? (
          <>
            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Balance */}
              <div
                className={`rounded-[20px] border p-5 shadow-sm ${
                  summary.balance >= 0
                    ? "border-emerald-100 bg-emerald-50"
                    : "border-red-100 bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale size={14} className={summary.balance >= 0 ? "text-emerald-600" : "text-red-600"} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Solde net</p>
                </div>
                <p
                  className={`mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold ${
                    summary.balance >= 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {fmt(summary.balance)}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Marge : <strong>{profitMargin}%</strong>
                </p>
              </div>

              {/* Revenue */}
              <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-600" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Revenus</p>
                </div>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-emerald-700">
                  {fmt(summary.totalRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {summary.revenueCount} transaction{summary.revenueCount !== 1 ? "s" : ""} complétée{summary.revenueCount !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Expenses */}
              <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} className="text-red-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dépenses</p>
                </div>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-red-700">
                  {fmt(summary.totalExpenses)}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {summary.expenseCount} transaction{summary.expenseCount !== 1 ? "s" : ""} complétée{summary.expenseCount !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Pending */}
              <div className="rounded-[20px] border border-amber-100 bg-amber-50 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-600" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">En attente</p>
                </div>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-amber-700">
                  {fmt(summary.pendingRevenue + summary.pendingExpenses)}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Rev. {fmt(summary.pendingRevenue)} · Dép. {fmt(summary.pendingExpenses)}
                </p>
              </div>
            </div>

            {/* ── Charts row ─────────────────────────────────────────────── */}
            <div className="grid gap-5 lg:grid-cols-3">
              {/* 6-month trend */}
              <div className="lg:col-span-2 rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                      Tendances financières
                    </p>
                    <p className="text-xs text-slate-400">6 derniers mois — Revenus vs Dépenses</p>
                  </div>
                  <Link
                    href="/admin/finance/reports"
                    className="flex items-center gap-1 text-xs font-medium text-[#FF6B35] hover:underline"
                  >
                    Rapports <ArrowRight size={11} />
                  </Link>
                </div>

                {summary.monthlyTrend.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">
                    Aucune donnée de tendance disponible.
                  </p>
                ) : (
                  <>
                    <div className="flex h-44 items-end gap-2">
                      {summary.monthlyTrend.map((m) => (
                        <BarGroup
                          key={m.month}
                          revenue={m.revenue}
                          expenses={m.expenses}
                          maxVal={trendMax}
                          label={m.month}
                        />
                      ))}
                    </div>
                    {/* Legend */}
                    <div className="mt-3 flex items-center justify-center gap-5 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Revenus
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Dépenses
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Expense distribution */}
              <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                    Répartition des dépenses
                  </p>
                  <p className="text-xs text-slate-400">Par catégorie (complétées)</p>
                </div>

                {summary.expenseByCategory.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-400">
                    Aucune dépense enregistrée pour cette période.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {summary.expenseByCategory
                      .sort((a, b) => b.amount - a.amount)
                      .map((cat) => {
                        const pct =
                          summary.totalExpenses > 0
                            ? Math.round((cat.amount / summary.totalExpenses) * 100)
                            : 0;
                        return (
                          <div key={cat.category}>
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="inline-block h-2 w-2 rounded-full"
                                  style={{ background: cat.color }}
                                />
                                <span className="font-medium text-[#463ACB] truncate max-w-[110px]">
                                  {cat.label}
                                </span>
                              </div>
                              <span className="tabular-nums text-slate-400">{pct}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-2 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, background: cat.color }}
                              />
                            </div>
                            <p className="mt-0.5 text-right text-[10px] text-slate-400 tabular-nums">
                              {fmt(cat.amount)}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Profitability bar ───────────────────────────────────────── */}
            <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                  Ratio dépenses / revenus
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    summary.totalRevenue > 0 &&
                    summary.totalExpenses / summary.totalRevenue < 0.7
                      ? "bg-emerald-100 text-emerald-700"
                      : summary.totalRevenue > 0 &&
                        summary.totalExpenses / summary.totalRevenue < 0.9
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {summary.totalRevenue > 0
                    ? ((summary.totalExpenses / summary.totalRevenue) * 100).toFixed(1) + "%"
                    : "N/A"}
                </span>
              </div>
              <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100">
                {summary.totalRevenue > 0 && (
                  <>
                    {/* Expense portion */}
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-[#FF6B35] transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          (summary.totalExpenses / summary.totalRevenue) * 100,
                          100
                        )}%`,
                      }}
                    />
                    {/* Balance portion */}
                    {summary.balance > 0 && (
                      <div
                        className="absolute top-0 h-full rounded-full bg-emerald-400 opacity-40 transition-all duration-700"
                        style={{
                          left: `${Math.min(
                            (summary.totalExpenses / summary.totalRevenue) * 100,
                            100
                          )}%`,
                          width: `${Math.min(
                            (summary.balance / summary.totalRevenue) * 100,
                            100
                          )}%`,
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                  Dépenses : {fmt(summary.totalExpenses)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Bénéfice : {fmt(Math.max(summary.balance, 0))}
                </span>
              </div>
            </div>

            {/* ── Revenue breakdown ───────────────────────────────────────── */}
            {summary.revenueByCategory.length > 0 && (
              <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                <p className="mb-4 font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                  Revenus par catégorie
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {summary.revenueByCategory
                    .sort((a, b) => b.amount - a.amount)
                    .map((cat) => {
                      const pct =
                        summary.totalRevenue > 0
                          ? Math.round((cat.amount / summary.totalRevenue) * 100)
                          : 0;
                      return (
                        <div
                          key={cat.category}
                          className="rounded-[14px] border border-slate-100 bg-slate-50 p-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#463ACB]">{cat.label}</p>
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                              ×{cat.count}
                            </span>
                          </div>
                          <p className="mt-1 text-lg font-extrabold text-emerald-700 tabular-nums">
                            {fmt(cat.amount)}
                          </p>
                          <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200">
                            <div
                              className="h-1.5 rounded-full bg-emerald-400 transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="mt-0.5 text-right text-[10px] text-slate-400">{pct}%</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* ── Accounting periods ───────────────────────────────────────────── */}
        <div>
          <h2 className="mb-3 font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wider text-slate-400">
            Périodes comptables
          </h2>

          {periods.length === 0 ? (
            <Card>
              <CardBody>
                <div className="flex flex-col items-center py-12 text-center">
                  <Calculator size={32} className="text-slate-300" />
                  <p className="mt-3 font-bold text-[#463ACB]">Aucune période comptable</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Les périodes seront générées automatiquement.
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {/* Open period */}
              {openPeriod && (
                <Card>
                  <CardHeader>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                          {openPeriod.name}
                        </p>
                        <Badge variant="success">En cours</Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        {new Date(openPeriod.startDate).toLocaleDateString("fr-FR")} –{" "}
                        {new Date(openPeriod.endDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      icon={Lock}
                      onClick={() => show("Clôture de période — backend requis.", "info")}
                    >
                      Clôturer la période
                    </Button>
                  </CardHeader>
                  <CardBody>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-slate-400">Revenus</p>
                        <p className="mt-1 text-xl font-extrabold text-emerald-700">
                          {fmt(openPeriod.totalRevenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Dépenses</p>
                        <p className="mt-1 text-xl font-extrabold text-red-700">
                          {fmt(openPeriod.totalExpenses)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Solde</p>
                        <p
                          className={`mt-1 text-xl font-extrabold ${
                            openPeriod.balance >= 0 ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {fmt(openPeriod.balance)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs text-slate-400">
                        <span>Dépenses / Revenus</span>
                        <span>
                          {openPeriod.totalRevenue > 0
                            ? ((openPeriod.totalExpenses / openPeriod.totalRevenue) * 100).toFixed(0) + "%"
                            : "N/A"}
                        </span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-slate-100">
                        <div
                          className="h-3 rounded-full bg-[#FF6B35] transition-all duration-700"
                          style={{
                            width: `${Math.min(
                              openPeriod.totalRevenue > 0
                                ? (openPeriod.totalExpenses / openPeriod.totalRevenue) * 100
                                : 0,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Closed periods */}
              {closedPeriods.map((p) => (
                <div
                  key={p.id}
                  className="rounded-[16px] border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Lock size={14} className="shrink-0 text-slate-300" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#463ACB]">{p.name}</p>
                          <Badge variant="neutral">Clôturé</Badge>
                        </div>
                        <p className="text-xs text-slate-400">
                          {new Date(p.startDate).toLocaleDateString("fr-FR")} –{" "}
                          {new Date(p.endDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => show("Réouverture de période — backend requis.", "info")}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition"
                    >
                      <Unlock size={12} /> Rouvrir
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 border-t border-slate-50 pt-3 text-center">
                    <div>
                      <p className="text-xs text-slate-400">Revenus</p>
                      <p className="font-semibold text-emerald-700">{fmt(p.totalRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Dépenses</p>
                      <p className="font-semibold text-red-700">{fmt(p.totalExpenses)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Solde</p>
                      <p
                        className={`font-semibold ${
                          p.balance >= 0 ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {fmt(p.balance)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer note ─────────────────────────────────────────────────── */}
        {summary && (
          <p className="text-center text-xs text-slate-400">
            Données calculées côté serveur — actualisé le{" "}
            {new Date(summary.computedAt).toLocaleString("fr-FR")}
          </p>
        )}
      </div>
    </>
  );
}

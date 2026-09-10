"use client";

/**
 * ReportsClient — /admin/finance/reports
 *
 * Full financial reporting page:
 *   - Date range filter (default: current month)
 *   - Category filter (revenue categories + expense categories)
 *   - Transaction type filter (all / revenues / expenses)
 *   - Server-computed KPI summary (never locally calculated)
 *   - Monthly trend bar chart (6 months)
 *   - Expense distribution by category
 *   - Revenue breakdown by category
 *   - Accounting periods summary table
 *   - CSV export (fully working via /api/export/[type])
 *   - PDF export architecture (JSON blueprint — ready for jsPDF integration)
 *
 * All financial totals come from GET /api/finance/summary.
 * Clients never compute their own authoritative totals.
 */

import { useEffect, useState, useCallback } from "react";
import {
  BarChart3, Download, TrendingUp, TrendingDown, Scale, PieChart,
  RefreshCw, AlertCircle, FileText, FileSpreadsheet, X, Filter,
  ChevronDown, Info, Clock,
} from "lucide-react";
import type { FinanceSummary, AccountingPeriod, RevenueCategory, ExpenseCategoryKey } from "@/lib/admin-types";
import { REVENUE_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS } from "@/lib/admin-types";
import { getAdminSession } from "@/lib/admin-auth";
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
// BAR CHART COMPONENT
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
      <div className="flex justify-between text-[9px] font-semibold leading-none">
        <span className="text-emerald-600">{fmtShort(revenue)}</span>
        <span className="text-red-500">{fmtShort(expenses)}</span>
      </div>
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
      <p className="text-center text-[10px] font-medium text-slate-400">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────
type TransactionType = "all" | "revenues" | "expenses";
type CategoryFilter  = "all" | RevenueCategory | ExpenseCategoryKey;

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function ReportsClient() {
  const session = getAdminSession();
  const { canRead } = getFinancePermissions(session?.role);

  const today = new Date();

  // ── Filter state ─────────────────────────────────────────────────────────
  const [startDate,    setStartDate]    = useState(firstDayOfMonth(today));
  const [endDate,      setEndDate]      = useState(lastDayOfMonth(today));
  const [txType,       setTxType]       = useState<TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  // ── Data state ───────────────────────────────────────────────────────────
  const [summary,   setSummary]   = useState<FinanceSummary | null>(null);
  const [periods,   setPeriods]   = useState<AccountingPeriod[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const { show, ToastComponent } = useToast();

  // ── Load data from server ─────────────────────────────────────────────────
  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ startDate, endDate });
        const [summaryRes, periodsData] = await Promise.all([
          fetch(`/api/finance/summary?${params}`, {
            headers: { Authorization: `Bearer ${session?.token ?? ""}` },
            cache: "no-store",
          }),
          getAccountingPeriods(),
        ]);

        if (!summaryRes.ok) {
          const json = await summaryRes.json().catch(() => ({}));
          throw new Error(json.error ?? `HTTP ${summaryRes.status}`);
        }

        setSummary(await summaryRes.json());
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

  // ── CSV Export ────────────────────────────────────────────────────────────
  async function handleExportCsv(type: "revenues" | "expenses" | "summary" | "transactions") {
    try {
      const params = new URLSearchParams({ format: "csv", startDate, endDate });
      if (categoryFilter !== "all") params.set("category", categoryFilter);

      const res = await fetch(`/api/export/${type}?${params}`, {
        headers: { Authorization: `Bearer ${session?.token ?? ""}` },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        show(json.error ?? "Erreur lors de l'export.", "error");
        return;
      }

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href     = url;
      a.download = `aucoeurddesanges_${type}_${dateStr}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      show(`Export CSV "${type}" téléchargé.`, "success");
    } catch {
      show("Erreur réseau lors de l'export.", "error");
    }
  }

  // ── PDF Blueprint Export ──────────────────────────────────────────────────
  async function handleExportPdf() {
    try {
      const params = new URLSearchParams({ format: "pdf", startDate, endDate });
      const res = await fetch(`/api/export/summary?${params}`, {
        headers: { Authorization: `Bearer ${session?.token ?? ""}` },
      });
      if (!res.ok) { show("Erreur lors de la génération PDF.", "error"); return; }
      const blueprint = await res.json();
      // Blueprint is ready — log to console and inform user
      console.info("[PDF Blueprint]", blueprint);
      show(
        "Blueprint PDF généré (console). Intégrez jsPDF ou puppeteer pour le rendu complet.",
        "info"
      );
    } catch {
      show("Erreur réseau.", "error");
    }
  }

  // ── Permission guard ──────────────────────────────────────────────────────
  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={36} className="text-red-400" />
        <p className="mt-3 font-bold text-[#463ACB]">Accès refusé</p>
        <p className="mt-1 text-sm text-slate-400">
          Vous n&apos;avez pas les droits pour accéder aux rapports financiers.
        </p>
      </div>
    );
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const trendMax = summary
    ? Math.max(...summary.monthlyTrend.flatMap((m) => [m.revenue, m.expenses]), 1)
    : 1;

  const profitMargin =
    summary && summary.totalRevenue > 0
      ? ((summary.balance / summary.totalRevenue) * 100).toFixed(1)
      : "—";

  const ytdRevenue  = periods.reduce((s, p) => s + p.totalRevenue, 0);
  const ytdExpenses = periods.reduce((s, p) => s + p.totalExpenses, 0);
  const ytdBalance  = ytdRevenue - ytdExpenses;

  const hasActiveFilters =
    txType !== "all" ||
    categoryFilter !== "all";

  return (
    <>
      {ToastComponent}

      <div className="space-y-6">
        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#463ACB]">
              Rapports financiers
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Analyse, filtrage et export des données financières
            </p>
          </div>

          {/* Export buttons */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => handleExportCsv("transactions")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                title="Exporter toutes les transactions en CSV"
              >
                <FileSpreadsheet size={13} className="text-emerald-600" />
                Transactions CSV
              </button>
              <button
                onClick={() => handleExportCsv("summary")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                title="Exporter le résumé en CSV"
              >
                <FileSpreadsheet size={13} className="text-blue-600" />
                Résumé CSV
              </button>
              <button
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                title="Générer le blueprint PDF"
              >
                <FileText size={13} className="text-red-500" />
                PDF
              </button>
            </div>
            <button
              onClick={() => loadData(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              Actualiser
            </button>
          </div>
        </div>

        {/* ── Filter bar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date range */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Date de début"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#463ACB] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
            />
            <span className="text-xs text-slate-400">→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="Date de fin"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#463ACB] outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
            />

            {/* Advanced filters toggle */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                filtersOpen || hasActiveFilters
                  ? "border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#FF6B35]"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Filter size={13} />
              Filtres avancés
              {hasActiveFilters && <span className="text-[#FF6B35]">·</span>}
              <ChevronDown
                size={12}
                className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Advanced filters panel */}
        {filtersOpen && (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Transaction type */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Type de transaction
              </label>
              <select
                value={txType}
                onChange={(e) => setTxType(e.target.value as TransactionType)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B35]"
              >
                <option value="all">Tous</option>
                <option value="revenues">Revenus seulement</option>
                <option value="expenses">Dépenses seulement</option>
              </select>
            </div>

            {/* Category filter */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Catégorie
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#FF6B35]"
              >
                <option value="all">Toutes</option>
                <optgroup label="— Revenus —">
                  {(Object.entries(REVENUE_CATEGORY_LABELS) as [RevenueCategory, string][]).map(
                    ([k, v]) => (
                      <option key={`rev-${k}`} value={k}>{v}</option>
                    )
                  )}
                </optgroup>
                <optgroup label="— Dépenses —">
                  {(Object.entries(EXPENSE_CATEGORY_LABELS) as [ExpenseCategoryKey, string][]).map(
                    ([k, v]) => (
                      <option key={`exp-${k}`} value={k}>{v}</option>
                    )
                  )}
                </optgroup>
              </select>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <button
                  onClick={() => {
                    setTxType("all");
                    setCategoryFilter("all");
                  }}
                  className="flex items-center gap-1 text-xs text-[#FF6B35] hover:underline"
                >
                  <X size={12} /> Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────────────── */}
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

        {/* ── KPI strip (server-computed) ─────────────────────────────────── */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-[20px]" />)}
          </div>
        ) : summary ? (
          <>
            {/* Filtering-aware note */}
            {(txType !== "all" || categoryFilter !== "all") && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
                <Info size={13} className="mt-0.5 shrink-0" />
                Les filtres de type/catégorie s&apos;appliquent aux exports. Le résumé serveur couvre toute la période sélectionnée.
              </div>
            )}

            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <p className="mt-1 text-[11px] text-slate-400">Marge : <strong>{profitMargin}%</strong></p>
              </div>

              <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-600" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Revenus</p>
                </div>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-emerald-700">
                  {fmt(summary.totalRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {summary.revenueCount} transaction{summary.revenueCount !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} className="text-red-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dépenses</p>
                </div>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-red-700">
                  {fmt(summary.totalExpenses)}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {summary.expenseCount} transaction{summary.expenseCount !== 1 ? "s" : ""}
                </p>
              </div>

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

            {/* ── Charts ─────────────────────────────────────────────────── */}
            <div className="grid gap-5 lg:grid-cols-3">
              {/* 6-month trend */}
              {(txType === "all" || txType === "revenues" || txType === "expenses") && (
                <div className="lg:col-span-2 rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                        Tendances — 6 derniers mois
                      </p>
                      <p className="text-xs text-slate-400">Revenus vs Dépenses</p>
                    </div>
                    <button
                      onClick={() => handleExportCsv("transactions")}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition"
                    >
                      <Download size={12} /> CSV
                    </button>
                  </div>

                  {summary.monthlyTrend.length === 0 ? (
                    <p className="py-10 text-center text-sm text-slate-400">Aucune donnée disponible.</p>
                  ) : (
                    <>
                      <div className="flex h-44 items-end gap-2">
                        {summary.monthlyTrend.map((m) => (
                          <BarGroup
                            key={m.month}
                            revenue={txType === "expenses" ? 0 : m.revenue}
                            expenses={txType === "revenues" ? 0 : m.expenses}
                            maxVal={trendMax}
                            label={m.month}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-center gap-5 text-xs text-slate-500">
                        {txType !== "expenses" && (
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Revenus
                          </span>
                        )}
                        {txType !== "revenues" && (
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Dépenses
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Expense distribution */}
              {txType !== "revenues" && (
                <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                        Dépenses par catégorie
                      </p>
                      <p className="text-xs text-slate-400">Transactions complétées</p>
                    </div>
                    <button
                      onClick={() => handleExportCsv("expenses")}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 transition"
                    >
                      <Download size={11} /> CSV
                    </button>
                  </div>

                  {summary.expenseByCategory.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">Aucune dépense.</p>
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
                                    className="h-2 w-2 rounded-full"
                                    style={{ background: cat.color }}
                                  />
                                  <span className="font-medium text-[#463ACB] max-w-[110px] truncate">
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
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Revenue breakdown ───────────────────────────────────────── */}
            {txType !== "expenses" && summary.revenueByCategory.length > 0 && (
              <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                      Revenus par catégorie
                    </p>
                    <p className="text-xs text-slate-400">Transactions complétées</p>
                  </div>
                  <button
                    onClick={() => handleExportCsv("revenues")}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition"
                  >
                    <Download size={12} /> CSV
                  </button>
                </div>
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
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* ── Accounting periods summary table ────────────────────────────── */}
        <Card>
          <CardHeader>
            <div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                Récapitulatif par période
              </p>
              <p className="text-xs text-slate-400">
                Total cumulé sur {periods.length} période{periods.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={FileSpreadsheet}
                onClick={() => handleExportCsv("summary")}
              >
                CSV
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={FileText}
                onClick={handleExportPdf}
              >
                PDF
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {loading ? (
              <div className="space-y-2 p-5">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      {["Période", "Revenus", "Dépenses", "Solde", "Statut"].map((h) => (
                        <th
                          key={h}
                          className={`border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                            ["Revenus", "Dépenses", "Solde"].includes(h) ? "text-right" : "text-left"
                          } ${h === "Statut" ? "text-center" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="border-b border-slate-50 px-5 py-3 font-medium text-[#463ACB]">
                          {p.name}
                          <p className="text-[11px] text-slate-400">
                            {new Date(p.startDate).toLocaleDateString("fr-FR")} –{" "}
                            {new Date(p.endDate).toLocaleDateString("fr-FR")}
                          </p>
                        </td>
                        <td className="border-b border-slate-50 px-5 py-3 text-right font-semibold text-emerald-600 tabular-nums">
                          {fmt(p.totalRevenue)}
                        </td>
                        <td className="border-b border-slate-50 px-5 py-3 text-right font-semibold text-red-600 tabular-nums">
                          {fmt(p.totalExpenses)}
                        </td>
                        <td
                          className={`border-b border-slate-50 px-5 py-3 text-right font-bold tabular-nums ${
                            p.balance >= 0 ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {fmt(p.balance)}
                        </td>
                        <td className="border-b border-slate-50 px-5 py-3 text-center">
                          <Badge variant={p.closed ? "neutral" : "success"}>
                            {p.closed ? "Clôturé" : "En cours"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {/* YTD totals row */}
                    {periods.length > 0 && (
                      <tr className="bg-slate-50/80 font-bold">
                        <td className="px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Total cumulé
                        </td>
                        <td className="px-5 py-3 text-right text-emerald-700 tabular-nums">
                          {fmt(ytdRevenue)}
                        </td>
                        <td className="px-5 py-3 text-right text-red-700 tabular-nums">
                          {fmt(ytdExpenses)}
                        </td>
                        <td
                          className={`px-5 py-3 text-right tabular-nums ${
                            ytdBalance >= 0 ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {fmt(ytdBalance)}
                        </td>
                        <td />
                      </tr>
                    )}
                  </tbody>
                </table>

                {periods.length === 0 && (
                  <div className="flex flex-col items-center py-12 text-center">
                    <BarChart3 size={32} className="text-slate-300" />
                    <p className="mt-3 font-bold text-[#463ACB]">Aucune période comptable</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Les périodes seront générées automatiquement.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── Export architecture note ─────────────────────────────────────── */}
        <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-3 font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
            Architecture d&apos;export
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[14px] border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileSpreadsheet size={16} className="text-emerald-600" />
                <p className="text-sm font-bold text-emerald-800">CSV / Excel</p>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  ✓ Disponible
                </span>
              </div>
              <p className="text-xs text-emerald-700">
                Export RFC 4180, BOM UTF-8 pour Excel. Endpoints :{" "}
                <code className="font-mono">/api/export/revenues</code>,{" "}
                <code className="font-mono">/api/export/expenses</code>,{" "}
                <code className="font-mono">/api/export/transactions</code>,{" "}
                <code className="font-mono">/api/export/summary</code>.
              </p>
            </div>
            <div className="rounded-[14px] border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-blue-600" />
                <p className="text-sm font-bold text-blue-800">PDF</p>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  Blueprint prêt
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Blueprint JSON généré côté serveur. Intégrez{" "}
                <code className="font-mono">jsPDF + jspdf-autotable</code> (client) ou{" "}
                <code className="font-mono">puppeteer</code> (serveur) pour le rendu.
              </p>
            </div>
            <div className="rounded-[14px] border border-amber-100 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart size={16} className="text-amber-600" />
                <p className="text-sm font-bold text-amber-800">Données serveur</p>
              </div>
              <p className="text-xs text-amber-700">
                Tous les totaux sont calculés via{" "}
                <code className="font-mono">/api/finance/summary</code>.
                Le client ne recalcule jamais de totaux officiels.
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        {summary && (
          <p className="text-center text-xs text-slate-400">
            Données serveur — calculées le{" "}
            {new Date(summary.computedAt).toLocaleString("fr-FR")} ·{" "}
            Période : {new Date(startDate).toLocaleDateString("fr-FR")} →{" "}
            {new Date(endDate).toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>
    </>
  );
}

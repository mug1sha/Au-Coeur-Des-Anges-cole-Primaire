"use client";

/**
 * FinanceOverviewClient — /admin/finance main page.
 *
 * Shows:
 *   - Quick-nav cards to sub-sections (Revenus, Dépenses, Comptabilité, Rapports)
 *   - Server-computed KPI strip (balance, monthly revenue, monthly expenses)
 *   - Monthly trend chart (6 months)
 *   - Expense distribution breakdown
 *   - Recent transactions list
 *
 * All financial totals are fetched from /api/finance/summary (server-computed).
 * Client never calculates authoritative totals.
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, Calculator, BarChart3,
  ArrowRight, RefreshCw, AlertCircle, Scale, Clock,
} from "lucide-react";
import type { FinanceSummary } from "@/lib/admin-types";
import { useAdminSession } from "@/lib/AdminSessionContext";
import { getFinancePermissions } from "@/lib/finance-guard";

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " RWF";
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "k";
  return String(n);
}

// ─── Sparkline bar ─────────────────────────────────────────────────────────
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-full w-full flex items-end">
      <div
        className="w-full rounded-t-sm transition-all duration-500"
        style={{ height: `${Math.max(pct, 4)}%`, background: color }}
      />
    </div>
  );
}

// ─── Quick-nav cards ───────────────────────────────────────────────────────
const SECTIONS = [
  {
    href: "/admin/finance/revenues",
    label: "Revenus",
    desc: "Frais scolaires, inscriptions, cantine…",
    icon: TrendingUp,
    accent: "bg-emerald-50 border-emerald-200 text-emerald-700",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    href: "/admin/finance/expenses",
    label: "Dépenses",
    desc: "Salaires, fournitures, infrastructure…",
    icon: TrendingDown,
    accent: "bg-red-50 border-red-200 text-red-700",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    href: "/admin/finance/accounting",
    label: "Comptabilité",
    desc: "Solde, bilan mensuel, périodes comptables",
    icon: Calculator,
    accent: "bg-[#FF6B35]/5 border-[#FF6B35]/20 text-[#FF6B35]",
    iconBg: "bg-[#FF6B35]/10",
    iconColor: "text-[#FF6B35]",
  },
  {
    href: "/admin/finance/reports",
    label: "Rapports",
    desc: "Filtrer, analyser et exporter en CSV / PDF",
    icon: BarChart3,
    accent: "bg-blue-50 border-blue-200 text-blue-700",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
] as const;

// ─── Main component ────────────────────────────────────────────────────────
export default function FinanceOverviewClient() {
  const { session } = useAdminSession();
  const { canRead } = getFinancePermissions(session?.role);

  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadSummary = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/finance/summary", {
        headers: { Authorization: `Bearer ${session?.token ?? ""}` },
        cache: "no-store",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json();
      setSummary(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.token]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadSummary(); }, [loadSummary]);

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={36} className="text-red-400" />
        <p className="mt-3 font-bold text-[#463ACB]">Accès refusé</p>
        <p className="mt-1 text-sm text-slate-400">Vous n&apos;avez pas les permissions pour accéder aux données financières.</p>
      </div>
    );
  }

  // Trend chart max
  const trendMax = summary
    ? Math.max(...summary.monthlyTrend.flatMap((m) => [m.revenue, m.expenses]))
    : 0;

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#463ACB]">
            Finance
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Vue d&apos;ensemble financière — Au Coeur Des Anges
          </p>
        </div>
        <button
          onClick={() => loadSummary(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          aria-label="Actualiser les données"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* ── Navigation cards ─────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`group flex flex-col gap-3 rounded-[20px] border bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 ${s.accent}`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.iconBg}`}>
                <Icon size={20} className={s.iconColor} />
              </div>
              <div>
                <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">{s.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{s.desc}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-xs font-semibold">
                Accéder <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── KPI strip — server-computed ──────────────────────────────────── */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-[20px] bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => loadSummary()}
            className="ml-auto text-xs underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      ) : summary ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Balance */}
            <div className={`rounded-[20px] border p-5 shadow-sm ${
              summary.balance >= 0 ? "border-emerald-100 bg-emerald-50" : "border-red-100 bg-red-50"
            }`}>
              <div className="flex items-center gap-2">
                <Scale size={14} className={summary.balance >= 0 ? "text-emerald-600" : "text-red-600"} />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Solde net</p>
              </div>
              <p className={`mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold ${
                summary.balance >= 0 ? "text-emerald-700" : "text-red-700"
              }`}>
                {fmt(summary.balance)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Calculé le {new Date(summary.computedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* Revenue */}
            <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-600" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Revenus (période)</p>
              </div>
              <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-emerald-700">
                {fmt(summary.totalRevenue)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">{summary.revenueCount} transaction{summary.revenueCount !== 1 ? "s" : ""} complétée{summary.revenueCount !== 1 ? "s" : ""}</p>
            </div>

            {/* Expenses */}
            <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingDown size={14} className="text-red-500" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dépenses (période)</p>
              </div>
              <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-red-700">
                {fmt(summary.totalExpenses)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">{summary.expenseCount} transaction{summary.expenseCount !== 1 ? "s" : ""} complétée{summary.expenseCount !== 1 ? "s" : ""}</p>
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
            {/* Monthly trend chart */}
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
                  className="text-xs font-medium text-[#FF6B35] hover:underline"
                >
                  Voir les rapports →
                </Link>
              </div>

              <div className="flex h-44 items-end gap-2">
                {summary.monthlyTrend.map((m) => (
                  <div key={m.month} className="flex flex-1 flex-col gap-1">
                    {/* Value labels */}
                    <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                      <span className="text-emerald-600">{fmtShort(m.revenue)}</span>
                      <span className="text-red-500">{fmtShort(m.expenses)}</span>
                    </div>
                    {/* Bars */}
                    <div className="flex flex-1 items-end gap-0.5">
                      <div className="flex-1 h-32">
                        <MiniBar value={m.revenue} max={trendMax} color="#22c55e" />
                      </div>
                      <div className="flex-1 h-32">
                        <MiniBar value={m.expenses} max={trendMax} color="#ef4444" />
                      </div>
                    </div>
                    {/* Month label */}
                    <p className="text-center text-[10px] font-medium text-slate-400">{m.month}</p>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center justify-center gap-5 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Revenus
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Dépenses
                </span>
              </div>
            </div>

            {/* Expense distribution */}
            <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                  Répartition des dépenses
                </p>
                <p className="text-xs text-slate-400">Par catégorie</p>
              </div>

              {summary.expenseByCategory.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">Aucune dépense enregistrée</p>
              ) : (
                <div className="space-y-2.5">
                  {summary.expenseByCategory
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 6)
                    .map((cat) => {
                      const pct = summary.totalExpenses > 0
                        ? Math.round((cat.amount / summary.totalExpenses) * 100)
                        : 0;
                      return (
                        <div key={cat.category}>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="font-medium text-[#463ACB] truncate max-w-[120px]">{cat.label}</span>
                            <span className="text-slate-400 tabular-nums">{pct}%</span>
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
                  {summary.expenseByCategory.length > 6 && (
                    <p className="text-center text-xs text-slate-400">
                      + {summary.expenseByCategory.length - 6} autres catégories
                    </p>
                  )}
                </div>
              )}

              <Link
                href="/admin/finance/accounting"
                className="mt-4 flex items-center gap-1 text-xs font-medium text-[#FF6B35] hover:underline"
              >
                Voir la comptabilité <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* ── Revenue by category strip ──────────────────────────────── */}
          {summary.revenueByCategory.length > 0 && (
            <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
              <p className="mb-3 font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                Revenus par catégorie
              </p>
              <div className="flex flex-wrap gap-3">
                {summary.revenueByCategory
                  .sort((a, b) => b.amount - a.amount)
                  .map((cat) => (
                    <div
                      key={cat.category}
                      className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <span className="text-xs font-semibold text-[#463ACB]">{cat.label}</span>
                      <span className="text-xs font-bold text-emerald-700">{fmt(cat.amount)}</span>
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        ×{cat.count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── Server-trust notice ───────────────────────────────────────── */}
          <p className="text-center text-xs text-slate-400">
            Tous les totaux sont calculés côté serveur — actualisé le{" "}
            {new Date(summary.computedAt).toLocaleString("fr-FR")}
          </p>
        </>
      ) : null}
    </div>
  );
}

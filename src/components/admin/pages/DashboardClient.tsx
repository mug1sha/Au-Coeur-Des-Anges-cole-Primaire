"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap, TrendingUp, TrendingDown, Scale,
  Megaphone, BookOpen, Plus, ArrowRight,
  CalendarDays,
} from "lucide-react";
import { getDashboardStats } from "@/lib/admin-data";
import type { DashboardStats, DashboardTransaction, DashboardAnnouncement } from "@/lib/admin-types";
import { Badge, Card, CardHeader, CardBody, Skeleton } from "@/components/admin/ui";
import { getAdminSession } from "@/lib/admin-auth";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function fmtCurrency(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " RWF";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function todayFrench() {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

// ─────────────────────────────────────────────
// KPI CARD — rich variant with trend indicator
// ─────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  accent: string; // tailwind bg for icon ring
  iconColor: string;
  href?: string;
  suffix?: string;
}

function KpiCard({ label, value, change, icon: Icon, accent, iconColor, href, suffix }: KpiCardProps) {
  const body = (
    <div className="group flex h-full flex-col justify-between rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
          <Icon size={20} className={iconColor} />
        </div>
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              change > 0
                ? "bg-emerald-50 text-emerald-700"
                : change < 0
                ? "bg-red-50 text-red-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {change > 0 ? "▲" : change < 0 ? "▼" : "–"}
            {change !== 0 ? ` ${Math.abs(change)}%` : " stable"}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="font-[family-name:var(--font-heading)] text-2xl font-extrabold leading-none text-[#463ACB]">
          {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
          {suffix && <span className="ml-1 text-sm font-medium text-slate-400">{suffix}</span>}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-400">{label}</p>
      </div>

      {href && (
        <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#FF6B35] opacity-0 transition group-hover:opacity-100">
          Voir le détail <ArrowRight size={11} />
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{body}</Link>;
  }
  return body;
}

// ─────────────────────────────────────────────
// COMPARISON CHART — Revenus vs Dépenses
// Pure SVG line-area chart
// ─────────────────────────────────────────────
interface ComparisonChartProps {
  data: { month: string; revenue: number; expenses: number }[];
}

function ComparisonChart({ data }: ComparisonChartProps) {
  const W = 600;
  const H = 200;
  const PAD = { top: 20, right: 16, bottom: 32, left: 72 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const allValues = data.flatMap((d) => [d.revenue, d.expenses]);
  const maxVal = Math.max(...allValues) * 1.1;
  const minVal = 0;

  const xStep = chartW / (data.length - 1);
  const yScale = (v: number) => chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const points = (key: "revenue" | "expenses") =>
    data.map((d, i) => [PAD.left + i * xStep, PAD.top + yScale(d[key])]);

  const pathD = (pts: number[][]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  const areaD = (pts: number[][]) => {
    const bottom = `L${pts[pts.length - 1][0].toFixed(1)},${(PAD.top + chartH).toFixed(1)} L${pts[0][0].toFixed(1)},${(PAD.top + chartH).toFixed(1)} Z`;
    return pathD(pts) + " " + bottom;
  };

  const revPts = points("revenue");
  const expPts = points("expenses");

  // Y-axis ticks
  const TICKS = 4;
  const yTicks = Array.from({ length: TICKS + 1 }, (_, i) => minVal + (maxVal / TICKS) * i);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      aria-label="Graphique revenus vs dépenses"
      role="img"
    >
      <defs>
        <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y grid lines + labels */}
      {yTicks.map((tick) => {
        const y = PAD.top + yScale(tick);
        return (
          <g key={tick}>
            <line
              x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y}
              stroke="#f1f5f9" strokeWidth="1"
            />
            <text
              x={PAD.left - 8} y={y + 4}
              textAnchor="end" fontSize="9" fill="#94a3b8"
            >
              {tick >= 1_000_000
                ? `${(tick / 1_000_000).toFixed(1)}M`
                : tick >= 1_000
                ? `${(tick / 1_000).toFixed(0)}k`
                : tick.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* X labels */}
      {data.map((d, i) => (
        <text
          key={d.month}
          x={PAD.left + i * xStep}
          y={H - 6}
          textAnchor="middle"
          fontSize="10"
          fill="#94a3b8"
          fontWeight="500"
        >
          {d.month}
        </text>
      ))}

      {/* Area fills */}
      <path d={areaD(revPts)} fill="url(#gradRev)" />
      <path d={areaD(expPts)} fill="url(#gradExp)" />

      {/* Lines */}
      <path d={pathD(revPts)} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pathD(expPts)} fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {revPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#22c55e" stroke="white" strokeWidth="1.5" />
      ))}
      {expPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#FF6B35" stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────
// DONUT CHART — Dépenses par catégorie (SVG)
// ─────────────────────────────────────────────
function DonutChart({ data }: { data: { category: string; amount: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.amount, 0);
  const R = 42;
  const cx = 50;
  const cy = 50;
  const circ = 2 * Math.PI * R;

  const arcs = data.reduce<{ arcs: React.ReactElement[]; offset: number }>(
    (acc, d) => {
      const dash = (d.amount / total) * circ;
      acc.arcs.push(
        <circle
          key={d.category}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={d.color}
          strokeWidth="16"
          strokeDasharray={`${dash.toFixed(2)} ${(circ - dash).toFixed(2)}`}
          strokeDashoffset={(-acc.offset).toFixed(2)}
          transform="rotate(-90 50 50)"
          strokeLinecap="butt"
        />
      );
      return { arcs: acc.arcs, offset: acc.offset + dash };
    },
    { arcs: [], offset: 0 }
  ).arcs;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* SVG */}
      <div className="relative mx-auto shrink-0" style={{ width: 120, height: 120 }}>
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {arcs}
          {/* Center text */}
          <text x="50" y="47" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="500">Total</text>
          <text x="50" y="58" textAnchor="middle" fontSize="8" fill="#463ACB" fontWeight="700">
            {total >= 1_000_000 ? `${(total / 1_000_000).toFixed(1)}M` : `${(total / 1_000).toFixed(0)}k`}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="grid w-full grid-cols-2 gap-x-3 gap-y-1.5">
        {data.map((d) => {
          const pct = ((d.amount / total) * 100).toFixed(0);
          return (
            <div key={d.category} className="flex items-center gap-1.5 min-w-0">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.color }} />
              <span className="truncate text-[11px] text-slate-500">{d.category}</span>
              <span className="ml-auto shrink-0 text-[11px] font-semibold text-[#463ACB]">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SKELETON LOADERS
// ─────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-48" />
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-36 rounded-[20px]" />)}
      </div>
      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Skeleton className="lg:col-span-2 h-72 rounded-[20px]" />
        <Skeleton className="h-72 rounded-[20px]" />
      </div>
      {/* Bottom row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Skeleton className="lg:col-span-2 h-80 rounded-[20px]" />
        <div className="space-y-5">
          <Skeleton className="h-52 rounded-[20px]" />
          <Skeleton className="h-40 rounded-[20px]" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TRANSACTION STATUS BADGE
// ─────────────────────────────────────────────
const TX_STATUS: Record<string, "success" | "warning" | "neutral"> = {
  completed: "success", pending: "warning", cancelled: "neutral",
};
const TX_STATUS_LABELS: Record<string, string> = {
  completed: "Complété", pending: "En attente", cancelled: "Annulé",
};
const ANN_STATUS: Record<string, "success" | "warning" | "neutral"> = {
  published: "success", draft: "warning", archived: "neutral",
};
const ANN_STATUS_LABELS: Record<string, string> = {
  published: "Publié", draft: "Brouillon", archived: "Archivé",
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const session = getAdminSession();

  useEffect(() => {
    getDashboardStats()
      .then((s) => { setStats(s); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  // ── Loading ──────────────────────────────
  if (loading) return <DashboardSkeleton />;

  // ── Error ────────────────────────────────
  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[20px] border border-red-100 bg-red-50 py-20 text-center">
        <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-red-700">Erreur de chargement</p>
        <p className="mt-1 text-sm text-red-500">Impossible de charger les données du tableau de bord.</p>
        <button
          onClick={() => { setLoading(true); setError(false); getDashboardStats().then((s) => { setStats(s); setLoading(false); }).catch(() => { setError(true); setLoading(false); }); }}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const adminName = session?.name?.split(" ")[0] ?? "Administrateur";

  // ── Populated ────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── GREETING ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#463ACB] md:text-3xl">
            {greeting()}, {adminName} 👋
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm capitalize text-slate-400">
            <CalendarDays size={13} />
            {todayFrench()}
          </p>
        </div>
        {/* Quick context pill */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Année scolaire 2026 – 2027
        </div>
      </div>

      {/* ── 6 KPI CARDS ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Enseignants actifs"
          value={stats.totalTeachers}
          change={stats.teachersChange}
          icon={GraduationCap}
          accent="bg-violet-100"
          iconColor="text-violet-600"
          href="/admin/teachers"
        />
        <KpiCard
          label="Services actifs"
          value={stats.activeServices}
          change={stats.servicesChange}
          icon={BookOpen}
          accent="bg-blue-100"
          iconColor="text-blue-600"
          href="/admin/services"
        />
        <KpiCard
          label="Revenus ce mois"
          value={fmtCurrency(stats.monthlyRevenue)}
          change={stats.revenueChange}
          icon={TrendingUp}
          accent="bg-emerald-100"
          iconColor="text-emerald-600"
          href="/admin/finance/revenues"
        />
        <KpiCard
          label="Dépenses ce mois"
          value={fmtCurrency(stats.monthlyExpenses)}
          change={stats.expenseChange}
          icon={TrendingDown}
          accent="bg-red-100"
          iconColor="text-red-500"
          href="/admin/finance/expenses"
        />
        <KpiCard
          label="Solde actuel"
          value={fmtCurrency(stats.monthlyBalance)}
          change={stats.balanceChange}
          icon={Scale}
          accent="bg-[#FF6B35]/10"
          iconColor="text-[#FF6B35]"
          href="/admin/finance/accounting"
        />
        <KpiCard
          label="Annonces publiées"
          value={stats.publishedAnnouncements}
          change={stats.announcementsChange}
          icon={Megaphone}
          accent="bg-amber-100"
          iconColor="text-amber-600"
          href="/admin/announcements"
        />
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Comparison chart — Revenus vs Dépenses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                Revenus vs Dépenses
              </p>
              <p className="text-xs text-slate-400">Activité financière mensuelle — 6 derniers mois</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Revenus
              </span>
              <span className="flex items-center gap-1.5 text-[#FF6B35]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B35]" />Dépenses
              </span>
            </div>
          </CardHeader>
          <CardBody className="pt-2 pb-5">
            <ComparisonChart data={stats.comparisonByMonth} />
          </CardBody>
        </Card>

        {/* Donut — Dépenses par catégorie */}
        <Card>
          <CardHeader>
            <div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                Dépenses par catégorie
              </p>
              <p className="text-xs text-slate-400">Répartition du mois en cours</p>
            </div>
            <Link
              href="/admin/finance/expenses"
              className="flex items-center gap-1 text-xs font-medium text-[#FF6B35] hover:underline"
            >
              Détail <ArrowRight size={11} />
            </Link>
          </CardHeader>
          <CardBody>
            <DonutChart data={stats.expenseByCategory} />
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total dépenses</span>
                <span className="font-bold text-[#463ACB]">
                  {fmtCurrency(stats.expenseByCategory.reduce((s, d) => s + d.amount, 0))}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── TRANSACTIONS + RIGHT COLUMN ── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                Transactions récentes
              </p>
              <p className="text-xs text-slate-400">Derniers mouvements financiers</p>
            </div>
            <Link
              href="/admin/finance/revenues"
              className="flex items-center gap-1 text-xs font-medium text-[#FF6B35] hover:underline"
            >
              Voir tout <ArrowRight size={11} />
            </Link>
          </CardHeader>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="bg-slate-50/60 px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date</th>
                  <th className="bg-slate-50/60 px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Description</th>
                  <th className="bg-slate-50/60 px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Type</th>
                  <th className="bg-slate-50/60 px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Catégorie</th>
                  <th className="bg-slate-50/60 px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">Montant</th>
                  <th className="bg-slate-50/60 px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((tx: DashboardTransaction, idx) => (
                  <tr
                    key={tx.id}
                    className={`transition hover:bg-slate-50/60 ${idx !== stats.recentTransactions.length - 1 ? "border-b border-slate-50" : ""}`}
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-400">{fmtDate(tx.date)}</td>
                    <td className="px-5 py-3">
                      <p className="max-w-[200px] truncate text-sm font-medium text-[#463ACB]">{tx.description}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tx.type === "revenue" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {tx.type === "revenue" ? "↑ Revenu" : "↓ Dépense"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="neutral">{tx.category}</Badge>
                    </td>
                    <td className={`whitespace-nowrap px-5 py-3 text-right text-sm font-bold ${tx.type === "revenue" ? "text-emerald-700" : "text-[#463ACB]"}`}>
                      {tx.type === "revenue" ? "+" : "−"} {fmtCurrency(tx.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={TX_STATUS[tx.status] ?? "neutral"}>
                        {TX_STATUS_LABELS[tx.status] ?? tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-50 md:hidden">
            {stats.recentTransactions.map((tx: DashboardTransaction) => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg ${tx.type === "revenue" ? "bg-emerald-50" : "bg-red-50"}`}>
                  {tx.type === "revenue" ? <TrendingUp size={14} className="text-emerald-600" /> : <TrendingDown size={14} className="text-red-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#463ACB]">{tx.description}</p>
                  <p className="text-xs text-slate-400">{fmtDate(tx.date)} · {tx.category}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === "revenue" ? "text-emerald-700" : "text-red-600"}`}>
                    {tx.type === "revenue" ? "+" : "−"}{(tx.amount / 1000).toFixed(0)}k
                  </p>
                  <Badge variant={TX_STATUS[tx.status] ?? "neutral"}>
                    {TX_STATUS_LABELS[tx.status] ?? tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right column: Announcements + Quick Actions */}
        <div className="flex flex-col gap-5">

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                Annonces récentes
              </p>
              <Link href="/admin/announcements" className="flex items-center gap-1 text-xs font-medium text-[#FF6B35] hover:underline">
                Gérer <ArrowRight size={11} />
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              <ul>
                {stats.recentAnnouncements.map((ann: DashboardAnnouncement, idx) => (
                  <li
                    key={ann.id}
                    className={`px-5 py-3 transition hover:bg-slate-50/60 ${idx !== stats.recentAnnouncements.length - 1 ? "border-b border-slate-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#463ACB]">{ann.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                            {ann.category}
                          </span>
                          <span className="text-[10px] text-slate-300">{fmtDate(ann.publishedAt)}</span>
                        </div>
                      </div>
                      <Badge variant={ANN_STATUS[ann.status] ?? "neutral"}>
                        {ANN_STATUS_LABELS[ann.status] ?? ann.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                Actions rapides
              </p>
            </CardHeader>
            <CardBody className="p-3">
              {[
                { href: "/admin/teachers", icon: GraduationCap, label: "Ajouter un enseignant", color: "bg-violet-50 text-violet-600" },
                { href: "/admin/finance/expenses", icon: TrendingDown, label: "Ajouter une dépense", color: "bg-red-50 text-red-500" },
                { href: "/admin/announcements", icon: Megaphone, label: "Publier une annonce", color: "bg-amber-50 text-amber-600" },
                { href: "/admin/services", icon: BookOpen, label: "Ajouter un service", color: "bg-blue-50 text-blue-600" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#463ACB]"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition group-hover:scale-105 ${action.color}`}>
                      <Icon size={14} />
                    </div>
                    <span className="flex-1">{action.label}</span>
                    <Plus size={13} className="shrink-0 text-slate-300 group-hover:text-[#FF6B35] transition" />
                  </Link>
                );
              })}
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
}

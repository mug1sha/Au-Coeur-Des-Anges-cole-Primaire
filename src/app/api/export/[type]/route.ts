/**
 * GET /api/export/[type]
 *
 * Export architecture for financial data.
 * Supported types: revenues, expenses, summary, transactions
 *
 * Query params:
 *   format      "csv" | "pdf"  (default: csv)
 *   startDate   ISO date string (optional)
 *   endDate     ISO date string (optional)
 *   category    category key (optional)
 *   status      transaction status filter (optional)
 *
 * Security:
 *   - Requires valid admin session with finance read permission
 *   - All data is filtered server-side before being returned
 *
 * Current implementation:
 *   - CSV: fully implemented — generates RFC 4180 CSV
 *   - PDF: architecture ready — returns a structured JSON blueprint
 *         that can be rendered by a PDF library (jsPDF / puppeteer / WeasyPrint)
 *         once integrated. A TODO comment marks the PDF generation point.
 *
 * Extension points:
 *   1. Install `jspdf` + `jspdf-autotable` for client-side PDF (no server change needed)
 *   2. Or install `puppeteer` / use a headless render service for server-side PDF
 *   3. Or use a report service like Jasper, AWS Textract, etc.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { checkFinancePermission } from "@/lib/finance-guard";
import {
  getRevenues, getExpenses, getFinanceSummary,
} from "@/lib/admin-data";
import {
  REVENUE_CATEGORY_LABELS, EXPENSE_CATEGORY_LABELS,
} from "@/lib/admin-types";

type ExportType = "revenues" | "expenses" | "summary" | "transactions";

// ── CSV helpers ──────────────────────────────────────────────────────────────
function escCsv(v: unknown): string {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function row(cells: unknown[]): string {
  return cells.map(escCsv).join(",");
}

const METHOD_FR: Record<string, string> = {
  cash: "Espèces",
  bank_transfer: "Virement bancaire",
  mobile_money: "Mobile Money",
  check: "Chèque",
};

const STATUS_FR: Record<string, string> = {
  completed: "Complété",
  pending: "En attente",
  cancelled: "Annulé",
};

// ── Handler ──────────────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  // Auth
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const auth = await verifyAdminSession(token, "finance");
  if (!auth.valid) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const permCheck = checkFinancePermission(auth.session ?? null, "read");
  if (!permCheck.allowed) {
    return NextResponse.json({ error: permCheck.reason }, { status: 403 });
  }

  const { type } = await context.params;
  const exportType = type as ExportType;
  const { searchParams } = req.nextUrl;
  const format    = (searchParams.get("format") ?? "csv") as "csv" | "pdf";
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate   = searchParams.get("endDate")   ?? undefined;
  const category  = searchParams.get("category")  ?? undefined;
  const status    = searchParams.get("status")    ?? undefined;

  if (!["revenues", "expenses", "summary", "transactions"].includes(exportType)) {
    return NextResponse.json({ error: "Type d'export non supporté." }, { status: 400 });
  }

  const now = new Date().toISOString().slice(0, 10);
  const filename = `aucoeurddesanges_${exportType}_${now}`;

  try {
    if (format === "csv") {
      const csv = await buildCsv(exportType, { startDate, endDate, category, status });
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}.csv"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // PDF: return a structured JSON blueprint
    // TODO: replace with actual PDF generation using jsPDF / puppeteer when library is installed.
    // The client can use this JSON to generate the PDF client-side via jsPDF.
    const blueprint = await buildPdfBlueprint(exportType, { startDate, endDate, category, status });
    return NextResponse.json(blueprint, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });

  } catch (err) {
    console.error(`[api/export/${type}] Error:`, err);
    return NextResponse.json({ error: "Erreur lors de la génération de l'export." }, { status: 500 });
  }
}

// ── CSV builders ─────────────────────────────────────────────────────────────
async function buildCsv(
  type: ExportType,
  opts: { startDate?: string; endDate?: string; category?: string; status?: string }
): Promise<string> {
  const lines: string[] = [];
  // BOM for Excel compatibility
  const bom = "\uFEFF";

  if (type === "revenues") {
    const { data } = await getRevenues({ pageSize: 10_000 });
    const filtered = applyFilters(data, opts);
    lines.push(row(["Référence", "Date", "Description", "Élève", "Catégorie", "Mode de paiement", "Statut", "Montant (RWF)", "Notes"]));
    filtered.forEach((r) => {
      lines.push(row([
        r.reference ?? "", r.date, r.description, r.studentName ?? "",
        REVENUE_CATEGORY_LABELS[r.category] ?? r.category,
        METHOD_FR[r.paymentMethod] ?? r.paymentMethod,
        STATUS_FR[r.status] ?? r.status,
        r.status === "cancelled" ? 0 : r.amount,
        r.notes ?? "",
      ]));
    });
    const total = filtered.filter((r) => r.status === "completed").reduce((s, r) => s + r.amount, 0);
    lines.push("");
    lines.push(row(["", "", "", "", "", "", "TOTAL", total, ""]));
  }

  else if (type === "expenses") {
    const { data } = await getExpenses({ pageSize: 10_000 });
    const filtered = applyFilters(data, opts);
    lines.push(row(["Référence", "Date", "Description", "Fournisseur", "Catégorie", "Mode de paiement", "Statut", "Montant (RWF)", "Reçu", "Notes"]));
    filtered.forEach((e) => {
      lines.push(row([
        e.reference ?? "", e.date, e.description, e.vendor ?? "",
        EXPENSE_CATEGORY_LABELS[e.category] ?? e.category,
        METHOD_FR[e.paymentMethod] ?? e.paymentMethod,
        STATUS_FR[e.status] ?? e.status,
        e.status === "cancelled" ? 0 : e.amount,
        e.receiptUrl ? "Oui" : "Non",
        e.notes ?? "",
      ]));
    });
    const total = filtered.filter((e) => e.status === "completed").reduce((s, e) => s + e.amount, 0);
    lines.push("");
    lines.push(row(["", "", "", "", "", "", "TOTAL", total, "", ""]));
  }

  else if (type === "summary") {
    const summary = await getFinanceSummary(opts.startDate, opts.endDate);
    lines.push(row(["Indicateur", "Montant (RWF)"]));
    lines.push(row(["Total revenus", summary.totalRevenue]));
    lines.push(row(["Total dépenses", summary.totalExpenses]));
    lines.push(row(["Solde net", summary.balance]));
    lines.push(row(["Revenus en attente", summary.pendingRevenue]));
    lines.push(row(["Dépenses en attente", summary.pendingExpenses]));
    lines.push("");
    lines.push(row(["Mois", "Revenus", "Dépenses", "Solde"]));
    summary.monthlyTrend.forEach((m) => {
      lines.push(row([m.month, m.revenue, m.expenses, m.balance]));
    });
  }

  else { // transactions
    const [revs, exps] = await Promise.all([
      getRevenues({ pageSize: 10_000 }),
      getExpenses({ pageSize: 10_000 }),
    ]);
    lines.push(row(["Type", "Référence", "Date", "Description", "Catégorie", "Mode", "Statut", "Montant (RWF)"]));
    applyFilters(revs.data, opts).forEach((r) => {
      lines.push(row(["Revenu", r.reference ?? "", r.date, r.description,
        REVENUE_CATEGORY_LABELS[r.category] ?? r.category,
        METHOD_FR[r.paymentMethod], STATUS_FR[r.status],
        r.status === "cancelled" ? 0 : r.amount]));
    });
    applyFilters(exps.data, opts).forEach((e) => {
      lines.push(row(["Dépense", e.reference ?? "", e.date, e.description,
        EXPENSE_CATEGORY_LABELS[e.category] ?? e.category,
        METHOD_FR[e.paymentMethod], STATUS_FR[e.status],
        e.status === "cancelled" ? 0 : e.amount]));
    });
  }

  return bom + lines.join("\r\n");
}

// ── PDF blueprint ─────────────────────────────────────────────────────────────
async function buildPdfBlueprint(
  type: ExportType,
  opts: { startDate?: string; endDate?: string; category?: string; status?: string }
) {
  const summary = type === "summary" || type === "transactions"
    ? await getFinanceSummary(opts.startDate, opts.endDate)
    : null;

  const now = new Date();
  return {
    _type: "pdf_blueprint",
    _version: "1.0",
    _note: "Pass this JSON to jsPDF/puppeteer to render the PDF report.",
    meta: {
      schoolName: "Au Coeur Des Anges — Crèche & Maternelle",
      reportType: type,
      generatedAt: now.toISOString(),
      period: { startDate: opts.startDate, endDate: opts.endDate },
    },
    summary,
    // TODO: add table rows for the requested type
    rows: [],
  };
}

// ── Filter helpers ────────────────────────────────────────────────────────────
function applyFilters<T extends { status?: string; category?: string; date?: string }>(
  items: T[],
  opts: { startDate?: string; endDate?: string; category?: string; status?: string }
): T[] {
  return items.filter((item) => {
    if (opts.status && item.status !== opts.status) return false;
    if (opts.category && item.category !== opts.category) return false;
    if (opts.startDate && item.date && item.date < opts.startDate) return false;
    if (opts.endDate && item.date && item.date > opts.endDate) return false;
    return true;
  });
}

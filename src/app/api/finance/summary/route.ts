/**
 * GET /api/finance/summary
 *
 * Returns a server-computed FinanceSummary for the requested period.
 * Financial totals MUST come from this endpoint — clients must not
 * compute their own totals from raw transaction lists.
 *
 * Query params:
 *   startDate  ISO date string (optional, defaults to first day of current month)
 *   endDate    ISO date string (optional, defaults to last day of current month)
 *
 * Security:
 *   - Requires a valid admin session token in the Authorization header
 *   - Only super_admin, admin, and accountant roles may access this endpoint
 *
 * TODO: replace verifyAdminSession() with real JWT verification.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { checkFinancePermission } from "@/lib/finance-guard";
import { getFinanceSummary } from "@/lib/admin-data";

export async function GET(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const auth = await verifyAdminSession(token, "finance");

  if (!auth.valid) {
    return NextResponse.json({ error: auth.error ?? "Non autorisé." }, { status: 401 });
  }

  const permCheck = checkFinancePermission(auth.session ?? null, "read");
  if (!permCheck.allowed) {
    return NextResponse.json({ error: permCheck.reason }, { status: 403 });
  }

  // ── Parse query params ──────────────────────────────────────────────────────
  const { searchParams } = req.nextUrl;
  const startDate = searchParams.get("startDate") ?? undefined;
  const endDate   = searchParams.get("endDate")   ?? undefined;

  // Basic date format validation
  if (startDate && !/^\d{4}-\d{2}-\d{2}/.test(startDate)) {
    return NextResponse.json({ error: "Format de date invalide pour startDate." }, { status: 400 });
  }
  if (endDate && !/^\d{4}-\d{2}-\d{2}/.test(endDate)) {
    return NextResponse.json({ error: "Format de date invalide pour endDate." }, { status: 400 });
  }
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return NextResponse.json({ error: "startDate doit être antérieure à endDate." }, { status: 400 });
  }

  // ── Compute summary (server-side, authoritative) ────────────────────────────
  try {
    const summary = await getFinanceSummary(startDate, endDate);
    return NextResponse.json(summary, {
      status: 200,
      headers: {
        // Short cache — summary is always fresh but we avoid hammering the DB
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("[api/finance/summary] Error:", err);
    return NextResponse.json(
      { error: "Erreur interne lors du calcul du résumé financier." },
      { status: 500 }
    );
  }
}

/**
 * GET  /api/finance/expenses   — paginated list
 * POST /api/finance/expenses   — create
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { checkFinancePermission } from "@/lib/finance-guard";
import { getExpenses, createExpense, addAuditLog } from "@/lib/admin-data";

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const auth = await verifyAdminSession(token, "finance");
  if (!auth.valid) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const perm = checkFinancePermission(auth.session ?? null, "read");
  if (!perm.allowed) return NextResponse.json({ error: perm.reason }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const page     = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 20)));
  const search   = searchParams.get("search") ?? undefined;

  try {
    const result = await getExpenses({ page, pageSize, search });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/finance/expenses GET]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const auth = await verifyAdminSession(token, "finance");
  if (!auth.valid) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const perm = checkFinancePermission(auth.session ?? null, "write");
  if (!perm.allowed) return NextResponse.json({ error: perm.reason }, { status: 403 });

  try {
    const body = await req.json();

    if (!body.description?.trim())
      return NextResponse.json({ error: "description requis." }, { status: 400 });
    if (!body.amount || isNaN(Number(body.amount)) || Number(body.amount) <= 0)
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    if (!body.date)
      return NextResponse.json({ error: "date requis." }, { status: 400 });

    const expense = await createExpense({
      description:   body.description.trim(),
      amount:        Number(body.amount),
      currency:      "RWF",
      category:      body.category ?? "autres",
      vendor:        body.vendor?.trim() || undefined,
      reference:     body.reference?.trim() || undefined,
      paymentMethod: body.paymentMethod ?? "cash",
      status:        body.status ?? "completed",
      date:          body.date,
      receiptUrl:    body.receiptUrl || undefined,
      notes:         body.notes?.trim() || undefined,
      recordedBy:    auth.session?.userId,
    });

    await addAuditLog({
      userId:   auth.session?.userId ?? "unknown",
      userName: auth.session?.name   ?? "API",
      userRole: auth.session?.role   ?? "admin",
      action:   "create",
      resource: "expense",
      resourceId: expense.id,
      details:  `Dépense créée via API : ${expense.description} — ${expense.amount} RWF`,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (err) {
    console.error("[api/finance/expenses POST]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/**
 * GET    /api/finance/expenses/[id]  — single expense
 * PATCH  /api/finance/expenses/[id]  — update
 * DELETE /api/finance/expenses/[id]  — soft-cancel
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { checkFinancePermission } from "@/lib/finance-guard";
import { getExpense, updateExpense, deleteExpense, addAuditLog } from "@/lib/admin-data";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const auth = await verifyAdminSession(token, "finance");
  if (!auth.valid) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const perm = checkFinancePermission(auth.session ?? null, "read");
  if (!perm.allowed) return NextResponse.json({ error: perm.reason }, { status: 403 });

  const { id } = await ctx.params;
  const expense = await getExpense(id);
  if (!expense) return NextResponse.json({ error: "Dépense introuvable." }, { status: 404 });
  return NextResponse.json(expense);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const auth = await verifyAdminSession(token, "finance");
  if (!auth.valid) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const perm = checkFinancePermission(auth.session ?? null, "write");
  if (!perm.allowed) return NextResponse.json({ error: perm.reason }, { status: 403 });

  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const updated = await updateExpense(id, {
      ...(body.description !== undefined && { description: body.description.trim() }),
      ...(body.amount !== undefined && { amount: Number(body.amount) }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.vendor !== undefined && { vendor: body.vendor?.trim() || undefined }),
      ...(body.reference !== undefined && { reference: body.reference?.trim() || undefined }),
      ...(body.paymentMethod !== undefined && { paymentMethod: body.paymentMethod }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.date !== undefined && { date: body.date }),
      ...(body.receiptUrl !== undefined && { receiptUrl: body.receiptUrl || undefined }),
      ...(body.notes !== undefined && { notes: body.notes?.trim() || undefined }),
    });

    await addAuditLog({
      userId:   auth.session?.userId ?? "unknown",
      userName: auth.session?.name   ?? "API",
      userRole: auth.session?.role   ?? "admin",
      action:   "update",
      resource: "expense",
      resourceId: id,
      details:  `Dépense modifiée via API : ${updated.description} — ${updated.amount} RWF`,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[api/finance/expenses PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const auth = await verifyAdminSession(token, "finance");
  if (!auth.valid) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const perm = checkFinancePermission(auth.session ?? null, "delete");
  if (!perm.allowed) return NextResponse.json({ error: perm.reason }, { status: 403 });

  const { id } = await ctx.params;
  const existing = await getExpense(id);
  if (!existing) return NextResponse.json({ error: "Dépense introuvable." }, { status: 404 });

  await deleteExpense(id);

  await addAuditLog({
    userId:   auth.session?.userId ?? "unknown",
    userName: auth.session?.name   ?? "API",
    userRole: auth.session?.role   ?? "admin",
    action:   "delete",
    resource: "expense",
    resourceId: id,
    details:  `Dépense annulée via API : ${existing.description} — ${existing.amount} RWF`,
  });

  return new NextResponse(null, { status: 204 });
}

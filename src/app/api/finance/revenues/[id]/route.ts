/**
 * GET    /api/finance/revenues/[id]  — single revenue
 * PATCH  /api/finance/revenues/[id]  — update
 * DELETE /api/finance/revenues/[id]  — soft-cancel
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { checkFinancePermission } from "@/lib/finance-guard";
import { getRevenue, updateRevenue, deleteRevenue, addAuditLog } from "@/lib/admin-data";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
  const auth = await verifyAdminSession(token, "finance");
  if (!auth.valid) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const perm = checkFinancePermission(auth.session ?? null, "read");
  if (!perm.allowed) return NextResponse.json({ error: perm.reason }, { status: 403 });

  const { id } = await ctx.params;
  const revenue = await getRevenue(id);
  if (!revenue) return NextResponse.json({ error: "Revenu introuvable." }, { status: 404 });
  return NextResponse.json(revenue);
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
    const updated = await updateRevenue(id, {
      ...(body.description !== undefined && { description: body.description.trim() }),
      ...(body.amount !== undefined && { amount: Number(body.amount) }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.studentName !== undefined && { studentName: body.studentName?.trim() || undefined }),
      ...(body.reference !== undefined && { reference: body.reference?.trim() || undefined }),
      ...(body.paymentMethod !== undefined && { paymentMethod: body.paymentMethod }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.date !== undefined && { date: body.date }),
      ...(body.notes !== undefined && { notes: body.notes?.trim() || undefined }),
    });

    await addAuditLog({
      userId:   auth.session?.userId ?? "unknown",
      userName: auth.session?.name   ?? "API",
      userRole: auth.session?.role   ?? "admin",
      action:   "update",
      resource: "revenue",
      resourceId: id,
      details:  `Revenu modifié via API : ${updated.description} — ${updated.amount} RWF`,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[api/finance/revenues PATCH]", err);
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
  const existing = await getRevenue(id);
  if (!existing) return NextResponse.json({ error: "Revenu introuvable." }, { status: 404 });

  await deleteRevenue(id);

  await addAuditLog({
    userId:   auth.session?.userId ?? "unknown",
    userName: auth.session?.name   ?? "API",
    userRole: auth.session?.role   ?? "admin",
    action:   "delete",
    resource: "revenue",
    resourceId: id,
    details:  `Revenu annulé via API : ${existing.description} — ${existing.amount} RWF`,
  });

  return new NextResponse(null, { status: 204 });
}

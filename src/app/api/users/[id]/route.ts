import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";
import type { UserRole } from "@/lib/admin-types";

const VALID_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "teacher",
  "accountant",
  "content_manager",
  "parent",
];

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("users");
  if (isNextResponse(auth)) return auth;

  if (!id || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const allowed: Record<string, unknown> = {};
  if (typeof body.name === "string") allowed.name = body.name.trim().slice(0, 200);
  if (typeof body.active === "boolean") allowed.active = body.active;

  if (body.role) {
    const role = body.role as UserRole;
    if (!VALID_ROLES.includes(role) || role === "parent") {
      return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
    }
    if (role === "super_admin" && auth.user.role !== "super_admin") {
      return NextResponse.json({ error: "Seul un super admin peut attribuer ce rôle." }, { status: 403 });
    }
    if (id === auth.user.id && role !== auth.user.role) {
      return NextResponse.json({ error: "Vous ne pouvez pas changer votre propre rôle." }, { status: 403 });
    }
    allowed.role = role;
  }

  if (typeof body.active === "boolean" && id === auth.user.id && body.active === false) {
    return NextResponse.json({ error: "Vous ne pouvez pas désactiver votre propre compte." }, { status: 403 });
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "Aucun champ modifiable fourni." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update(allowed)
    .eq("id", id)
    .select("id, name, email, role, avatar, active, created_at, last_login")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }

  await writeAuditLog({
    user: auth.user,
    action: allowed.role ? "role_change" : "update",
    resource: "users",
    resourceId: id,
    ip: clientIp(request),
  });

  return NextResponse.json({ data });
}

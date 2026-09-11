import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { writeAuditLog } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import type { UserRole } from "@/lib/admin-types";

const VALID_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "teacher",
  "accountant",
  "content_manager",
  "parent",
];

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
  const auth = await requireAuth("users");
  if (isNextResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const rawLimit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("id, name, email, role, avatar, active, created_at, last_login", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    const safe = search.replace(/[%*,]/g, "").slice(0, 80);
    if (safe) query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });

  return NextResponse.json({
    data,
    total: count ?? 0,
    page,
    limit,
    hasMore: from + (data?.length ?? 0) < (count ?? 0),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth("users");
  if (isNextResponse(auth)) return auth;

  const ip = clientIp(request);
  const limited = rateLimit(`users-create:${auth.user.id}`, 10, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Trop de créations. Réessayez plus tard." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = body.role as UserRole;
  const password = typeof body.password === "string" ? body.password : "";
  const active = body.active !== false;

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "Le nom est requis (max 200)." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Format d'email invalide." }, { status: 400 });
  }
  if (!VALID_ROLES.includes(role) || role === "parent") {
    return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
  }
  if (role === "super_admin" && auth.user.role !== "super_admin") {
    return NextResponse.json({ error: "Seul un super admin peut créer un super admin." }, { status: 403 });
  }
  if (password.length < 12) {
    return NextResponse.json({ error: "Mot de passe trop court (min. 12 caractères)." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (createError || !created.user) {
    const msg = createError?.message?.includes("already")
      ? "Cet email est déjà utilisé."
      : "Erreur lors de la création du compte.";
    return NextResponse.json({ error: msg }, { status: createError?.message?.includes("already") ? 409 : 500 });
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .update({ name, role, active })
    .eq("id", created.user.id)
    .select("id, name, email, role, avatar, active, created_at, last_login")
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Compte créé mais profil incomplet. Vérifiez dans Supabase." }, { status: 500 });
  }

  await writeAuditLog({
    user: auth.user,
    action: "create",
    resource: "users",
    resourceId: profile.id,
    details: `${email} (${role})`,
    ip,
  });

  return NextResponse.json({ data: profile }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
  const auth = await requireAuth("activity");
  if (isNextResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");
  const action = searchParams.get("action");
  const search = searchParams.get("search");
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const rawLimit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (resource) query = query.eq("resource", resource.slice(0, 80));
  if (action) query = query.eq("action", action.slice(0, 80));
  if (search) {
    const safe = search.replace(/[%*,]/g, "").slice(0, 80);
    if (safe) query = query.or(`user_name.ilike.%${safe}%,details.ilike.%${safe}%`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });

  return NextResponse.json({
    data: data ?? [],
    total: count ?? 0,
    page,
    limit,
    hasMore: from + (data?.length ?? 0) < (count ?? 0),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isNextResponse(auth)) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const action = typeof body.action === "string" ? body.action.slice(0, 80) : "";
  const resource = typeof body.resource === "string" ? body.resource.slice(0, 80) : "";
  if (!action || !resource) {
    return NextResponse.json({ error: "Action et ressource requises." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("audit_logs").insert({
    user_id: auth.user.id,
    user_name: auth.user.name,
    user_role: auth.user.role,
    action,
    resource,
    resource_id: typeof body.resourceId === "string" ? body.resourceId : null,
    details: typeof body.details === "string" ? body.details.slice(0, 1000) : null,
  });

  if (error) return NextResponse.json({ error: "Erreur d'enregistrement." }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}

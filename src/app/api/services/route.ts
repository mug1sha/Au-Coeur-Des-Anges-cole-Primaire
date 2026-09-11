import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

const VALID_STATUSES = ["active", "inactive", "archived"] as const;

const MAX_LIMIT     = 200;
const DEFAULT_LIMIT = 50;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get("public") === "true";
  const search     = searchParams.get("search");
  const status     = searchParams.get("status");

  if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  // ── Pagination ─────────────────────────────────────────────────────────
  const rawPage  = parseInt(searchParams.get("page")  ?? "1", 10);
  const rawLimit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const page  = Number.isFinite(rawPage)  && rawPage  > 0 ? rawPage  : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(rawLimit, MAX_LIMIT)
    : DEFAULT_LIMIT;
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase
    .from("services")
    .select("*", { count: "exact" })
    .order("order", { ascending: true })
    .range(from, to);

  if (publicOnly) {
    query = query.eq("status", "active");
  } else {
    const auth = await requireAuth("services");
    if (isNextResponse(auth)) return auth;
    if (status) query = query.eq("status", status);
  }

  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });

  const total   = count ?? 0;
  const hasMore = from + (data?.length ?? 0) < total;

  // Cache public service lists for 5 minutes (CDN + browser)
  const cacheHeaders = publicOnly
    ? { "Cache-Control": "public, max-age=300, stale-while-revalidate=60" }
    : { "Cache-Control": "private, no-store" };

  return NextResponse.json({ data, total, page, limit, hasMore }, { headers: cacheHeaders });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth("services");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("services").insert(body).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";

const VALID_CATEGORIES = ["general", "academic", "event", "important", "parents"] as const;
const VALID_STATUSES = ["draft", "scheduled", "published", "archived"] as const;

/** Maximum rows per page — hard cap to prevent oversized responses. */
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

// GET — list announcements (public gets published only, staff gets all)
// Supports offset pagination via ?page=&limit= query params.
// Response shape: { data, total, page, limit, hasMore }
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get("public") === "true";
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  // ── Pagination params ──────────────────────────────────────────────────
  const rawPage  = parseInt(searchParams.get("page")  ?? "1", 10);
  const rawLimit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const page  = Number.isFinite(rawPage)  && rawPage  > 0 ? rawPage  : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(rawLimit, MAX_LIMIT)
    : DEFAULT_LIMIT;
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  // ── Validate other query params ────────────────────────────────────────
  if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }
  if (category && !VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  // ── Build query ────────────────────────────────────────────────────────
  // count: "exact" asks Supabase to return the total row count alongside
  // the page slice — single round-trip, no separate COUNT query.
  let query = supabase
    .from("announcements")
    .select("*", { count: "exact" })
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .range(from, to);

  if (publicOnly) {
    query = query
      .eq("status", "published")
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString());
  } else {
    // Staff — verify auth
    const auth = await requireAuth("announcements");
    if (isNextResponse(auth)) return auth;
    if (status) query = query.eq("status", status);
  }

  if (category) query = query.eq("category", category);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });

  const total   = count ?? 0;
  const hasMore = from + (data?.length ?? 0) < total;

  // Cache public paginated responses briefly — varies by page/category
  const cacheHeaders = publicOnly
    ? { "Cache-Control": "public, max-age=60, stale-while-revalidate=30" }
    : { "Cache-Control": "private, no-store" };

  return NextResponse.json(
    { data, total, page, limit, hasMore },
    { headers: cacheHeaders }
  );
}

// POST — create announcement
export async function POST(request: NextRequest) {
  const auth = await requireAuth("announcements");
  if (isNextResponse(auth)) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  // ── Server-side validation ──────────────────────────────────────────────
  const { title, content, category, status } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
  }
  if (title.length > 300) {
    return NextResponse.json({ error: "Titre trop long (max 300 caractères)." }, { status: 400 });
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Le contenu est requis." }, { status: 400 });
  }
  if (content.length > 50_000) {
    return NextResponse.json({ error: "Contenu trop long (max 50 000 caractères)." }, { status: 400 });
  }

  if (!category || !VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const supabase = await createClient();

  const payload = {
    title: title.trim(),
    content: sanitizeHtml(content.trim()),
    excerpt: typeof body.excerpt === "string" ? body.excerpt.trim().slice(0, 500) : null,
    category,
    status: status ?? "draft",
    published_at: typeof body.published_at === "string" ? body.published_at : null,
    expires_at: typeof body.expires_at === "string" ? body.expires_at : null,
    pinned: body.pinned === true,
    cover_image: typeof body.cover_image === "string" ? body.cover_image.trim() : null,
    author: auth.user.name,
    created_by: auth.user.id,
  };

  const { data, error } = await supabase
    .from("announcements")
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  await writeAuditLog({
    user: auth.user,
    action: "create",
    resource: "announcements",
    resourceId: data.id,
    ip: clientIp(request),
  });
  return NextResponse.json({ data }, { status: 201 });
}

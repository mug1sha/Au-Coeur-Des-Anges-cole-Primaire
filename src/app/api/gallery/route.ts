import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";

const VALID_CATEGORIES = ["espaces", "activites", "repos", "evenements"] as const;
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 12;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get("public") === "true";
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  if (category && category !== "all" && !VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const rawLimit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (!publicOnly) {
    const auth = await requireAuth("gallery");
    if (isNextResponse(auth)) return auth;
  }

  const supabase = await createClient();
  let query = supabase
    .from("gallery_images")
    .select("*", { count: "exact" })
    .order("uploaded_at", { ascending: false })
    .range(from, to);

  if (publicOnly) query = query.eq("public_visible", true);
  if (category && category !== "all") query = query.eq("category", category);
  if (search) {
    const safe = search.replace(/[%*,]/g, "").slice(0, 80);
    if (safe) query = query.ilike("alt", `%${safe}%`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });

  const headers = publicOnly
    ? { "Cache-Control": "public, max-age=120, stale-while-revalidate=60" }
    : { "Cache-Control": "private, no-store" };

  return NextResponse.json(
    { data: data ?? [], total: count ?? 0, page, limit, hasMore: from + (data?.length ?? 0) < (count ?? 0) },
    { headers }
  );
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth("gallery");
  if (isNextResponse(auth)) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const src = typeof body.src === "string" ? body.src.trim() : "";
  const alt = typeof body.alt === "string" ? body.alt.trim() : "";
  const category = body.category as string;

  if (!src || (!src.startsWith("https://") && !src.startsWith("/"))) {
    return NextResponse.json({ error: "URL d'image invalide." }, { status: 400 });
  }
  if (!alt) {
    return NextResponse.json({ error: "Le texte alternatif est requis." }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .insert({
      src,
      alt: alt.slice(0, 200),
      category,
      size: typeof body.size === "number" ? body.size : null,
      public_visible: body.public_visible !== false,
      created_by: auth.user.id,
    })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Erreur lors de l'enregistrement." }, { status: 500 });
  }

  await writeAuditLog({
    user: auth.user,
    action: "upload",
    resource: "gallery",
    resourceId: data.id,
    ip: clientIp(request),
  });

  return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth("gallery");
  if (isNextResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis." }, { status: 400 });

  const supabase = await createClient();
  const { data: row } = await supabase.from("gallery_images").select("id, src").eq("id", id).single();
  if (!row) return NextResponse.json({ error: "Image introuvable." }, { status: 404 });

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });

  try {
    const publicPrefix = "/storage/v1/object/public/gallery/";
    const idx = row.src.indexOf(publicPrefix);
    if (idx !== -1) {
      const path = row.src.slice(idx + publicPrefix.length);
      const admin = createAdminClient();
      await admin.storage.from("gallery").remove([path]);
    }
  } catch {
    // Storage cleanup is best-effort
  }

  await writeAuditLog({
    user: auth.user,
    action: "delete",
    resource: "gallery",
    resourceId: id,
    ip: clientIp(request),
  });

  return NextResponse.json({ success: true });
}

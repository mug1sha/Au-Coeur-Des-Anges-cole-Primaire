import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";

type Params = { params: Promise<{ id: string }> };

const VALID_CATEGORIES = ["general", "academic", "event", "important", "parents"] as const;
const VALID_STATUSES = ["draft", "scheduled", "published", "archived"] as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("announcements");
  if (isNextResponse(auth)) return auth;

  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("announcements");
  if (isNextResponse(auth)) return auth;

  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  // Whitelist updatable fields
  const allowed: Record<string, unknown> = {};
  if (typeof body.title === "string") allowed.title = body.title.trim().slice(0, 300);
  if (typeof body.content === "string") allowed.content = sanitizeHtml(body.content.trim().slice(0, 50_000));
  if (typeof body.excerpt === "string") allowed.excerpt = body.excerpt.trim().slice(0, 500);
  if (body.category && VALID_CATEGORIES.includes(body.category as typeof VALID_CATEGORIES[number])) {
    allowed.category = body.category;
  } else if (body.category) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }
  if (body.status && VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    allowed.status = body.status;
  } else if (body.status) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }
  if (typeof body.published_at === "string") allowed.published_at = body.published_at;
  if (typeof body.expires_at === "string") allowed.expires_at = body.expires_at;
  if (typeof body.pinned === "boolean") allowed.pinned = body.pinned;
  if (typeof body.cover_image === "string") allowed.cover_image = body.cover_image.trim();

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "Aucun champ modifiable fourni." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .update(allowed)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  await writeAuditLog({
    user: auth.user,
    action: "update",
    resource: "announcements",
    resourceId: id,
    ip: clientIp(request),
  });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("announcements");
  if (isNextResponse(auth)) return auth;

  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  const supabase = await createClient();

  // Soft delete: archive instead of hard delete
  const { error } = await supabase
    .from("announcements")
    .update({ status: "archived", pinned: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  await writeAuditLog({
    user: auth.user,
    action: "archive",
    resource: "announcements",
    resourceId: id,
  });
  return NextResponse.json({ success: true, message: "Annonce archivée." });
}

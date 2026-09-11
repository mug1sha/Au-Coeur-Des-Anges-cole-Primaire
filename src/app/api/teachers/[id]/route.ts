import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = ["active", "inactive", "archived"] as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("teachers");
  if (isNextResponse(auth)) return auth;

  // Basic ID sanity check
  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers").select("*").eq("id", id).single();

  if (error || !data) return NextResponse.json({ error: "Enseignant introuvable." }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("teachers");
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

  // Whitelist updatable fields — strip id, created_at etc.
  const allowed: Record<string, unknown> = {};
  if (typeof body.name === "string") allowed.name = body.name.trim().slice(0, 200);
  if (typeof body.position === "string") allowed.position = body.position.trim().slice(0, 200);
  if (typeof body.subject === "string") allowed.subject = body.subject.trim().slice(0, 200);
  if (typeof body.bio === "string") allowed.bio = body.bio.trim().slice(0, 1000);
  if (Array.isArray(body.qualifications)) allowed.qualifications = (body.qualifications as string[]).slice(0, 10).map((q) => String(q).slice(0, 200));
  if (typeof body.experience === "number") allowed.experience = Math.max(0, Math.min(60, body.experience));
  if (typeof body.phone === "string") allowed.phone = body.phone.trim().slice(0, 50);
  if (typeof body.avatar === "string") allowed.avatar = body.avatar.trim();
  if (typeof body.public_visible === "boolean") allowed.public_visible = body.public_visible;
  if (body.status && VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    allowed.status = body.status;
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "Aucun champ modifiable fourni." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers").update(allowed).eq("id", id).select().single();

  if (error || !data) return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("teachers");
  if (isNextResponse(auth)) return auth;

  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  const supabase = await createClient();

  // Soft delete: archive instead of hard delete — preserves audit trail
  const { error } = await supabase
    .from("teachers")
    .update({ status: "archived", public_visible: false })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  return NextResponse.json({ success: true, message: "Enseignant archivé." });
}

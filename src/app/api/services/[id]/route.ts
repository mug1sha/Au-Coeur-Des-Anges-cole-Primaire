import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

type Params = { params: Promise<{ id: string }> };

const VALID_STATUSES = ["active", "inactive", "archived"] as const;

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("services");
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
  if (typeof body.title === "string") allowed.title = body.title.trim().slice(0, 200);
  if (typeof body.slug === "string") allowed.slug = body.slug.trim().toLowerCase().slice(0, 100);
  if (typeof body.description === "string") allowed.description = body.description.trim().slice(0, 1000);
  if (typeof body.long_description === "string") allowed.long_description = body.long_description.trim().slice(0, 5000);
  if (typeof body.icon === "string") allowed.icon = body.icon.trim().slice(0, 10);
  if (typeof body.age_range === "string") allowed.age_range = body.age_range.trim().slice(0, 100);
  if (typeof body.price === "string") allowed.price = body.price.trim().slice(0, 200);
  if (typeof body.schedule === "string") allowed.schedule = body.schedule.trim().slice(0, 200);
  if (typeof body.order === "number") allowed.order = Math.max(0, Math.min(999, Math.floor(body.order)));
  if (body.status && VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    allowed.status = body.status;
  } else if (body.status) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "Aucun champ modifiable fourni." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services").update(allowed).eq("id", id).select().single();

  if (error || !data) return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("services");
  if (isNextResponse(auth)) return auth;

  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  const supabase = await createClient();

  // Soft delete: archive instead of hard delete
  const { error } = await supabase
    .from("services")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  return NextResponse.json({ success: true, message: "Service archivé." });
}

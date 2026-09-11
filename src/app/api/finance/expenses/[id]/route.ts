import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { checkFinanceRole } from "@/lib/finance-guard";

type Params = { params: Promise<{ id: string }> };

const VALID_CATEGORIES = [
  "salaires", "fournitures", "cantine", "infrastructure", "electricite",
  "eau", "internet", "transport", "entretien", "marketing", "autres",
] as const;
const VALID_METHODS = ["cash", "bank_transfer", "mobile_money", "check"] as const;
const VALID_STATUSES = ["pending", "completed", "cancelled"] as const;

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("finance");
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
  if (typeof body.description === "string") allowed.description = body.description.trim().slice(0, 500);
  if (body.amount !== undefined) {
    const amt = Number(body.amount);
    if (isNaN(amt) || amt <= 0 || amt > 999_999_999) {
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    }
    allowed.amount = amt;
  }
  if (body.category && VALID_CATEGORIES.includes(body.category as typeof VALID_CATEGORIES[number])) {
    allowed.category = body.category;
  } else if (body.category) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }
  if (body.payment_method && VALID_METHODS.includes(body.payment_method as typeof VALID_METHODS[number])) {
    allowed.payment_method = body.payment_method;
  } else if (body.payment_method) {
    return NextResponse.json({ error: "Mode de paiement invalide." }, { status: 400 });
  }
  if (body.status && VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
    allowed.status = body.status;
  } else if (body.status) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }
  if (typeof body.vendor === "string") allowed.vendor = body.vendor.trim().slice(0, 200);
  if (typeof body.reference === "string") allowed.reference = body.reference.trim().slice(0, 100);
  if (typeof body.notes === "string") allowed.notes = body.notes.trim().slice(0, 1000);
  if (typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    allowed.date = body.date;
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "Aucun champ modifiable fourni." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expenses").update(allowed).eq("id", id).select().single();

  if (error || !data) return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("finance");
  if (isNextResponse(auth)) return auth;
  const del = checkFinanceRole(auth.user.role, "delete");
  if (!del.allowed) {
    return NextResponse.json({ error: del.reason }, { status: 403 });
  }

  if (!id || typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

  const supabase = await createClient();

  // Soft delete: cancel instead of hard delete — preserves audit trail
  const { error } = await supabase
    .from("expenses")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  return NextResponse.json({ success: true, message: "Dépense annulée." });
}

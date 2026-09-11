import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

const VALID_CATEGORIES = ["frais_scolaires", "inscription", "cantine", "transport", "activites", "autres"] as const;
const VALID_METHODS = ["cash", "bank_transfer", "mobile_money", "check"] as const;
const VALID_STATUSES = ["pending", "completed", "cancelled"] as const;

const MAX_LIMIT     = 500;
const DEFAULT_LIMIT = 20;

export async function GET(request: NextRequest) {
  const auth = await requireAuth("finance");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const month    = searchParams.get("month");
  const year     = searchParams.get("year");
  const status   = searchParams.get("status");
  const category = searchParams.get("category");
  const search   = searchParams.get("search");

  // ── Pagination ─────────────────────────────────────────────────────────
  const rawPage  = parseInt(searchParams.get("page")  ?? "1", 10);
  const rawLimit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const page  = Number.isFinite(rawPage)  && rawPage  > 0 ? rawPage  : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(rawLimit, MAX_LIMIT)
    : DEFAULT_LIMIT;
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  // ── Validation ─────────────────────────────────────────────────────────
  if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }
  if (category && !VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  // ── Query — count:exact gives total in one round-trip ─────────────────
  let query = supabase
    .from("revenues")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(from, to);

  if (status)   query = query.eq("status", status);
  if (category) query = query.eq("category", category);
  if (year && month) {
    const dateFrom = `${year}-${month.padStart(2, "0")}-01`;
    const dateTo   = new Date(parseInt(year), parseInt(month), 0).toISOString().split("T")[0];
    query = query.gte("date", dateFrom).lte("date", dateTo);
  } else if (year) {
    query = query.gte("date", `${year}-01-01`).lte("date", `${year}-12-31`);
  }
  // Simple description search (case-insensitive prefix/substring via ilike)
  if (search) query = query.ilike("description", `%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });

  const total   = count ?? 0;
  const hasMore = from + (data?.length ?? 0) < total;

  return NextResponse.json({ data, total, page, limit, hasMore });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth("finance");
  if (isNextResponse(auth)) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  // ── Server-side validation ──────────────────────────────────────────────
  const { description, amount, category, payment_method, status, date } = body;

  if (!description || typeof description !== "string" || description.trim().length === 0) {
    return NextResponse.json({ error: "La description est requise." }, { status: 400 });
  }
  if (description.length > 500) {
    return NextResponse.json({ error: "La description est trop longue (max 500 caractères)." }, { status: 400 });
  }

  const parsedAmount = Number(amount);
  if (!amount || isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 999_999_999) {
    return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
  }

  if (!category || !VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  if (!payment_method || !VALID_METHODS.includes(payment_method as typeof VALID_METHODS[number])) {
    return NextResponse.json({ error: "Mode de paiement invalide." }, { status: 400 });
  }

  if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  if (date && typeof date === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Format de date invalide (YYYY-MM-DD attendu)." }, { status: 400 });
  }

  const supabase = await createClient();

  // Whitelist fields — never trust client-supplied recorded_by or id
  const payload = {
    description: description.trim(),
    amount: parsedAmount,
    currency: typeof body.currency === "string" ? body.currency : "RWF",
    category,
    payment_method,
    status: status ?? "completed",
    date: date ?? new Date().toISOString().split("T")[0],
    student_name: typeof body.student_name === "string" ? body.student_name.trim().slice(0, 200) : null,
    reference: typeof body.reference === "string" ? body.reference.trim().slice(0, 100) : null,
    notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) : null,
    recorded_by: auth.user.id,
  };

  const { data, error } = await supabase
    .from("revenues")
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

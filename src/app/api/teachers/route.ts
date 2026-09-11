import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

const VALID_STATUSES = ["active", "inactive", "archived"] as const;

const MAX_LIMIT     = 500;
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

  if (publicOnly) {
    // Public endpoint: return safe fields only — no email, no phone
    let query = supabase
      .from("teachers")
      .select(
        "id, name, position, subject, bio, qualifications, experience, avatar, joined_at, public_visible, status",
        { count: "exact" }
      )
      .eq("status", "active")
      .eq("public_visible", true)
      .order("joined_at", { ascending: false })
      .range(from, to);

    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error, count } = await query;
    if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });

    const total   = count ?? 0;
    const hasMore = from + (data?.length ?? 0) < total;
    return NextResponse.json({ data, total, page, limit, hasMore });
  }

  // Admin endpoint — verify auth
  const auth = await requireAuth("teachers");
  if (isNextResponse(auth)) return auth;

  let query = supabase
    .from("teachers")
    .select("*", { count: "exact" })
    .order("joined_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,position.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });

  const total   = count ?? 0;
  const hasMore = from + (data?.length ?? 0) < total;
  return NextResponse.json({ data, total, page, limit, hasMore });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth("teachers");
  if (isNextResponse(auth)) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  // ── Server-side validation ──────────────────────────────────────────────
  const { name, email, position, subject, status } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  }
  if (name.length > 200) {
    return NextResponse.json({ error: "Nom trop long (max 200 caractères)." }, { status: 400 });
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "L'email est requis." }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: "Format d'email invalide." }, { status: 400 });
  }

  if (!position || typeof position !== "string" || position.trim().length === 0) {
    return NextResponse.json({ error: "Le poste est requis." }, { status: 400 });
  }
  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    return NextResponse.json({ error: "La matière est requise." }, { status: 400 });
  }

  if (status && !VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const experience = body.experience !== undefined ? Number(body.experience) : null;
  if (experience !== null && (isNaN(experience) || experience < 0 || experience > 60)) {
    return NextResponse.json({ error: "Expérience invalide (0–60 ans)." }, { status: 400 });
  }

  const supabase = await createClient();

  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    position: position.trim(),
    subject: (subject as string).trim(),
    bio: typeof body.bio === "string" ? body.bio.trim().slice(0, 1000) : null,
    qualifications: Array.isArray(body.qualifications)
      ? (body.qualifications as string[]).slice(0, 10).map((q) => String(q).slice(0, 200))
      : null,
    experience,
    phone: typeof body.phone === "string" ? body.phone.trim().slice(0, 50) : null,
    avatar: typeof body.avatar === "string" ? body.avatar.trim() : null,
    public_visible: body.public_visible === true,
    status: status ?? "active",
  };

  const { data, error } = await supabase
    .from("teachers")
    .insert(payload)
    .select()
    .single();

  if (error) {
    // Unique constraint on email
    if (error.code === "23505") {
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}

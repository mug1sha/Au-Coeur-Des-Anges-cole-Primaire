import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { hasPermission } from "@/lib/admin-types";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";
import type { SchoolSettings } from "@/lib/admin-types";

function mapRow(row: Record<string, unknown>): SchoolSettings {
  return {
    schoolName: (row.school_name as string) ?? "",
    subtitle: (row.subtitle as string) ?? "",
    tagline: (row.tagline as string) ?? "",
    email: (row.email as string) ?? "",
    phone: (row.phone as string) ?? "",
    address: (row.address as string) ?? "",
    city: (row.city as string) ?? "",
    country: (row.country as string) ?? "",
    currency: (row.currency as string) ?? "RWF",
    academicYearStart: (row.academic_year_start as string) ?? "",
    academicYearEnd: (row.academic_year_end as string) ?? "",
    openingTime: (row.opening_time as string) ?? "",
    closingTime: (row.closing_time as string) ?? "",
    openDays: (row.open_days as string[]) ?? [],
    whatsappNumber: (row.whatsapp_number as string) ?? undefined,
    instagramUrl: (row.instagram_url as string) ?? undefined,
    facebookUrl: (row.facebook_url as string) ?? undefined,
  };
}

function toRow(s: SchoolSettings) {
  return {
    school_name: s.schoolName.slice(0, 200),
    subtitle: s.subtitle.slice(0, 200),
    tagline: s.tagline?.slice(0, 500) ?? null,
    email: s.email.slice(0, 200),
    phone: s.phone.slice(0, 50),
    address: s.address.slice(0, 300),
    city: s.city.slice(0, 100),
    country: s.country.slice(0, 100),
    currency: s.currency.slice(0, 10),
    academic_year_start: s.academicYearStart.slice(0, 20),
    academic_year_end: s.academicYearEnd.slice(0, 20),
    opening_time: s.openingTime.slice(0, 10),
    closing_time: s.closingTime.slice(0, 10),
    open_days: Array.isArray(s.openDays) ? s.openDays.slice(0, 7) : [],
    whatsapp_number: s.whatsappNumber?.slice(0, 50) ?? null,
    instagram_url: s.instagramUrl?.slice(0, 300) ?? null,
    facebook_url: s.facebookUrl?.slice(0, 300) ?? null,
  };
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("school_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Erreur lors de la récupération." }, { status: 500 });
  if (!data) return NextResponse.json({ data: null });
  return NextResponse.json({ data: mapRow(data as Record<string, unknown>) });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth();
  if (isNextResponse(auth)) return auth;

  const canWrite =
    hasPermission(auth.user.role, "settings") || hasPermission(auth.user.role, "website");
  if (!canWrite) {
    return NextResponse.json({ error: "Permission refusée." }, { status: 403 });
  }

  let body: SchoolSettings;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  if (!body?.schoolName || typeof body.schoolName !== "string") {
    return NextResponse.json({ error: "Le nom de l'école est requis." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("school_settings")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = toRow(body);
  let result;
  if (existing?.id) {
    result = await supabase.from("school_settings").update(payload).eq("id", existing.id).select().single();
  } else {
    result = await supabase.from("school_settings").insert(payload).select().single();
  }

  if (result.error || !result.data) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde." }, { status: 500 });
  }

  await writeAuditLog({
    user: auth.user,
    action: "settings_change",
    resource: "settings",
    resourceId: result.data.id,
    ip: clientIp(request),
  });

  return NextResponse.json({ data: mapRow(result.data as Record<string, unknown>) });
}

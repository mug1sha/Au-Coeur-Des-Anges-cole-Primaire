import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const SUBJECTS = new Set([
  "Demande d'information",
  "Inscription",
  "Visite de l'école",
  "Activités extrascolaires",
  "Autre",
]);

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limited = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Trop de messages. Veuillez réessayer dans quelques minutes." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 200) {
    return NextResponse.json({ error: "Veuillez entrer votre nom." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (phone && !/^[\d\s+\-()]{8,}$/.test(phone)) {
    return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
  }
  if (!SUBJECTS.has(subject)) {
    return NextResponse.json({ error: "Veuillez sélectionner un sujet." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 5000) {
    return NextResponse.json({ error: "Le message doit contenir entre 10 et 5000 caractères." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("contact_inquiries").insert({
    name,
    email: email.toLowerCase(),
    phone: phone || null,
    subject,
    message,
    ip_address: ip,
  });

  if (error) {
    return NextResponse.json({ error: "Impossible d'envoyer le message. Réessayez." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

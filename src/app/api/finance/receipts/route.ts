import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

export async function GET(request: NextRequest) {
  const auth = await requireAuth("finance");
  if (isNextResponse(auth)) return auth;

  const path = request.nextUrl.searchParams.get("path") ?? "";
  if (!path || path.includes("..") || path.startsWith("/")) {
    return NextResponse.json({ error: "Chemin invalide." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("receipts").createSignedUrl(path, 60);
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Justificatif introuvable." }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}

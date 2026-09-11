import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { writeAuditLog } from "@/lib/audit";
import { clientIp } from "@/lib/rate-limit";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const auth = await requireAuth("gallery");
  if (isNextResponse(auth)) return auth;

  if (!id || id.length > 100) {
    return NextResponse.json({ error: "ID invalide." }, { status: 400 });
  }

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
      await createAdminClient().storage.from("gallery").remove([path]);
    }
  } catch {
    // best-effort
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

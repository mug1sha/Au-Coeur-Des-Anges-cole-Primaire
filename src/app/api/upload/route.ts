import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";
import { hasPermission } from "@/lib/admin-types";
import { writeAuditLog } from "@/lib/audit";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "pdf"]);
const MAX_SIZE = 5 * 1024 * 1024;

const BUCKET_MAP: Record<string, string> = {
  avatar: "avatars",
  gallery: "gallery",
  receipt: "receipts",
  cover: "gallery",
};

const TYPE_RESOURCE: Record<string, string> = {
  avatar: "teachers",
  gallery: "gallery",
  cover: "announcements",
  receipt: "finance",
};

function validateMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
  if (buffer.length < 4) return false;
  const b = buffer;
  switch (mimeType) {
    case "image/jpeg":
      return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case "image/png":
      return b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
    case "image/webp":
      return b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46;
    case "image/gif":
      return b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46;
    case "application/pdf":
      return b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46;
    default:
      return false;
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth();
  if (isNextResponse(auth)) return auth;

  const limited = rateLimit(`upload:${auth.user.id}`, 30, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Trop d'uploads. Réessayez plus tard." }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const uploadType = (formData.get("type") as string) ?? "gallery";

    const resource = TYPE_RESOURCE[uploadType];
    if (!resource || !hasPermission(auth.user.role, resource)) {
      return NextResponse.json({ error: "Vous n'avez pas la permission d'envoyer ce fichier." }, { status: 403 });
    }

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    if (uploadType === "receipt" && file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Justificatif : image ou PDF uniquement." }, { status: 400 });
    }
    if (uploadType !== "receipt" && file.type === "application/pdf") {
      return NextResponse.json({ error: "Les PDF ne sont autorisés que pour les justificatifs." }, { status: 400 });
    }

    if (!Object.hasOwn(ALLOWED_TYPES, file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. JPEG, PNG, WEBP, GIF ou PDF uniquement." },
        { status: 400 }
      );
    }

    const rawExt = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return NextResponse.json({ error: "Extension de fichier non autorisée." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux. Maximum 5 Mo." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "Le contenu du fichier ne correspond pas au type déclaré." },
        { status: 400 }
      );
    }

    const bucket = BUCKET_MAP[uploadType] ?? "gallery";
    const ext = ALLOWED_TYPES[file.type];
    const fileName = `${auth.user.id}-${Date.now()}.${ext}`;
    const filePath = uploadType === "avatar" ? `teachers/${fileName}` : fileName;

    const adminClient = createAdminClient();
    const { error: uploadError } = await adminClient.storage.from(bucket).upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
    }

    let url: string;
    let persistUrl: string;

    if (bucket === "receipts") {
      const { data: signed } = await adminClient.storage.from(bucket).createSignedUrl(filePath, 60 * 60);
      url = signed?.signedUrl ?? "";
      persistUrl = `receipts/${filePath}`;
    } else {
      const { data: urlData } = adminClient.storage.from(bucket).getPublicUrl(filePath);
      url = urlData.publicUrl;
      persistUrl = urlData.publicUrl;
    }

    await writeAuditLog({
      user: auth.user,
      action: "upload",
      resource: resource,
      details: `${bucket}/${filePath}`,
      ip: clientIp(request),
    });

    return NextResponse.json({
      url,
      persistUrl,
      path: filePath,
      bucket,
    });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
  }
}

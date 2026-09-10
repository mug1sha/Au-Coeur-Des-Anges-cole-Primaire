/**
 * POST /api/upload
 *
 * Handles file uploads for admin image management.
 * Accepts a multipart/form-data request with:
 *   - file    : the image file
 *   - category: storage sub-folder (e.g. "teachers", "gallery")
 *
 * Files are written to public/uploads/<category>/<timestamp>-<safeName>
 * and the public path is returned as { url: "/uploads/..." }
 *
 * Auth:
 *  - Requires a valid Authorization: Bearer <token> header.
 *  - Token is verified via verifyAdminSession().
 *  - Returns 401 if missing or invalid.
 *
 * Limitations:
 *  - Max file size: 2 MB
 *  - Allowed types: image/jpeg, image/png, image/webp
 *
 * TODO: Replace local disk storage with S3 / Cloudinary / Supabase Storage
 *       when moving to a hosted environment.
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { verifyAdminSession } from "@/lib/admin-auth";

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_CATEGORIES = ["teachers", "gallery", "services", "general"];

export async function POST(req: NextRequest) {
  // ── Auth check ───────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  const { valid } = await verifyAdminSession(token);
  if (!valid) {
    return NextResponse.json(
      { error: "Non autorisé. Veuillez vous connecter." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const category = (formData.get("category") as string | null) ?? "general";

    // ── Validate inputs ─────────────────────────────────────────
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
    }

    const mime = file.type;
    if (!ALLOWED_TYPES.includes(mime)) {
      return NextResponse.json(
        { error: "Type de fichier non autorisé. Utilisez JPG, PNG ou WebP." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.byteLength > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Le fichier dépasse la limite de 2 Mo." },
        { status: 400 }
      );
    }

    // ── Sanitize filename ────────────────────────────────────────
    const original = file.name;
    const ext = path.extname(original).toLowerCase().replace(/[^.a-z0-9]/g, "");
    const base = path
      .basename(original, path.extname(original))
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);

    const filename = `${Date.now()}-${base}${ext}`;

    // ── Write to public/uploads/<category>/ ──────────────────────
    // process.cwd() is the project root in Next.js
    const uploadDir = path.join(process.cwd(), "public", "uploads", category);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${category}/${filename}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (err) {
    console.error("[api/upload] Error:", err);
    return NextResponse.json(
      { error: "Erreur interne lors de l'enregistrement du fichier." },
      { status: 500 }
    );
  }
}

// App Router uses the Web Streams API — no body parser config needed.

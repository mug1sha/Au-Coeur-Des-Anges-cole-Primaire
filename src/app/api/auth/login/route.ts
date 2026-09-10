/**
 * This route is kept for future server-side use (e.g. mobile apps, API clients).
 * The admin web app signs in directly via the browser Supabase client in admin-auth.ts.
 * That approach ensures the session cookie is set correctly by @supabase/ssr.
 */
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Use the browser Supabase client for web login." },
    { status: 400 }
  );
}

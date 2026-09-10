import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

// GET — list announcements (public gets published only, staff gets all)
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get("public") === "true";
  const status = searchParams.get("status");
  const category = searchParams.get("category");

  let query = supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });

  if (publicOnly) {
    query = query
      .eq("status", "published")
      .or("expires_at.is.null,expires_at.gt." + new Date().toISOString());
  } else {
    // Staff — verify auth
    const auth = await requireAuth("announcements");
    if (isNextResponse(auth)) return auth;
    if (status) query = query.eq("status", status);
  }

  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST — create announcement
export async function POST(request: NextRequest) {
  const auth = await requireAuth("announcements");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("announcements")
    .insert({ ...body, author: auth.user.name, created_by: auth.user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

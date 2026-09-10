import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get("public") === "true";

  let query = supabase.from("teachers").select("*").order("joined_at", { ascending: false });

  if (publicOnly) {
    query = query.eq("status", "active").eq("public_visible", true);
  } else {
    const auth = await requireAuth("teachers");
    if (isNextResponse(auth)) return auth;
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth("teachers");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("teachers")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

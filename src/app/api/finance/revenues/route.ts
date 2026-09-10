import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, isNextResponse } from "@/lib/supabase/auth-guard";

export async function GET(request: NextRequest) {
  const auth = await requireAuth("finance");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const status = searchParams.get("status");

  let query = supabase
    .from("revenues")
    .select("*")
    .order("date", { ascending: false });

  if (status) query = query.eq("status", status);
  if (year && month) {
    const from = `${year}-${month.padStart(2, "0")}-01`;
    const to = new Date(parseInt(year), parseInt(month), 0).toISOString().split("T")[0];
    query = query.gte("date", from).lte("date", to);
  } else if (year) {
    query = query.gte("date", `${year}-01-01`).lte("date", `${year}-12-31`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth("finance");
  if (isNextResponse(auth)) return auth;

  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("revenues")
    .insert({ ...body, recorded_by: auth.user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}

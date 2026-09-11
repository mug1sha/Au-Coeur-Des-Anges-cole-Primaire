import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Use getUser() — validates JWT server-side against Supabase Auth.
    // getSession() can return stale/manipulated token data from the cookie.
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, name, email, role, avatar, active")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.active) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: profile });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

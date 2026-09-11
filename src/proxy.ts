/**
 * Next.js Middleware (proxy.ts) — Admin Route Protection
 * Uses getUser() (not getSession()) for reliable server-side auth check.
 */

import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const PUBLIC_ADMIN_ROUTES = ["/admin/login", "/admin/reset-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next({ request });
  }

  const { supabase, supabaseResponse } = createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("active")
        .eq("id", user.id)
        .single();
      if (profile?.active) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return supabaseResponse;
  }

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("active")
    .eq("id", user.id)
    .single();

  if (!profile?.active) {
    await supabase.auth.signOut();
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("reason", "inactive");
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};

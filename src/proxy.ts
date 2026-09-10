/**
 * Next.js Middleware (proxy.ts) — Admin Route Protection
 * In Next.js 16+, this file is the middleware entry point (replaces middleware.ts).
 * Validates Supabase session server-side before serving any /admin/* route.
 */

import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next({ request });
  }

  // Allow the login page — but redirect to dashboard if already logged in
  if (PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    const { supabase, supabaseResponse } = createMiddlewareClient(request);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return supabaseResponse;
  }

  // All other /admin/* routes require a valid Supabase session
  const { supabase, supabaseResponse } = createMiddlewareClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};

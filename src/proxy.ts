/**
 * Next.js Middleware (proxy.ts) — Admin Route Protection
 * Uses getUser() (not getSession()) for reliable server-side auth check.
 */

import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next({ request });
  }

  const { supabase, supabaseResponse } = createMiddlewareClient(request);

  // IMPORTANT: Always call getUser() to refresh the session token if needed.
  // getSession() can return stale data — getUser() validates with Supabase server.
  const { data: { user } } = await supabase.auth.getUser();

  // Allow login page — redirect to dashboard if already logged in
  if (PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return supabaseResponse;
  }

  // All other /admin/* routes require valid session
  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};

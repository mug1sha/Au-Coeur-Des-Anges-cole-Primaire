/**
 * Next.js Proxy (Middleware) — Admin Route Interception
 *
 * NOTE: In Next.js 16+, this file replaces the deprecated "middleware.ts".
 * The file must be named "proxy.ts" and placed in the src/ directory.
 *
 * ARCHITECTURE NOTE:
 * This application uses localStorage/sessionStorage for auth sessions, which
 * are not accessible server-side (no HTTP-only cookies are set).
 * Therefore, true server-side auth enforcement cannot be done here.
 *
 * Current behaviour:
 *  - Passes through all /admin/* requests (including /admin/login)
 *  - Sets the x-pathname response header so layouts/components can read
 *    the current path for breadcrumb rendering without needing usePathname()
 *    in Server Components.
 *
 * The AdminShell client component (src/components/admin/AdminShell.tsx) is
 * responsible for the actual auth redirect — it checks the session in the
 * browser and redirects to /admin/login if no valid session is found.
 *
 * TODO (production hardening):
 *  To enable real server-side route protection:
 *  1. Switch from localStorage to JWT stored in an HTTP-only cookie:
 *       cookies().set('admin_session', signedJwt, { httpOnly: true, secure: true, sameSite: 'strict' })
 *  2. Verify the JWT here using jose or jsonwebtoken:
 *       const { payload } = await jwtVerify(token, secret)
 *  3. If verification fails, redirect to /admin/login:
 *       return NextResponse.redirect(new URL('/admin/login', req.url))
 *  4. Optionally enforce role-based access per route segment.
 *  Recommended library: next-auth (NextAuth.js) for a full solution.
 */

import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Build the response that passes the request through unchanged
  const response = NextResponse.next();

  // Attach the current pathname as a response header.
  // Server Components and layouts can read this via headers() to build
  // breadcrumbs or set page titles without client-side routing hooks.
  response.headers.set("x-pathname", pathname);

  return response;
}

export const config = {
  // Match all /admin/* routes (the login page is included intentionally —
  // the AdminShell skips the auth check on /admin/login itself).
  matcher: ["/admin/:path*"],
};

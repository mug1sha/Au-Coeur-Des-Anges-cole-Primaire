import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ROLE_PERMISSIONS, type UserRole } from "@/lib/admin-types";

export interface AuthedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Verifies the session and optionally checks role permission.
 * Returns the user or a 401/403 NextResponse.
 */
export async function requireAuth(
  resource?: string
): Promise<{ user: AuthedUser } | NextResponse> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, role, active")
    .eq("id", session.user.id)
    .single();

  if (!profile || !profile.active) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  if (resource) {
    const perms = ROLE_PERMISSIONS[profile.role as UserRole] ?? [];
    const allowed = perms.includes("*") || perms.includes(resource);
    if (!allowed) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission d'accéder à cette ressource." },
        { status: 403 }
      );
    }
  }

  return { user: profile as AuthedUser };
}

export function isNextResponse(val: unknown): val is NextResponse {
  return val instanceof NextResponse;
}

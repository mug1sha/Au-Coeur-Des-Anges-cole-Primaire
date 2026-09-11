/**
 * Admin authentication layer — backed by Supabase Auth.
 * Signs in via the BROWSER Supabase client so the session cookie
 * is set correctly by @supabase/ssr in the browser context.
 */

import { createClient } from "@/lib/supabase/client";
import { hasPermission, type UserRole } from "./admin-types";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: number;
}

export interface AdminLoginResult {
  success: boolean;
  session?: AdminSession;
  error?: string;
}

// ─────────────────────────────────────────────
// LOGIN — signs in via browser client directly
// so the session cookie is set in the browser
// ─────────────────────────────────────────────
export async function adminLogin(
  email: string,
  password: string,
  _remember = false
): Promise<AdminLoginResult> {
  const supabase = createClient();

  // Step 1: sign in — this sets the session cookie via @supabase/ssr
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.session) {
    return { success: false, error: "Identifiants incorrects." };
  }

  // Step 2: fetch the profile to get role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, email, role, active")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { success: false, error: "Profil introuvable. Contactez l'administrateur." };
  }

  if (!profile.active) {
    await supabase.auth.signOut();
    return { success: false, error: "Ce compte est désactivé." };
  }

  return {
    success: true,
    session: {
      userId: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role as UserRole,
      token: "",
      expiresAt: new Date(authData.session.expires_at! * 1000).getTime(),
    },
  };
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
export async function adminLogout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

// ─────────────────────────────────────────────
// SESSION CHECK
// ─────────────────────────────────────────────
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", session.user.id)
    .single();

  if (!profile) return null;

  return {
    userId: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    token: "",
    expiresAt: new Date(session.expires_at! * 1000).getTime(),
  };
}

// ─────────────────────────────────────────────
// PERMISSION HELPERS
// ─────────────────────────────────────────────
export { hasPermission };

export function canAccess(session: AdminSession | null, resource: string): boolean {
  if (!session) return false;
  return hasPermission(session.role, resource);
}

export async function verifyAdminSession(
  _token: string,
  _requiredResource?: string
): Promise<{ valid: boolean; session?: AdminSession; error?: string }> {
  const session = await getAdminSession();
  if (!session) return { valid: false, error: "Non authentifié." };
  return { valid: true, session };
}

// Legacy stubs
export function isAdminAuthenticated(): boolean { return false; }
export function setAdminSession(_s: AdminSession, _r = false) {}
export function clearAdminSession() {}

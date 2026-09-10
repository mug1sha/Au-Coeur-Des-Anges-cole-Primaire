/**
 * Admin authentication layer — backed by Supabase Auth.
 * Client-side helpers only. All real auth happens via /api/auth/* routes.
 */

import { createClient } from "@/lib/supabase/client";
import { ROLE_PERMISSIONS, type UserRole } from "./admin-types";

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
// LOGIN — calls /api/auth/login
// ─────────────────────────────────────────────
export async function adminLogin(
  email: string,
  password: string,
  _remember = false
): Promise<AdminLoginResult> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error ?? "Identifiants incorrects." };
  }

  return {
    success: true,
    session: {
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
      token: data.access_token,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
    },
  };
}

// ─────────────────────────────────────────────
// LOGOUT — calls /api/auth/logout
// ─────────────────────────────────────────────
export async function adminLogout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

// ─────────────────────────────────────────────
// SESSION CHECK — reads from Supabase client
// ─────────────────────────────────────────────
export function isAdminAuthenticated(): boolean {
  // Optimistic check — real guard is in middleware.ts server-side
  if (typeof window === "undefined") return false;
  return !!document.cookie.includes("sb-aubdtgbewzdntilhenos-auth-token");
}

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
    token: session.access_token,
    expiresAt: new Date(session.expires_at! * 1000).getTime(),
  };
}

// ─────────────────────────────────────────────
// PERMISSION HELPERS
// ─────────────────────────────────────────────
export function hasPermission(role: UserRole, resource: string): boolean {
  const perms = ROLE_PERMISSIONS[role] ?? [];
  return perms.includes("*") || perms.includes(resource);
}

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

// Legacy stubs kept for backwards compat with any component still importing them
export function setAdminSession(_s: AdminSession, _r = false) {}
export function clearAdminSession() {}

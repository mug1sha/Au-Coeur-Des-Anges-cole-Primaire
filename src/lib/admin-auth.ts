/**
 * Admin authentication & authorization layer.
 *
 * Architecture:
 * - Client-side: useAdminAuth hook guards UI, reads from sessionStorage/localStorage
 * - Server-side: verifyAdminSession() must be called in Server Components / API routes
 *   before returning sensitive data (replaces the mock when a real backend exists).
 *
 * TODO: replace localStorage mock with:
 *   - NextAuth.js (recommended), or
 *   - JWT cookies validated in middleware.ts, or
 *   - Any server-side session system
 */

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
  expiresAt: number; // unix ms
}

const SESSION_KEY = "admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// ─────────────────────────────────────────────
// MOCK CREDENTIALS (replace with real auth)
// ─────────────────────────────────────────────
const MOCK_ADMIN_CREDENTIALS: {
  email: string;
  password: string;
  userId: string;
  name: string;
  role: UserRole;
}[] = [
  {
    email: "admin@aucoeurddesanges.rw",
    password: "Admin2026!",
    userId: "u1",
    name: "Directeur Admin",
    role: "super_admin",
  },
  {
    email: "finance@example.com",
    password: "Finance2026!",
    userId: "u3",
    name: "Comptable Principale",
    role: "accountant",
  },
  {
    email: "coord@example.com",
    password: "Coord2026!",
    userId: "u4",
    name: "Coordinatrice Admin",
    role: "admin",
  },
  {
    email: "content@example.com",
    password: "Content2026!",
    userId: "u5",
    name: "Gestionnaire Contenu",
    role: "content_manager",
  },
];

// ─────────────────────────────────────────────
// SESSION STORAGE HELPERS
// ─────────────────────────────────────────────
export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      sessionStorage.getItem(SESSION_KEY) ??
      localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (Date.now() > session.expiresAt) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setAdminSession(session: AdminSession, remember = false): void {
  if (typeof window === "undefined") return;
  const store = remember ? localStorage : sessionStorage;
  store.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
export interface AdminLoginResult {
  success: boolean;
  session?: AdminSession;
  error?: string;
}

export async function adminLogin(
  email: string,
  password: string,
  remember = false
): Promise<AdminLoginResult> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 800));

  const match = MOCK_ADMIN_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );

  if (!match) {
    return { success: false, error: "Identifiants incorrects." };
  }

  const session: AdminSession = {
    userId: match.userId,
    name: match.name,
    email: match.email,
    role: match.role,
    token: `mock-admin-token-${match.userId}-${Date.now()}`,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  setAdminSession(session, remember);
  return { success: true, session };
}

export function adminLogout(): void {
  clearAdminSession();
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

/**
 * Server-side permission check stub.
 * TODO: implement real JWT / session cookie verification here.
 * Call this at the top of every Server Action and API Route handler.
 */
export async function verifyAdminSession(
  _token: string,
  _requiredResource?: string
): Promise<{ valid: boolean; session?: AdminSession; error?: string }> {
  // Mock: always passes in dev.
  // In production, verify JWT signature and expiry against your DB/cache.
  return { valid: true };
}

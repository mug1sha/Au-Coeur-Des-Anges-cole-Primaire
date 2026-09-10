/**
 * Finance permission guard.
 *
 * Roles that can access finance data:
 *   - super_admin : full access (read + write + delete)
 *   - admin       : read + write (no delete)
 *   - accountant  : read + write (no delete)
 *
 * Teachers and parents have NO access to any finance data.
 *
 * Usage in API routes:
 *   const check = checkFinancePermission(session, "write");
 *   if (!check.allowed) return NextResponse.json({ error: check.reason }, { status: 403 });
 *
 * Usage in client components:
 *   const { canRead, canWrite, canDelete } = useFinancePermissions();
 */

import type { UserRole } from "./admin-types";
import type { AdminSession } from "./admin-auth";

export type FinanceAction = "read" | "write" | "delete";

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

const FINANCE_ROLES: Record<UserRole, FinanceAction[]> = {
  super_admin: ["read", "write", "delete"],
  admin:       ["read", "write"],
  accountant:  ["read", "write"],
  teacher:     [],
  parent:      [],
  content_manager: [],
};

/**
 * Check whether a session holder may perform a given finance action.
 * Call server-side (in API routes) with a verified session.
 */
export function checkFinancePermission(
  session: AdminSession | null,
  action: FinanceAction
): PermissionResult {
  if (!session) {
    return { allowed: false, reason: "Non authentifié." };
  }
  const allowed = FINANCE_ROLES[session.role] ?? [];
  if (!allowed.includes(action)) {
    return {
      allowed: false,
      reason: `Le rôle "${session.role}" ne peut pas effectuer l'action "${action}" sur les données financières.`,
    };
  }
  return { allowed: true };
}

/**
 * Client-side hook — derives permissions from the session stored in localStorage/sessionStorage.
 * Never use this as the sole guard on the server.
 */
export function getFinancePermissions(role: UserRole | undefined): {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
} {
  if (!role) return { canRead: false, canWrite: false, canDelete: false };
  const perms = FINANCE_ROLES[role] ?? [];
  return {
    canRead:   perms.includes("read"),
    canWrite:  perms.includes("write"),
    canDelete: perms.includes("delete"),
  };
}

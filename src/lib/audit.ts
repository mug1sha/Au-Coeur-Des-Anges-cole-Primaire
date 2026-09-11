import { createClient } from "@/lib/supabase/server";
import type { AuthedUser } from "@/lib/supabase/auth-guard";
import type { AuditAction } from "@/lib/admin-types";

export async function writeAuditLog(opts: {
  user: AuthedUser;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: string;
  ip?: string;
}): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      user_id: opts.user.id,
      user_name: opts.user.name,
      user_role: opts.user.role,
      action: opts.action,
      resource: opts.resource,
      resource_id: opts.resourceId ?? null,
      details: opts.details ?? null,
      ip_address: opts.ip ?? null,
    });
  } catch {
    // Audit must never block the primary action
  }
}

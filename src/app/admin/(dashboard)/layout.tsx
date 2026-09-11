/**
 * Dashboard layout — wraps authenticated admin pages only.
 * /admin/login lives in the (auth) group and never reaches this layout.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import type { AdminSession } from "@/lib/admin-auth";
import type { UserRole } from "@/lib/admin-types";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, email, role, active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.active) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const expiresAt = sessionData.session?.expires_at
    ? new Date(sessionData.session.expires_at * 1000).getTime()
    : Date.now() + 3_600_000;

  const initialSession: AdminSession = {
    userId: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role as UserRole,
    token: "",
    expiresAt,
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] text-[#463ACB]">
      <AdminShell initialSession={initialSession}>{children}</AdminShell>
    </div>
  );
}

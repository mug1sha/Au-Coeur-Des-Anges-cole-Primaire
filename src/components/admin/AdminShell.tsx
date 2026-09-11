"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { AdminSessionProvider } from "@/lib/AdminSessionContext";
import type { AdminSession } from "@/lib/admin-auth";

interface AdminShellProps {
  children: React.ReactNode;
  /**
   * Session resolved server-side and passed down — avoids a client-side
   * Supabase round-trip on every page load, eliminating the spinner flash.
   * Pass null if on the login page.
   */
  initialSession?: AdminSession | null;
}

export default function AdminShell({ children, initialSession = null }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AdminSessionProvider initial={initialSession}>
      <div className="flex h-screen overflow-hidden bg-[#F5F6FA]">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
            collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
          }`}
        >
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} session={initialSession} />
          <main className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}

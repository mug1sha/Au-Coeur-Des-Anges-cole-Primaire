"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAdminSession } from "@/lib/AdminSessionContext";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminSessionProvider } from "@/lib/AdminSessionContext";
import type { AdminSession } from "@/lib/admin-auth";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }
    getAdminSession().then((s) => {
      if (!s) {
        router.replace("/admin/login");
      } else {
        setSession(s);
        setChecked(true);
      }
    });
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F6FA]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6B35] border-t-transparent" />
      </div>
    );
  }

  return (
    <AdminSessionProvider initial={session}>
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
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} session={session} />
          <main className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}

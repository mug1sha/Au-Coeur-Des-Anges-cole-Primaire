"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { getAdminSession } from "@/lib/admin-auth";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/set-state-in-effect -- auth check pattern: setChecked synchronously in effect is intentional here
  useEffect(() => {
    // Skip auth check for the login page itself
    if (pathname === "/admin/login") {
      setChecked(true); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const session = getAdminSession();
    if (!session) {
      router.replace("/admin/login");
    } else {
      setChecked(true); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [pathname, router]);

  // Don't render the shell on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show nothing while checking auth to avoid flash
  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F6FA]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6B35] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6FA]">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />

      {/* Mobile overlay */}
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
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

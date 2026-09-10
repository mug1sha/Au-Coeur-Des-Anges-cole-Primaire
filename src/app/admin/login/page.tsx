import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLoginClient from "@/components/admin/AdminLoginClient";

export const metadata: Metadata = {
  title: "Connexion | Administration — Au Coeur Des Anges",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF6B35] border-t-transparent" />
      </div>
    }>
      <AdminLoginClient />
    </Suspense>
  );
}

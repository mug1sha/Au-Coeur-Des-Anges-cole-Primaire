import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Administration | Au Coeur Des Anges", template: "%s | Admin" },
  description: "Tableau de bord d'administration — Au Coeur Des Anges",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F5F6FA] text-[#463ACB] min-h-screen">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}

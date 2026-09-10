import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "../globals.css";
import AdminShell from "@/components/admin/AdminShell";

const inter = Inter({ variable: "--font-body", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-heading", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Administration | Au Coeur Des Anges", template: "%s | Admin" },
  description: "Tableau de bord d'administration — Au Coeur Des Anges",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${nunito.variable} font-[family-name:var(--font-body)] bg-[#F5F6FA] text-[#463ACB]`}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Administration | Au Coeur Des Anges", template: "%s | Admin" },
  description: "Tableau de bord d'administration — Au Coeur Des Anges",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

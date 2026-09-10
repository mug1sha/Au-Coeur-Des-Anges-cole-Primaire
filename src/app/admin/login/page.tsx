import type { Metadata } from "next";
import AdminLoginClient from "@/components/admin/AdminLoginClient";

export const metadata: Metadata = {
  title: "Connexion | Administration — Au Coeur Des Anges",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}

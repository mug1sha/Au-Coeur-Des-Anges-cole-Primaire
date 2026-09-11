import type { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/pages/DashboardClient";

export const metadata: Metadata = { title: "Tableau de bord" };

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}

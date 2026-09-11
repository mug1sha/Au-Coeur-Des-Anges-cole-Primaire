import type { Metadata } from "next";
import FinanceOverviewClient from "@/components/admin/pages/FinanceOverviewClient";

export const metadata: Metadata = {
  title: "Finance",
  description: "Vue d'ensemble financière — Au Coeur Des Anges",
};

export default function FinancePage() {
  return <FinanceOverviewClient />;
}

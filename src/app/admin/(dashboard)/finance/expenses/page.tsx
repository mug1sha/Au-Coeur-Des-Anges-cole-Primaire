import type { Metadata } from "next";
import ExpensesClient from "@/components/admin/pages/ExpensesClient";
export const metadata: Metadata = { title: "Dépenses" };
export default function ExpensesPage() { return <ExpensesClient />; }

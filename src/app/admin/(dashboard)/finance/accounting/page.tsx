import type { Metadata } from "next";
import AccountingClient from "@/components/admin/pages/AccountingClient";
export const metadata: Metadata = { title: "Comptabilité" };
export default function AccountingPage() { return <AccountingClient />; }

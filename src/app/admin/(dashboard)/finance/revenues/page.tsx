import type { Metadata } from "next";
import RevenuesClient from "@/components/admin/pages/RevenuesClient";
export const metadata: Metadata = { title: "Revenus" };
export default function RevenuesPage() { return <RevenuesClient />; }

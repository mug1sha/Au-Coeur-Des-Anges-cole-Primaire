import type { Metadata } from "next";
import ReportsClient from "@/components/admin/pages/ReportsClient";
export const metadata: Metadata = { title: "Rapports financiers" };
export default function ReportsPage() { return <ReportsClient />; }

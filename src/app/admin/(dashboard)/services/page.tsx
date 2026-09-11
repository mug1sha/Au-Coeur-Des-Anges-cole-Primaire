import type { Metadata } from "next";
import ServicesClient from "@/components/admin/pages/ServicesClient";
export const metadata: Metadata = { title: "Services" };
export default function ServicesPage() { return <ServicesClient />; }

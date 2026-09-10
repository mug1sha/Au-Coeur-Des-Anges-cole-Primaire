import type { Metadata } from "next";
import WebsiteClient from "@/components/admin/pages/WebsiteClient";
export const metadata: Metadata = { title: "Contenu du site" };
export default function WebsitePage() { return <WebsiteClient />; }

import type { Metadata } from "next";
import AnnouncementsClient from "@/components/admin/pages/AnnouncementsClient";
export const metadata: Metadata = { title: "Annonces" };
export default function AnnouncementsPage() { return <AnnouncementsClient />; }

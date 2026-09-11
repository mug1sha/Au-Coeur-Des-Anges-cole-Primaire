import type { Metadata } from "next";
import GalleryAdminClient from "@/components/admin/pages/GalleryAdminClient";
export const metadata: Metadata = { title: "Galerie" };
export default function GalleryAdminPage() { return <GalleryAdminClient />; }

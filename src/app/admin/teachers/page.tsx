import type { Metadata } from "next";
import TeachersClient from "@/components/admin/pages/TeachersClient";
export const metadata: Metadata = { title: "Enseignants" };
export default function TeachersPage() { return <TeachersClient />; }

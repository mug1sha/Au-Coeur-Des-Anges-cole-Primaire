import type { Metadata } from "next";
import UsersClient from "@/components/admin/pages/UsersClient";
export const metadata: Metadata = { title: "Utilisateurs & Rôles" };
export default function UsersPage() { return <UsersClient />; }

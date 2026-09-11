import type { Metadata } from "next";
import SettingsClient from "@/components/admin/pages/SettingsClient";
export const metadata: Metadata = { title: "Paramètres" };
export default function SettingsPage() { return <SettingsClient />; }

import type { Metadata } from "next";
import ActivityClient from "@/components/admin/pages/ActivityClient";
export const metadata: Metadata = { title: "Journal d'activité" };
export default function ActivityPage() { return <ActivityClient />; }

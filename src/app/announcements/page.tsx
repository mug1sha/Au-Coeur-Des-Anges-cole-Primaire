import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AnnouncementsPublicClient from "@/components/announcements/AnnouncementsPublicClient";
import { getPublicAnnouncements } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Annonces | Au Coeur Des Anges",
  description:
    "Retrouvez toutes les informations, actualités et événements de l'école Au Coeur Des Anges — crèche et maternelle à Kigali.",
  openGraph: {
    title: "Annonces — Au Coeur Des Anges",
    description: "Informations, actualités et événements de l'école.",
  },
};

export default async function AnnouncementsPage() {
  // Fetch published, non-expired announcements at render time.
  // When a real backend is connected, this becomes a proper data fetch.
  const announcements = await getPublicAnnouncements();

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <AnnouncementsPublicClient initialAnnouncements={announcements} />
      </main>
      <Footer />
    </>
  );
}

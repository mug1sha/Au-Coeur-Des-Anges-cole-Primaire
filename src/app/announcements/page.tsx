import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import AnnouncementsPublicClient from "@/components/announcements/AnnouncementsPublicClient";
import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/lib/admin-types";

export const metadata: Metadata = {
  title: "Annonces",
  description:
    "Retrouvez toutes les informations, actualités et événements de l'école Au Coeur Des Anges — crèche et maternelle à Kigali.",
  openGraph: {
    title: "Annonces — Au Coeur Des Anges",
    description: "Informations, actualités et événements de l'école.",
    url: "/announcements",
  },
};

/** Number of announcements fetched on the first server render. */
const INITIAL_LIMIT = 12;

export default async function AnnouncementsPage() {
  let announcements: Announcement[] = [];
  let initialTotal = 0;

  try {
    const supabase = await createClient();
    // Select only the first page — avoids loading the entire table on SSR.
    // count: "exact" returns the total row count in one round-trip.
    const { data, count } = await supabase
      .from("announcements")
      .select("*", { count: "exact" })
      .eq("status", "published")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .range(0, INITIAL_LIMIT - 1);

    initialTotal = count ?? 0;

    if (data) {
      // Map snake_case DB fields to camelCase types
      announcements = data.map((row) => ({
        id:          row.id,
        title:       row.title,
        content:     row.content,
        excerpt:     row.excerpt,
        category:    row.category,
        coverImage:  row.cover_image,
        status:      row.status,
        publishedAt: row.published_at,
        expiresAt:   row.expires_at,
        pinned:      row.pinned,
        author:      row.author,
        createdAt:   row.created_at,
        updatedAt:   row.updated_at,
      }));
    }
  } catch {
    // If DB not yet set up or error, show empty state gracefully
    announcements = [];
    initialTotal  = 0;
  }

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <AnnouncementsPublicClient
          initialAnnouncements={announcements}
          initialTotal={initialTotal}
          pageSize={INITIAL_LIMIT}
        />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import MissionVision from "@/components/about/MissionVision";
import OurValues from "@/components/about/OurValues";
import PedagogicalApproach from "@/components/about/PedagogicalApproach";
import TeamPreview from "@/components/about/TeamPreview";
import AboutCTA from "@/components/about/AboutCTA";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "À Propos",
  description:
    "Découvrez l'histoire, la mission, les valeurs et la philosophie pédagogique d'Au Coeur Des Anges — crèche et maternelle à Kigali, Rwanda.",
  openGraph: {
    title: "À Propos — Au Coeur Des Anges",
    description:
      "Découvrez l'histoire, la mission, les valeurs et la philosophie pédagogique d'Au Coeur Des Anges.",
    url: "/about",
    images: [{ url: "/images/school.jpg", width: 1200, height: 630, alt: "Notre école" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "À Propos — Au Coeur Des Anges",
    description: "Histoire, mission, valeurs et philosophie pédagogique.",
    images: ["/images/school.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <AboutHero />
        <OurStory />
        <MissionVision />
        <OurValues />
        <PedagogicalApproach />
        <TeamPreview />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}

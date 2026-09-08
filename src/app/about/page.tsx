import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import OurMission from "@/components/about/OurMission";
import OurVision from "@/components/about/OurVision";
import OurValues from "@/components/about/OurValues";
import EducationalPhilosophy from "@/components/about/EducationalPhilosophy";
import TeamPreview from "@/components/about/TeamPreview";
import AboutCTA from "@/components/about/AboutCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'histoire, la mission et les valeurs de l'École Primaire Au Coeur Des Anges. Une éducation bienveillante et d'excellence pour chaque enfant.",
  openGraph: {
    title: "À propos — Au Coeur Des Anges",
    description:
      "Notre histoire, notre mission et nos valeurs pour l'épanouissement de chaque enfant.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <OurStory />
        <OurMission />
        <OurVision />
        <OurValues />
        <EducationalPhilosophy />
        <TeamPreview />
        <AboutCTA />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ServiceHero from "@/components/service/ServiceHero";
import ProgramsSection from "@/components/service/ProgramsSection";
import ActivitiesSection from "@/components/service/ActivitiesSection";
import DailyRoutine from "@/components/service/DailyRoutine";
import ServiceCTA from "@/components/service/ServiceCTA";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Nos Services",
  description:
    "Découvrez nos programmes éducatifs, activités et journée type à Au Coeur Des Anges — crèche et maternelle à Kigali.",
  openGraph: {
    title: "Nos Services — Au Coeur Des Anges",
    description:
      "Découvrez nos programmes éducatifs, activités et journée type à Au Coeur Des Anges — crèche et maternelle à Kigali.",
    url: "/services",
    images: [{ url: "/images/maternelle.jpg", width: 1200, height: 630, alt: "Nos Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nos Services — Au Coeur Des Anges",
    description: "Découvrez nos programmes éducatifs, activités et journée type.",
    images: ["/images/maternelle.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <ServiceHero />
        <ProgramsSection />
        <ActivitiesSection />
        <DailyRoutine />
        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}

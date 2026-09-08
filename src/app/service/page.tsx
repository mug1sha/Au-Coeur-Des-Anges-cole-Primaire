import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ServiceHero from "@/components/service/ServiceHero";
import ServicesGrid from "@/components/service/ServicesGrid";
import HowWeSupport from "@/components/service/HowWeSupport";
import EducationalValues from "@/components/service/EducationalValues";
import ServiceCTA from "@/components/service/ServiceCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Découvrez les services de l'École Primaire Au Coeur Des Anges : enseignement, accompagnement personnalisé, activités sportives et créatives, et bien plus.",
  openGraph: {
    title: "Services — Au Coeur Des Anges",
    description:
      "Un service complet pour chaque famille : enseignement, accompagnement, activités sportives et créatives.",
    url: "/service",
  },
};

export default function ServicePage() {
  return (
    <>
      <Navbar />
      <main>
        <ServiceHero />
        <ServicesGrid />
        <HowWeSupport />
        <EducationalValues />
        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}

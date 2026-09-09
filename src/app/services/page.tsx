import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ServiceHero from "@/components/service/ServiceHero";
import ProgramsSection from "@/components/service/ProgramsSection";
import ActivitiesSection from "@/components/service/ActivitiesSection";
import DailyRoutine from "@/components/service/DailyRoutine";
import ServiceCTA from "@/components/service/ServiceCTA";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Nos Services | Au Coeur Des Anges",
  description:
    "Découvrez nos programmes éducatifs, activités et journée type à Au Coeur Des Anges — crèche et maternelle à Kigali.",
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

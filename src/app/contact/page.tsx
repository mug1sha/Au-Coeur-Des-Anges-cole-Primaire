import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import ContactCTA from "@/components/contact/ContactCTA";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact | Au Coeur Des Anges",
  description:
    "Contactez Au Coeur Des Anges. Adresse, téléphone, formulaire de contact et localisation à Kigali, Rwanda.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <ContactHero />
        <ContactSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}

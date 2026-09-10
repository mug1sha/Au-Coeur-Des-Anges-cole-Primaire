import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import ContactCTA from "@/components/contact/ContactCTA";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Au Coeur Des Anges. Adresse, téléphone, formulaire de contact et localisation à Kigali, Rwanda.",
  openGraph: {
    title: "Contact — Au Coeur Des Anges",
    description: "Contactez-nous pour toute question ou pour planifier une visite.",
    url: "/contact",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 630, alt: "Contactez-nous" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Au Coeur Des Anges",
    description: "Contactez-nous pour toute question ou pour planifier une visite.",
    images: ["/images/hero.jpg"],
  },
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

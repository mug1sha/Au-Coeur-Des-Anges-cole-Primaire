import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import MapPlaceholder from "@/components/contact/MapPlaceholder";
import FAQ from "@/components/contact/FAQ";
import ContactCTA from "@/components/contact/ContactCTA";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'École Primaire Au Coeur Des Anges. Adresse, téléphone, formulaire de contact et plan d'accès.",
  openGraph: {
    title: "Contact — Au Coeur Des Anges",
    description:
      "Nous sommes à votre écoute pour répondre à toutes vos questions.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactHero />
        <ContactInfo />
        <ContactForm />
        <MapPlaceholder />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}

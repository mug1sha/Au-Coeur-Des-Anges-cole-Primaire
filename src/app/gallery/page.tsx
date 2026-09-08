import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryClient from "@/components/gallery/GalleryClient";
import GalleryCTA from "@/components/gallery/GalleryCTA";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Découvrez la vie quotidienne à l'École Primaire Au Coeur Des Anges à travers notre galerie photos : vie scolaire, activités, sport, arts et événements.",
  openGraph: {
    title: "Galerie — Au Coeur Des Anges",
    description:
      "Quelques moments de vie à l'École Primaire Au Coeur Des Anges.",
    url: "/gallery",
  },
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        <GalleryHero />
        <GalleryClient />
        <GalleryCTA />
      </main>
      <Footer />
    </>
  );
}

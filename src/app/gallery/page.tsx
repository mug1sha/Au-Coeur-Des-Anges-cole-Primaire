import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryClient from "@/components/gallery/GalleryClient";
import GalleryCTA from "@/components/gallery/GalleryCTA";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Galerie | Au Coeur Des Anges",
  description:
    "Découvrez la vie quotidienne à Au Coeur Des Anges à travers notre galerie — espaces de jeu, activités, ateliers et événements.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <GalleryHero />
        <GalleryClient />
        <GalleryCTA />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryClient from "@/components/gallery/GalleryClient";
import GalleryCTA from "@/components/gallery/GalleryCTA";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Découvrez la vie quotidienne à Au Coeur Des Anges à travers notre galerie — espaces de jeu, activités, ateliers et événements.",
  openGraph: {
    title: "Galerie — Au Coeur Des Anges",
    description: "Photos de la vie quotidienne : espaces de jeu, activités, ateliers et événements.",
    url: "/gallery",
    images: [{ url: "/gallery/home1.jpg", width: 1200, height: 630, alt: "Galerie" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galerie — Au Coeur Des Anges",
    description: "Photos de la vie quotidienne : espaces de jeu, activités, ateliers et événements.",
    images: ["/gallery/home1.jpg"],
  },
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

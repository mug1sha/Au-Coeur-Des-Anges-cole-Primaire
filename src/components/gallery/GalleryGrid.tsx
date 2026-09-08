"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  span: "tall" | "wide" | "normal";
  color: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: "/gallery/classe.jpg", alt: "Une classe animée pendant un cours de mathématiques", category: "vie-scolaire", span: "tall", color: "#0783BD" },
  { id: 2, src: "/gallery/lecture.jpg", alt: "Un moment de lecture collective dans la bibliothèque", category: "vie-scolaire", span: "normal", color: "#FF7800" },
  { id: 3, src: "/gallery/jardinage.jpg", alt: "Les enfants jardinent dans le potager scolaire", category: "activites", span: "normal", color: "#023250" },
  { id: 4, src: "/gallery/peinture.jpg", alt: "Atelier de peinture artistique en plein air", category: "arts", span: "tall", color: "#FF7800" },
  { id: 5, src: "/gallery/football.jpg", alt: "Match de football entre équipes", category: "sport", span: "wide", color: "#0783BD" },
  { id: 6, src: "/gallery/musique.jpg", alt: "Cours de musique et découverte des instruments", category: "arts", span: "normal", color: "#023250" },
  { id: 7, src: "/gallery/fete.jpg", alt: "Célébration de la fête de l'école", category: "evenements", span: "tall", color: "#FF7800" },
  { id: 8, src: "/gallery/natation.jpg", alt: "Cours de natation à la piscine municipale", category: "sport", span: "normal", color: "#0783BD" },
  { id: 9, src: "/gallery/theatre.jpg", alt: "Répétition de la pièce de théâtre annuelle", category: "arts", span: "wide", color: "#023250" },
  { id: 10, src: "/gallery/science.jpg", alt: "Expérience scientifique en laboratoire", category: "activites", span: "normal", color: "#0783BD" },
  { id: 11, src: "/gallery/sortie.jpg", alt: "Sortie culturelle au musée", category: "evenements", span: "tall", color: "#FF7800" },
  { id: 12, src: "/gallery/dessin.jpg", alt: "Cours de dessin et exploration artistique", category: "arts", span: "normal", color: "#023250" },
  { id: 13, src: "/gallery/cantine.jpg", alt: "Moment de convivialité à la cantine", category: "vie-scolaire", span: "normal", color: "#0783BD" },
  { id: 14, src: "/gallery/athletisme.jpg", alt: "Rencontre d'athlétisme inter-écoles", category: "sport", span: "tall", color: "#FF7800" },
  { id: 15, src: "/gallery/celebration.jpg", alt: "Remise des prix de fin d'année", category: "evenements", span: "wide", color: "#023250" },
];

interface GalleryGridProps {
  activeCategory: string;
}

export default function GalleryGrid({ activeCategory }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! + 1) % filteredImages.length);
  }, [lightboxIndex, filteredImages.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredImages.length) % filteredImages.length);
  }, [lightboxIndex, filteredImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, goNext, goPrev]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, i) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative cursor-pointer rounded-[5px] overflow-hidden ${
                image.span === "tall" ? "row-span-2" : ""
              } ${image.span === "wide" ? "sm:col-span-2" : ""}`}
              onClick={() => openLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(i);
                }
              }}
              aria-label={`Voir l'image: ${image.alt}`}
            >
              {/* Placeholder background with zoom */}
              <div className="absolute inset-0 img-zoom">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${image.color}18, ${image.color}08)`,
                  }}
                />
              </div>

              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id={`pattern-${image.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="20" cy="20" r="1.5" fill={image.color} />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#pattern-${image.id})`} />
                </svg>
              </div>

              {/* Icon placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-[5px] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg icon-spin-hover"
                  style={{ backgroundColor: `${image.color}15` }}
                >
                  <svg
                    className="w-7 h-7"
                    style={{ color: image.color }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/60 transition-all duration-300 ease-[var(--ease-out)] flex items-end p-5">
                <div className="w-full translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[var(--ease-out)]">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold text-white/90 mb-2"
                    style={{ backgroundColor: `${image.color}90` }}
                  >
                    {image.category === "vie-scolaire" && "Vie scolaire"}
                    {image.category === "activites" && "Activités"}
                    {image.category === "sport" && "Sport"}
                    {image.category === "arts" && "Arts & créativité"}
                    {image.category === "evenements" && "Événements"}
                  </span>
                  <p className="text-sm text-white/90 leading-relaxed line-clamp-2">
                    {image.alt}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            ref={lightboxRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === lightboxRef.current) closeLightbox();
            }}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 btn-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 sm:left-8 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 btn-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Image précédente"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 sm:right-8 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 btn-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Image suivante"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* Image content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl w-full mx-4 sm:mx-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image placeholder */}
                <div
                  className="relative w-full aspect-[4/3] rounded-[5px] overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${galleryImages[lightboxIndex].color}20, ${galleryImages[lightboxIndex].color}08)`,
                  }}
                >
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-[5px] flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: `${galleryImages[lightboxIndex].color}15` }}
                    >
                      <svg
                        className="w-9 h-9"
                        style={{ color: galleryImages[lightboxIndex].color }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-heading font-semibold" style={{ color: galleryImages[lightboxIndex].color }}>
                      Image en haute résolution
                    </p>
                  </div>
                </div>

                {/* Caption */}
                <div className="mt-4 text-center">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-heading font-semibold text-white/80 mb-2"
                    style={{ backgroundColor: `${galleryImages[lightboxIndex].color}40` }}
                  >
                    {galleryImages[lightboxIndex].category === "vie-scolaire" && "Vie scolaire"}
                    {galleryImages[lightboxIndex].category === "activites" && "Activités"}
                    {galleryImages[lightboxIndex].category === "sport" && "Sport"}
                    {galleryImages[lightboxIndex].category === "arts" && "Arts & créativité"}
                    {galleryImages[lightboxIndex].category === "evenements" && "Événements"}
                  </span>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {galleryImages[lightboxIndex].alt}
                  </p>
                  <p className="text-white/40 text-xs mt-2 font-heading">
                    {lightboxIndex + 1} / {filteredImages.length}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

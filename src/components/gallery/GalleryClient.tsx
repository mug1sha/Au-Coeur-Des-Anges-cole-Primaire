"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { FadeUp } from "@/lib/animations";
import { useFocusTrap } from "@/lib/useFocusTrap";

type Category = "all" | "espaces" | "activites" | "repos" | "evenements";

interface GalleryItem {
  src: string;
  alt: string;
  category: Category;
  span?: "wide" | "tall" | "normal";
}

const items: GalleryItem[] = [
  { src: "/images/hero.jpg", alt: "Enfants en activité", category: "activites", span: "wide" },
  { src: "/images/school.jpg", alt: "L\u2019école", category: "espaces", span: "tall" },
  { src: "/images/creche.jpg", alt: "La crèche", category: "espaces" },
  { src: "/images/maternelle.jpg", alt: "La maternelle", category: "activites" },
  { src: "/gallery/home1.jpg", alt: "Moment de vie", category: "activites", span: "wide" },
  { src: "/gallery/home2.jpg", alt: "Espace de jeu", category: "espaces" },
  { src: "/gallery/home3.jpg", alt: "Activité créative", category: "activites" },
  { src: "/gallery/home4.jpg", alt: "Repos & détente", category: "repos", span: "wide" },
  { src: "/gallery/SaveInta.com_687716127_18103394218820336_4645229405665639641_n.jpg", alt: "Atelier", category: "activites" },
  { src: "/gallery/SaveInta.com_689781505_18103395148820336_4660054925702114142_n.jpg", alt: "Événement", category: "evenements" },
  { src: "/gallery/SaveInta.com_683863397_18103396111820336_3558858900540924310_n.jpg", alt: "Espace repos", category: "repos" },
  { src: "/gallery/SaveInta.com_685856216_18103397071820336_179393363516157231_n.jpg", alt: "Activité", category: "activites", span: "tall" },
  { src: "/gallery/SaveInta.com_684899680_18103397866820336_3796937601087402777_n.jpg", alt: "Atelier créatif", category: "activites" },
  { src: "/gallery/SaveInta.com_686829456_18103398268820336_2574770879968171877_n.jpg", alt: "Espace de vie", category: "espaces" },
  { src: "/gallery/SaveInta.com_685874763_18103399318820336_4320236786891545047_n.jpg", alt: "Moment convivial", category: "evenements", span: "wide" },
  { src: "/gallery/SaveInta.com_684542056_18103399819820336_4892628499305349799_n.jpg", alt: "Jeu éducatif", category: "activites" },
  { src: "/gallery/SaveInta.com_685522138_18103401121820336_30625268061250043_n.jpg", alt: "Activité groupe", category: "activites" },
  { src: "/gallery/SaveInta.com_684933413_18103401367820336_4233310601391204048_n.jpg", alt: "Atelier", category: "activites" },
];

const filters: { key: Category; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "espaces", label: "Espaces de Jeu" },
  { key: "activites", label: "Activités & Ateliers" },
  { key: "repos", label: "Repos & Cantine" },
  { key: "evenements", label: "Événements" },
];

export default function GalleryClient() {
  const [active, setActive] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const lightboxRef = useRef<HTMLDivElement>(null);

  useFocusTrap(lightboxRef, lightbox !== null);

  const filtered = active === "all" ? items : items.filter((i) => i.category === active);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prev = useCallback(() => setLightbox((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null)), [filtered.length]);
  const next = useCallback(() => setLightbox((i) => (i !== null ? (i + 1) % filtered.length : null)), [filtered.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox, prev, next]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <section className="bg-white px-5 py-16 md:px-8 lg:py-20">
      <div className="mx-auto max-w-[1200px]">
        {/* FILTERS */}
        <FadeUp>
          <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 ${
                  active === f.key
                    ? "bg-[#FF6B35] text-white shadow-md"
                    : "border border-slate-200 bg-white text-[#463ACB] hover:border-[#FF6B35] hover:text-[#FF6B35]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </FadeUp>

        {/* GRID */}
        <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group mb-4 cursor-pointer overflow-hidden rounded-[18px] break-inside-avoid"
                onClick={() => setLightbox(i)}
              >
                <div className={`relative w-full overflow-hidden rounded-[18px] ${
                  item.span === "wide" ? "aspect-[4/3]" : item.span === "tall" ? "aspect-[3/4]" : "aspect-square"
                }`}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[#463ACB]/0 transition duration-300 group-hover:bg-[#463ACB]/20" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
                      <ZoomIn size={18} className="text-[#463ACB]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-[#463ACB]/40">Aucune photo dans cette catégorie.</p>
        )}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            ref={lightboxRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Visionneuse d\u2019images"
          >
            <button
              onClick={closeLightbox}
              aria-label="Fermer"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Image précédente"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft size={22} />
            </button>

            <motion.div
              key={lightbox}
              initial={{ scale: reduced ? 1 : 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: reduced ? 1 : 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-[16px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto object-contain"
              />
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Image suivante"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight size={22} />
            </button>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
              {lightbox + 1} / {filtered.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

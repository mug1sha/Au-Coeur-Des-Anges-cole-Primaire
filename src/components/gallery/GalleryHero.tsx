"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { src: "/images/hero.jpg",        alt: "Enfants à Au Coeur Des Anges" },
  { src: "/images/school.jpg",      alt: "Notre école" },
  { src: "/images/maternelle.jpg",  alt: "La maternelle" },
  { src: "/images/creche.jpg",      alt: "La crèche" },
  { src: "/gallery/home1.jpg",      alt: "Moment de vie" },
  { src: "/gallery/home2.jpg",      alt: "Espace de jeu" },
  { src: "/gallery/home3.jpg",      alt: "Activité créative" },
  { src: "/gallery/home4.jpg",      alt: "Repos & détente" },
  { src: "/gallery/SaveInta.com_687716127_18103394218820336_4645229405665639641_n.jpg", alt: "Atelier" },
  { src: "/gallery/SaveInta.com_689781505_18103395148820336_4660054925702114142_n.jpg", alt: "Événement" },
  { src: "/gallery/SaveInta.com_685856216_18103397071820336_179393363516157231_n.jpg",  alt: "Activité" },
  { src: "/gallery/SaveInta.com_684899680_18103397866820336_3796937601087402777_n.jpg", alt: "Atelier créatif" },
];

const INTERVAL_MS = 4000;

export default function GalleryHero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduced = useReducedMotion();

  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const goTo = (i: number) => setCurrent(i);

  // Auto-advance
  useEffect(() => {
    if (paused || reduced) return;
    timerRef.current = setInterval(next, INTERVAL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, reduced, current]);

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ minHeight: "520px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── BACKGROUND SLIDESHOW ── */}
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].src}
              alt={slides[current].alt}
              fill
              priority={current === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient overlay — ensures text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B3D]/85 via-[#0B1B3D]/60 to-[#0B1B3D]/30" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1B3D]/60 to-transparent" />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative mx-auto max-w-[1320px] px-5 py-20 md:px-8 lg:py-28">
        <div className="max-w-[620px]">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-5 inline-flex rounded-full bg-[#FF6B35] px-4 py-2 text-xs font-bold text-white"
          >
            Notre galerie
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-[family-name:var(--font-heading)] text-[38px] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[56px]"
          >
            Découvrez{" "}
            <span className="text-[#FF6B35]">notre univers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-[500px] text-base leading-7 text-white/75 sm:text-lg"
          >
            Un aperçu des espaces, activités et moments qui font la vie
            d&apos;Au Coeur Des Anges au quotidien.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/70"
          >
            {["Espaces de vie", "Activités & ateliers", "Moments de vie"].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <Star size={13} className="fill-[#FF6B35] text-[#FF6B35]" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── NAVIGATION ARROWS ── */}
      <button
        onClick={prev}
        aria-label="Image précédente"
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-[#FF6B35] hover:scale-110 sm:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Image suivante"
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center h-10 w-10 rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-[#FF6B35] hover:scale-110 sm:flex"
      >
        <ChevronRight size={20} />
      </button>

      {/* ── DOT INDICATORS ── */}
      <div
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5"
        role="tablist"
        aria-label="Diapositives"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Diapositive ${i + 1}`}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-[#FF6B35]"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* ── PAUSE INDICATOR ── */}
      {paused && !reduced && (
        <div
          className="absolute right-4 bottom-5 z-10 hidden items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-[11px] text-white/60 backdrop-blur-sm sm:flex"
          aria-hidden="true"
        >
          <span className="inline-block h-2 w-[3px] rounded-full bg-white/50" />
          <span className="inline-block h-2 w-[3px] rounded-full bg-white/50" />
          En pause
        </div>
      )}
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "./Container";
import Button from "./Button";

const heroImages = [
  "/gallery/home1.jpg",
  "/gallery/home2.jpg",
  "/gallery/home3.jpg",
  "/gallery/home4.jpg",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Slideshow background */}
      <div className="absolute inset-0" aria-hidden="true">
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/85 to-[#041e30]/90" />
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none" aria-hidden="true">
        <svg
          className="absolute bottom-0 left-0 w-full h-24"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
        >
          <path
            d="M0,48 C360,96 720,0 1080,48 C1260,72 1380,24 1440,48 L1440,96 L0,96 Z"
            fill="#0783BD"
            opacity="0.08"
          />
        </svg>
      </div>

      {/* Content */}
      <Container>
        <div className="relative z-10 w-full pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="max-w-xl lg:pl-4">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm font-heading font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-orange animate-pulse" aria-hidden="true" />
                  Inscriptions ouvertes — Année 2026-2027
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight text-balance"
              >
                Bienvenue à{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-orange">Au Coeur</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/20 -rotate-1 rounded-full" />
                </span>{" "}
                Des Anges
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 text-lg text-white/65 leading-relaxed max-w-lg"
              >
                Un environnement sûr, bienveillant et inspirant où chaque enfant
                développe ses talents, sa confiance et sa créativité. De la crèche à l&apos;école maternelle.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-9 flex flex-wrap gap-4"
              >
                <Button href="#about" variant="primary" size="lg" className="px-10">
                  Découvrir notre école
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                <Button href="#contact" variant="secondary" size="lg" className="border-white/30 text-white hover:bg-white hover:text-navy">
                  Nous contacter
                </Button>
              </motion.div>
            </div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
                <div className="absolute inset-6 rounded-full border border-white/[0.04]" />

                <div className="absolute inset-12 rounded-[5px] bg-gradient-to-br from-blue/20 to-orange/10 backdrop-blur-sm border border-white/[0.08] overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-full h-full opacity-60" aria-hidden="true">
                    <circle cx="100" cy="70" r="18" fill="#FF7800" opacity="0.7" />
                    <circle cx="70" cy="90" r="14" fill="#0783BD" opacity="0.6" />
                    <circle cx="130" cy="90" r="14" fill="#0783BD" opacity="0.6" />
                    <circle cx="85" cy="120" r="12" fill="#FFFFFF" opacity="0.3" />
                    <circle cx="115" cy="120" r="12" fill="#FFFFFF" opacity="0.3" />
                    <path
                      d="M100,145 C100,145 70,125 65,105 C60,85 80,80 100,100 C120,80 140,85 135,105 C130,125 100,145 100,145 Z"
                      fill="#FF7800"
                      opacity="0.15"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/10 max-w-2xl"
          >
            {[
              { value: "280+", label: "Élèves" },
              { value: "16", label: "Classes" },
              { value: "95%", label: "Satisfaction" },
              { value: "15", label: "Ans d'expérience" },
            ].map((stat, i) => (
              <div key={i} className="md:px-6 first:pl-0">
                <div className="font-heading text-2xl md:text-3xl font-bold text-orange">
                  {stat.value}
                </div>
                <div className="text-sm text-white/45 font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

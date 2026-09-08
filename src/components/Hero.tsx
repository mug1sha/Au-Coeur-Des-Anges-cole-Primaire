"use client";

import { motion } from "framer-motion";
import Container from "./Container";
import Button from "./Button";

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#032840] to-[#041e30]" />

      {/* Subtle decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg
          className="absolute -top-32 -right-32 w-[600px] h-[600px] opacity-[0.07]"
          viewBox="0 0 200 200"
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>

        <svg
          className="absolute top-1/3 -left-24 w-[400px] h-[400px] opacity-[0.05]"
          viewBox="0 0 200 200"
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>

        {/* Bottom wave */}
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
            <div className="max-w-xl">
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
                <Button href="#about" variant="primary" size="lg">
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
                <Button href="#contact" variant="secondary" size="lg">
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

                {/* Stats badges */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 right-8 px-4 py-2 bg-white rounded-[5px] shadow-lg shadow-navy/10"
                >
                  <span className="font-heading font-bold text-navy text-sm">280+</span>
                  <span className="text-navy/50 text-xs ml-1">élèves</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 -left-4 px-4 py-2 bg-white rounded-[5px] shadow-lg shadow-navy/10"
                >
                  <span className="font-heading font-bold text-orange text-sm">15</span>
                  <span className="text-navy/50 text-xs ml-1">ans</span>
                </motion.div>
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

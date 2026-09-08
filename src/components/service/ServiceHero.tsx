"use client";

import { motion } from "framer-motion";

export default function ServiceHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#032840] to-[#041e30]" />

      {/* Flowing organic shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <svg
          className="absolute -top-32 -right-32 w-[600px] h-[600px] opacity-15"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float 20s ease-in-out infinite" }}
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute top-1/3 -left-20 w-[400px] h-[400px] opacity-10"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float-reverse 24s ease-in-out infinite" }}
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>

        {/* Floating accent shapes */}
        <div
          className="absolute top-24 left-[12%] w-4 h-4 rounded-full bg-orange/25"
          style={{ animation: "float-up 6s ease-in-out infinite" }}
        />
        <div
          className="absolute top-[45%] right-[18%] w-3 h-3 rounded-full bg-blue/20"
          style={{ animation: "float-up 8s ease-in-out infinite 1.5s" }}
        />
        <div
          className="absolute bottom-[25%] left-[22%] w-5 h-5 rounded-full bg-white/8"
          style={{ animation: "float-up 7s ease-in-out infinite 0.8s" }}
        />

        {/* Bottom wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-24 opacity-8"
          viewBox="0 0 1440 96"
          preserveAspectRatio="none"
        >
          <path
            d="M0,48 C360,96 720,0 1080,48 C1260,72 1380,24 1440,48 L1440,96 L0,96 Z"
            fill="#0783BD"
            opacity="0.06"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-32 pb-20 lg:pt-40 lg:pb-24">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm font-heading font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-orange animate-pulse" aria-hidden="true" />
              Nos services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight text-balance"
          >
            Nos{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange">Services</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/20 -rotate-1 rounded-full" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-lg text-white/60 leading-relaxed max-w-2xl"
          >
            Au Coeur Des Anges met à disposition un environnement où les enfants
            apprennent, grandissent et découvrent leur potentiel. Nos services
            sont pensés pour accompagner chaque étape du développement de
            votre enfant avec expertise et bienveillance.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

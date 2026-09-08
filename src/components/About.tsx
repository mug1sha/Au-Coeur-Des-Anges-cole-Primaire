"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const values = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <path d="M24 12 L28 20 L36 21 L30 27 L31.5 35 L24 31 L16.5 35 L18 27 L12 21 L20 20 Z" fill="#0783BD" />
      </svg>
    ),
    title: "Excellence",
    description:
      "Nous visons l'excellence dans chaque aspect de l'éducation, en offrant un enseignement de qualité adapté au rythme de chaque enfant.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF7800" opacity="0.1" />
        <path d="M24 14C24 14 16 18 16 24C16 28.4 19.6 32 24 32C28.4 32 32 28.4 32 24C32 18 24 14 24 14Z" fill="#FF7800" />
        <circle cx="24" cy="24" r="4" fill="white" />
      </svg>
    ),
    title: "Bienveillance",
    description:
      "Un climat scolaire où chaque élève se sent en sécurité, écouté et encouragé à prendre des initiatives.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#023250" opacity="0.1" />
        <rect x="14" y="18" width="20" height="16" rx="2" fill="#023250" />
        <path d="M14 22H34" stroke="white" strokeWidth="1.5" />
        <circle cx="20" cy="28" r="2" fill="white" />
        <circle cx="28" cy="28" r="2" fill="white" />
      </svg>
    ),
    title: "Innovation",
    description:
      "Pédagogies actives et outils numériques au service d'un apprentissage engageant et des méthodes d'enseignement modernes.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <path d="M16 32 L24 16 L32 32 Z" fill="none" stroke="#0783BD" strokeWidth="2.5" />
        <circle cx="24" cy="28" r="2" fill="#0783BD" />
      </svg>
    ),
    title: "Ouverture",
    description:
      "Une éducation qui ouvre sur le monde, les langues, les cultures et la nature, préparant les enfants à devenir des citoyens du monde.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Decorative flowing shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 right-0 w-[500px] h-[500px] opacity-[0.04]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float 20s ease-in-out infinite" }}
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
          >
            About Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
          >
            Une école qui{" "}
            <span className="relative inline-block">
              <span className="relative z-10">inspire</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-lg text-navy/60 leading-relaxed"
          >
            Depuis plus de 15 ans, l&apos;École Primaire Au Coeur Des Anges forme les
            citoyens de demain dans un cadre stimulant et bienveillant. Notre
            approche place l&apos;enfant au cœur de son apprentissage.
          </motion.p>
        </div>

        {/* Values grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="group relative p-6 rounded-2xl bg-offwhite/50 hover:bg-offwhite transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="font-heading text-lg font-bold text-navy mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-navy/55 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom accent strip */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 lg:mt-20 h-1 w-full rounded-full bg-gradient-to-r from-navy via-blue to-orange origin-left"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

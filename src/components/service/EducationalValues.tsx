"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const values = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <path d="M24 12 L28 20 L36 21 L30 27 L31.5 35 L24 31 L16.5 35 L18 27 L12 21 L20 20 Z" fill="#FF6B35" />
      </svg>
    ),
    title: "Respect",
    description: "Chaque être est unique et digne de consideration.",
    color: "#FF6B35",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <rect x="14" y="14" width="20" height="20" rx="2" fill="#0783BD" opacity="0.8" />
        <path d="M18 28 L22 24 L26 28 L30 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Discipline",
    description: "L&apos;ordre et la rigueur comme fondements de la reussite.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <path d="M24 14 C24 14 16 18 16 24 C16 28.4 19.6 32 24 32 C28.4 32 32 28.4 32 24 C32 18 24 14 24 14Z" fill="#0B1B3D" opacity="0.7" />
        <circle cx="24" cy="24" r="3" fill="white" />
      </svg>
    ),
    title: "Bienveillance",
    description: "L&apos;ecoute, le soin et la douceur au quotidien.",
    color: "#0B1B3D",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="24" cy="20" r="6" fill="#FF6B35" opacity="0.3" />
        <path d="M18 28 C18 28 20 32 24 32 C28 32 30 28 30 28" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 14 L24 10 M30 16 L33 13 M18 16 L15 13" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Curiosite",
    description: "Le desire d&apos;apprendre comme moteur de l&apos;eveil.",
    color: "#FF6B35",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="24" cy="24" r="10" fill="#0783BD" opacity="0.15" />
        <path d="M20 24 L23 27 L29 21" stroke="#0783BD" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Responsabilite",
    description: "Apprendre a etre responsable de soi et des autres.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8" aria-hidden="true">
        <path d="M24 10 L27 18 L35 19 L29 25 L30.5 33 L24 29 L17.5 33 L19 25 L13 19 L21 18 Z" fill="#0B1B3D" opacity="0.7" />
        <circle cx="24" cy="22" r="3" fill="white" opacity="0.8" />
      </svg>
    ),
    title: "Excellence",
    description: "Viser le meilleur de soi en permanence.",
    color: "#0B1B3D",
  },
];

export default function EducationalValues() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20 lg:py-28 bg-navy overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 -right-20 w-[500px] h-[500px] opacity-[0.03]"
          viewBox="0 0 200 200"
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#FF6B35"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] opacity-[0.02]"
          viewBox="0 0 200 200"
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Container>
      <div ref={ref} className="relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Nos valeurs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance"
          >
            Les valeurs qui{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange">nous guident</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/25 -rotate-1 rounded-full" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-white/50 leading-relaxed"
          >
            Six piliers fondamentaux qui animent chaque action, chaque
            interaction et chaque décision au sein de notre école.
          </motion.p>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="group relative flex items-start gap-4 p-6 rounded-[16px] bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="flex-shrink-0 w-12 h-12 rounded-[12px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${value.color}15` }}
              >
                {value.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  {value.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </Container>
    </section>
  );
}

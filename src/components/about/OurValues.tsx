"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const values = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <path d="M24 12 L28 20 L36 21 L30 27 L31.5 35 L24 31 L16.5 35 L18 27 L12 21 L20 20 Z" fill="#FF7800" />
      </svg>
    ),
    title: "Respect",
    description: "Chaque être est unique et digne de consideration. Nous apprenons aux enfants a respecter eux-memes, les autres et leur environnement.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <path d="M24 14C24 14 16 18 16 24C16 28.4 19.6 32 24 32C28.4 32 32 28.4 32 24C32 18 24 14 24 14Z" fill="#0783BD" opacity="0.7" />
        <circle cx="24" cy="24" r="4" fill="white" />
      </svg>
    ),
    title: "Bienveillance",
    description: "L'ecoute, la douceur et le soin sont au coeur de chaque interaction. Un climat de confiance ou chaque enfant s'epanouit.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <path d="M24 10 L27 18 L35 19 L29 25 L30.5 33 L24 29 L17.5 33 L19 25 L13 19 L21 18 Z" fill="#FF7800" opacity="0.8" />
        <circle cx="24" cy="22" r="3" fill="white" opacity="0.8" />
      </svg>
    ),
    title: "Excellence",
    description: "Nous visons le meilleur de chaque enfant, avec des standards eleves et un accompagnement rigoureux mais bienveillant.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <circle cx="24" cy="24" r="10" fill="#023250" opacity="0.15" />
        <path d="M18 24 L22 28 L30 20" stroke="#023250" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Intégrité",
    description: "L'honnetete et la transparence guident nos actions. Nous enseignons la verite et la droiture comme fondements du vivre-ensemble.",
    color: "#023250",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <circle cx="18" cy="20" r="6" fill="#FF7800" opacity="0.3" />
        <circle cx="30" cy="20" r="6" fill="#0783BD" opacity="0.3" />
        <circle cx="24" cy="30" r="6" fill="#023250" opacity="0.3" />
      </svg>
    ),
    title: "Créativité",
    description: "L'imagination est le carburant de l'apprentissage. Arts, projets et jeux sont les vecteurs privilegies de l'eveil.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9" aria-hidden="true">
        <circle cx="24" cy="20" r="6" fill="#0783BD" opacity="0.7" />
        <path d="M14 36 C14 30 18 26 24 26 C30 26 34 30 34 36" fill="#0783BD" opacity="0.4" />
        <path d="M24 14 L24 10 M30 16 L33 13 M18 16 L15 13" stroke="#0783BD" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Responsabilité",
    description: "Apprendre a etre responsable de soi et des autres. Chaque geste, chaque choix a un impact sur le monde qui nous entoure.",
    color: "#0783BD",
  },
];

export default function OurValues() {
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
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Container className="relative z-10">
        <div ref={ref}>
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
            Les piliers de{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange">notre identité</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/25 -rotate-1 rounded-full" />
            </span>
          </motion.h2>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
              className="group relative p-6 rounded-[5px] bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-[5px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${value.color}15` }}
              >
                {value.icon}
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">
                {value.description}
              </p>

              {/* Hover accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: value.color }}
              />
            </motion.div>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}

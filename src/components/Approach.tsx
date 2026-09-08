"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <path d="M24 8 L28 16 L36 17 L30 23 L31.5 31 L24 27 L16.5 31 L18 23 L12 17 L20 16 Z" fill="#FF7800" />
      </svg>
    ),
    title: "Excellence académique",
    description:
      "Des standards élevés, un enseignement structuré et un accompagnement rigoureux pour que chaque élève atteigne son meilleur niveau.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <path d="M24 12C24 12 14 18 14 26C14 31.5 18.5 36 24 36C29.5 36 34 31.5 34 26C34 18 24 12 24 12Z" fill="#0783BD" />
        <circle cx="24" cy="26" r="4" fill="white" />
      </svg>
    ),
    title: "Épanouissement personnel",
    description:
      "L'estime de soi, la confiance et le bien-être sont au cœur de notre approche. Chaque enfant apprend à se connaître et à s'apprécier.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="20" r="6" fill="#023250" />
        <path d="M14 36 C14 30 18 26 24 26 C30 26 34 30 34 36" fill="#023250" opacity="0.5" />
        <circle cx="36" cy="18" r="4" fill="#0783BD" opacity="0.6" />
        <circle cx="12" cy="18" r="4" fill="#FF7800" opacity="0.6" />
      </svg>
    ),
    title: "Valeurs humaines",
    description:
      "Respect, tolérance, honnêteté et solidarité — des valeurs qui guident chaque interaction et construisent le caractère des enfants.",
    color: "#023250",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="20" r="8" fill="#FF7800" opacity="0.3" />
        <circle cx="28" cy="20" r="8" fill="#0783BD" opacity="0.3" />
        <circle cx="24" cy="28" r="8" fill="#023250" opacity="0.3" />
      </svg>
    ),
    title: "Créativité",
    description:
      "L'imagination est le carburant de l'apprentissage. Arts, projets, jeux — chaque moment est une occasion de créer et d'innover.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="16" cy="22" r="5" fill="#0783BD" opacity="0.7" />
        <circle cx="32" cy="22" r="5" fill="#0783BD" opacity="0.7" />
        <path d="M16 27 C16 27 20 32 24 32 C28 32 32 27 32 27" stroke="#0783BD" strokeWidth="2" fill="none" />
        <circle cx="24" cy="16" r="5" fill="#FF7800" opacity="0.6" />
      </svg>
    ),
    title: "Esprit de collaboration",
    description:
      "Travail d'équipe, projets collectifs et entraide — nous apprenons aux enfants que la réussite se construit ensemble.",
    color: "#0783BD",
  },
];

export default function Approach() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="approach" className="relative py-20 lg:py-28 bg-navy overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 -right-20 w-[500px] h-[500px] opacity-[0.04]"
          viewBox="0 0 200 200"
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] opacity-[0.03]"
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
        <div ref={ref}>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Notre approche
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance"
          >
            Cinq piliers pour{" "}
            <span className="relative inline-block">
              <span className="relative z-10">grandir</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/25 -rotate-1 rounded-full" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-white/50 leading-relaxed"
          >
            Notre pédagogie repose sur cinq piliers fondamentaux qui guident
            chaque aspect de la vie scolaire et du développement de l&apos;enfant.
          </motion.p>
        </div>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="group relative p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                {pillar.icon}
              </div>
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}

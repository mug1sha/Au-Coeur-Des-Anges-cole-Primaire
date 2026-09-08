"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <path d="M16 32 L16 20 L24 14 L32 20 L32 32 Z" fill="#0783BD" />
        <rect x="21" y="26" width="6" height="6" rx="1" fill="white" />
      </svg>
    ),
    title: "Enseignement primaire",
    description:
      "Un programme complet et structuré couvrant le français, les mathématiques, les sciences et les humanités, adapté au rythme de chaque enfant de la maternelle au CM2.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF7800" opacity="0.1" />
        <circle cx="24" cy="18" r="6" fill="#FF7800" />
        <path d="M14 36 C14 30 18 26 24 26 C30 26 34 30 34 36" fill="#FF7800" opacity="0.6" />
      </svg>
    ),
    title: "Accompagnement personnalisé",
    description:
      "Un suivi individualisé pour chaque élève, identifiant ses forces et ses axes de progrès. Des méthodes différenciées pour que chacun apprenne à son rythme.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#023250" opacity="0.1" />
        <circle cx="24" cy="24" r="8" fill="none" stroke="#023250" strokeWidth="2.5" />
        <path d="M24 16 L24 12 M24 36 L24 32 M16 24 L12 24 M36 24 L32 24" stroke="#023250" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Activités sportives",
    description:
      "Éducation physique, jeux collectifs, éveil sportif et compétitions inter-écoles. Le sport comme vecteur de santé, de discipline et de cohésion.",
    color: "#023250",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF7800" opacity="0.1" />
        <circle cx="20" cy="20" r="6" fill="#FF7800" opacity="0.4" />
        <circle cx="28" cy="20" r="6" fill="#0783BD" opacity="0.4" />
        <circle cx="24" cy="28" r="6" fill="#023250" opacity="0.4" />
      </svg>
    ),
    title: "Activités artistiques et créatives",
    description:
      "Arts plastiques, théâtre, musique, danse et expression corporelle. L&apos;art comme moyen d&apos;expression, de confiance en soi et d&apos;éveil culturel.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <circle cx="18" cy="22" r="5" fill="#0783BD" opacity="0.7" />
        <circle cx="30" cy="22" r="5" fill="#FF7800" opacity="0.7" />
        <path d="M18 27 C18 27 21 30 24 30 C27 30 30 27 30 27" stroke="#023250" strokeWidth="2" fill="none" />
      </svg>
    ),
    title: "Développement des compétences sociales",
    description:
      "Travail d&apos;équipe, gestion des émotions, résolution de conflits et communication. Les enfants apprennent à vivre ensemble dans le respect mutuel.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#023250" opacity="0.1" />
        <rect x="16" y="18" width="16" height="14" rx="2" fill="#023250" />
        <path d="M20 24 L24 28 L28 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Encadrement et sécurité",
    description:
      "Personnel qualifié, espaces sécurisés, protocoles de sécurité rigoureux. La sérénité des parents et la protection des enfants sont notre priorité absolue.",
    color: "#023250",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <circle cx="20" cy="20" r="5" fill="#0783BD" />
        <circle cx="28" cy="28" r="5" fill="#FF7800" />
        <path d="M24 16 L28 12 M24 32 L20 36" stroke="#023250" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Accompagnement des parents",
    description:
      "Réunions régulières, ateliers parents-enfants, communications quotidiennes et conseils pédagogiques. Un véritable partenariat éducatif.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF7800" opacity="0.1" />
        <rect x="14" y="14" width="20" height="20" rx="3" fill="#FF7800" opacity="0.15" />
        <path d="M18 28 L18 22 M22 28 L22 18 M26 28 L26 22 M30 28 L30 20" stroke="#FF7800" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Activités éducatives et culturelles",
    description:
      "Sorties scolaires, visites de musées, ateliers scientifiques, conférences et projets interdisciplinaires pour enrichir la culture générale des élèves.",
    color: "#FF7800",
  },
];

export default function ServicesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Decorative shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.03]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float 22s ease-in-out infinite" }}
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
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Ce que nous offrons
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
          >
            Un service{" "}
            <span className="relative inline-block">
              <span className="relative z-10">complet</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue/15 -rotate-1 rounded-full" />
            </span>{" "}
            pour chaque famille
          </motion.h2>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-6 rounded-2xl bg-offwhite/50 hover:bg-white transition-colors duration-300 card-hover"
            >
              {/* Icon */}
              <div className="mb-4 icon-spin-hover">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="font-heading text-base font-bold text-navy mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-navy/55 leading-relaxed">
                {service.description}
              </p>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
                style={{ backgroundColor: service.color, transitionTimingFunction: "var(--ease-out)" }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

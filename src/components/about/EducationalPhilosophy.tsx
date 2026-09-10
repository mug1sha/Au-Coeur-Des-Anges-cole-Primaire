"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <rect x="14" y="14" width="20" height="20" rx="3" fill="#0783BD" opacity="0.15" />
        <path d="M18 28 L18 22 M22 28 L22 18 M26 28 L26 22 M30 28 L30 20" stroke="#0783BD" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Apprentissage académique",
    description: "Des fondamentaux solides enseignés avec methode et patience, adaptés au rythme de chaque enfant pour une maitrise complete des savoirs.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF6B35" opacity="0.1" />
        <path d="M24 14C24 14 16 18 16 24C16 28.4 19.6 32 24 32C28.4 32 32 28.4 32 24C32 18 24 14 24 14Z" fill="#FF6B35" opacity="0.3" />
        <circle cx="24" cy="24" r="4" fill="#FF6B35" />
      </svg>
    ),
    title: "Développement émotionnel",
    description: "Identification et gestion des émotions, developpement de l'empathie et construction d'une estime de soi solide et realiste.",
    color: "#FF6B35",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#463ACB" opacity="0.1" />
        <circle cx="18" cy="20" r="5" fill="#FF6B35" opacity="0.4" />
        <circle cx="30" cy="20" r="5" fill="#0783BD" opacity="0.4" />
        <circle cx="24" cy="30" r="5" fill="#463ACB" opacity="0.4" />
      </svg>
    ),
    title: "Créativité & expression",
    description: "Arts, musique, theatre et projets — l'expression créative comme moyen d'apprendre differently et de developper l'imagination.",
    color: "#463ACB",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <circle cx="18" cy="22" r="5" fill="#0783BD" opacity="0.6" />
        <circle cx="30" cy="22" r="5" fill="#FF6B35" opacity="0.6" />
        <path d="M18 27 C18 27 21 30 24 30 C27 30 30 27 30 27" stroke="#463ACB" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    ),
    title: "Développement social",
    description: "Travail d'équipe, resolution de conflits et communication — les enfants apprennent a vivre ensemble dans le respect mutuel.",
    color: "#0783BD",
  },
];

export default function EducationalPhilosophy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20 lg:py-28 bg-offwhite overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] opacity-[0.015]"
          viewBox="0 0 200 200"
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>
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
            Notre philosophie
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
          >
            Un équilibre{" "}
            <span className="relative inline-block">
              <span className="relative z-10">complet</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue/15 -rotate-1 rounded-full" />
            </span>{" "}
            pour chaque enfant
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-navy/55 leading-relaxed"
          >
            Notre approche pédagogique repose sur quatre dimensions
            complémentaires qui se renforcent mutuellement pour le plein
            épanouissement de chaque élève.
          </motion.p>
        </div>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="group relative flex gap-5 p-6 rounded-[16px] bg-white transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {pillar.icon}
              </div>

              {/* Content */}
              <div>
                <h3 className="font-heading text-lg font-bold text-navy mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm text-navy/55 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Hover accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: pillar.color }}
              />
            </motion.div>
          ))}
        </div>

        {/* Balance diagram */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <div className="relative flex items-center gap-4 px-8 py-4 bg-white rounded-[16px] shadow-sm">
            <div className="text-center">
              <div className="w-10 h-10 rounded-[10px] bg-blue/10 flex items-center justify-center mx-auto mb-1">
                <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <span className="text-xs font-heading font-semibold text-navy/60">Savoirs</span>
            </div>

            <div className="w-6 h-px bg-lightgray" />

            <div className="text-center">
              <div className="w-10 h-10 rounded-[10px] bg-orange/10 flex items-center justify-center mx-auto mb-1">
                <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <span className="text-xs font-heading font-semibold text-navy/60">Émotions</span>
            </div>

            <div className="w-6 h-px bg-lightgray" />

            <div className="text-center">
              <div className="w-10 h-10 rounded-[10px] bg-navy/10 flex items-center justify-center mx-auto mb-1">
                <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <span className="text-xs font-heading font-semibold text-navy/60">Créativité</span>
            </div>

            <div className="w-6 h-px bg-lightgray" />

            <div className="text-center">
              <div className="w-10 h-10 rounded-[10px] bg-blue/10 flex items-center justify-center mx-auto mb-1">
                <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <span className="text-xs font-heading font-semibold text-navy/60">Social</span>
            </div>
          </div>
        </motion.div>
        </div>
      </Container>
    </section>
  );
}
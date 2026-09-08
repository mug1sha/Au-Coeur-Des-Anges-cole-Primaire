"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const features = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <path d="M24 12 L28 20 L36 21 L30 27 L31.5 35 L24 31 L16.5 35 L18 27 L12 21 L20 20 Z" fill="#0783BD" />
      </svg>
    ),
    title: "Éducation de qualité",
    description:
      "Un enseignement rigoureux et adapté au rythme de chaque enfant, dispensé par des enseignants passionnés et qualifiés.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF7800" opacity="0.1" />
        <path d="M24 14C24 14 16 18 16 24C16 28.4 19.6 32 24 32C28.4 32 32 28.4 32 24C32 18 24 14 24 14Z" fill="#FF7800" />
        <circle cx="24" cy="24" r="4" fill="white" />
      </svg>
    ),
    title: "Accompagnement personnalisé",
    description:
      "Un suivi individualisé qui identifie les forces et les axes de progrès de chaque élève pour l&apos;aider à s&apos;épanouir pleinement.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#023250" opacity="0.1" />
        <rect x="14" y="18" width="20" height="16" rx="2" fill="#023250" />
        <path d="M14 22H34" stroke="white" strokeWidth="1.5" />
        <circle cx="20" cy="28" r="2" fill="white" />
        <circle cx="28" cy="28" r="2" fill="white" />
      </svg>
    ),
    title: "Activités créatives",
    description:
      "Arts, musique, théâtre et sciences — des ateliers variés qui stimulent l&apos;imagination et révèlent les talents cachés de chaque enfant.",
    color: "#023250",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#0783BD" opacity="0.1" />
        <path d="M16 32 L24 16 L32 32 Z" fill="none" stroke="#0783BD" strokeWidth="2.5" />
        <circle cx="24" cy="28" r="2" fill="#0783BD" />
      </svg>
    ),
    title: "Environnement sécurisé",
    description:
      "Un cadre protégé et chaleureux où les enfants se sentent en confiance pour apprendre, explorer et grandir sereinement.",
    color: "#0783BD",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF7800" opacity="0.1" />
        <circle cx="24" cy="20" r="6" fill="#FF7800" />
        <path d="M14 36 C14 30 18 26 24 26 C30 26 34 30 34 36" fill="#FF7800" opacity="0.6" />
      </svg>
    ),
    title: "Développement des talents",
    description:
      "Chaque enfant est encouragé à découvrir et cultiver ses passions à travers un programme riche et diversifié.",
    color: "#FF7800",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#023250" opacity="0.1" />
        <circle cx="18" cy="22" r="5" fill="#023250" opacity="0.7" />
        <circle cx="30" cy="22" r="5" fill="#0783BD" opacity="0.7" />
        <path d="M12 36 C12 31 15 28 18 28 C20 28 22 29 24 31 C26 29 28 28 30 28 C33 28 36 31 36 36" fill="#023250" opacity="0.3" />
      </svg>
    ),
    title: "Collaboration avec les parents",
    description:
      "Un partenariat actif avec les familles pour assurer la cohérence entre l&apos;école et la maison au bénéfice de l&apos;enfant.",
    color: "#023250",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-20 lg:py-28 px-6 sm:px-8 lg:px-12 bg-offwhite overflow-hidden">
      {/* Decorative shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] opacity-[0.02]"
          viewBox="0 0 200 200"
          style={{ animation: "none" }}
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
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
            Nos services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
          >
            Tout pour{" "}
            <span className="relative inline-block">
              <span className="relative z-10">épanouir</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue/15 -rotate-1 rounded-full" />
            </span>{" "}
            votre enfant
          </motion.h2>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="group relative p-7 rounded-[5px] bg-white transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="mb-5 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg font-bold text-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-navy/55 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover accent line */}
              <div
                className="absolute bottom-0 left-7 right-7 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: feature.color }}
              />
            </motion.article>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const steps = [
  {
    number: "01",
    title: "Découvrir",
    description: "L'enfant explore, observe et s'éveille au monde qui l'entoure dans un cadre stimulant.",
    color: "#FF6B35",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="20" cy="20" r="8" fill="#FF6B35" opacity="0.2" />
        <circle cx="20" cy="20" r="4" fill="#FF6B35" />
        <path d="M20 8 L20 12 M20 28 L20 32 M8 20 L12 20 M28 20 L32 20" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Apprendre",
    description: "Les fondamentaux sont transmis avec rigueur et bienveillance, au rythme de chacun.",
    color: "#0783BD",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden="true">
        <rect x="10" y="12" width="20" height="16" rx="2" fill="#0783BD" opacity="0.2" />
        <path d="M14 18 L20 14 L26 18" stroke="#0783BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 22 L20 18 L26 22" stroke="#0783BD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Pratiquer",
    description: "Mise en situation, exercices concrets et projets pour ancrer les apprentissages dans la réalité.",
    color: "#0B1B3D",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="20" cy="20" r="10" fill="#0B1B3D" opacity="0.15" />
        <path d="M16 20 L19 23 L25 17" stroke="#0B1B3D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Grandir",
    description: "Chaque enfant progresse, gagne en confiance et développe son autonomie pas à pas.",
    color: "#0783BD",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden="true">
        <path d="M20 32 L20 16" stroke="#0783BD" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 22 L20 16 L26 22" stroke="#0783BD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="14" r="3" fill="#0783BD" opacity="0.3" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "S'épanouir",
    description: "L'enfant révèle son potentiel unique, équilibré et heureux, prêt pour la suite.",
    color: "#FF6B35",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8" aria-hidden="true">
        <path d="M20 10 C20 10 12 16 12 22 C12 26.4 15.6 30 20 30 C24.4 30 28 26.4 28 22 C28 16 20 10 20 10Z" fill="#FF6B35" opacity="0.2" />
        <path d="M20 14 C20 14 15 18 15 22 C15 24.8 17.2 27 20 27 C22.8 27 25 24.8 25 22 C25 18 20 14 20 14Z" fill="#FF6B35" opacity="0.5" />
      </svg>
    ),
  },
];

export default function HowWeSupport() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20 lg:py-28 bg-offwhite overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] opacity-[0.02]"
          viewBox="0 0 200 200"
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>
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
            Notre démarche
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
          >
            Comment nous{" "}
            <span className="relative inline-block">
              <span className="relative z-10">accompagnons</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/10 -rotate-1 rounded-full" />
            </span>{" "}
            les enfants
          </motion.h2>
        </div>

        {/* Steps - responsive: horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px]" aria-hidden="true">
            <div className="w-full h-full bg-gradient-to-r from-orange via-blue to-orange opacity-20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className="relative mb-5">
                  <div
                    className="w-18 h-18 rounded-full flex items-center justify-center bg-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
                    style={{ boxShadow: `0 4px 20px ${step.color}15` }}
                  >
                    {step.icon}
                  </div>
                  {/* Number badge */}
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-heading font-bold text-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Arrow - desktop only, between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[2.25rem] text-lightgray" style={{ left: `${(i + 1) * 20 - 2}%` }} aria-hidden="true">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <h3 className="font-heading text-lg font-bold mb-1.5" style={{ color: step.color }}>
                  {step.title}
                </h3>
                <p className="text-sm text-navy/50 leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </Container>
    </section>
  );
}

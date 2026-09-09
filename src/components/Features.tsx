"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const features = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF6B35" opacity="0.1" />
        <path d="M24 12L28 20L36 21L30 27L31.5 35L24 31L16.5 35L18 27L12 21L20 20Z" fill="#FF6B35" />
      </svg>
    ),
    title: "Sécurité & Confort",
    description: "Un cadre protégé et chaleureux où les enfants se sentent en confiance pour apprendre et grandir sereinement.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF6B35" opacity="0.1" />
        <circle cx="24" cy="20" r="6" fill="#FF6B35" />
        <path d="M14 36C14 30 18 26 24 26C30 26 34 30 34 36" fill="#FF6B35" opacity="0.6" />
      </svg>
    ),
    title: "Éveil & Créativité",
    description: "Arts, musique, théâtre et sciences — des ateliers variés qui stimulent l'imagination et révèlent les talents de chaque enfant.",
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="#FF6B35" opacity="0.1" />
        <path d="M24 14C24 14 16 18 16 24C16 28.4 19.6 32 24 32C28.4 32 32 28.4 32 24C32 18 24 14 24 14Z" fill="#FF6B35" />
        <circle cx="24" cy="24" r="4" fill="white" />
      </svg>
    ),
    title: "Nutrition Équilibrée",
    description: "Des repas sains et équilibrés préparés avec soin pour assurer le bien-être et l'énergie de chaque enfant au quotidien.",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <Container>
        <div ref={ref}>
          {/* Feature grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="group p-7 rounded-[16px] bg-white border border-navy/[0.06] shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-5 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="font-heading text-lg font-bold text-navy mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-navy/50 leading-relaxed">
                  {feature.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

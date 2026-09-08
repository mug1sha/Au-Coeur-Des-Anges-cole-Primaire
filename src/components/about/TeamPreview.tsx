"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const team = [
  {
    name: "Mme Fatou Diallo",
    role: "Directrice",
    description: "Passionnée par l'éducation depuis plus de 20 ans, elle guide la vision pédagogique de l'école avec bienveillance et exigence.",
    initials: "FD",
    color: "#FF7800",
  },
  {
    name: "M. Amadou Bamba",
    role: "Enseignant Principal — CP",
    description: "Spécialisé dans l'apprentissage précoce, il transforme chaque leçon en moment de découverte et de joie pour ses élèves.",
    initials: "AB",
    color: "#0783BD",
  },
  {
    name: "Mme Aïssatou Ndiaye",
    role: "Enseignante — CE1/CE2",
    description: "Animée par la créativité, elle intègre les arts et les projets dans son enseignement pour stimuler la curiosité naturelle.",
    initials: "AN",
    color: "#023250",
  },
  {
    name: "M. Ibrahim Konaté",
    role: "Enseignant — CM1/CM2",
    description: "Rigoureux et bienveillant, il prépare ses élèves aux défis du collège tout en cultivant leur esprit critique.",
    initials: "IK",
    color: "#FF7800",
  },
  {
    name: "Mme Mariama Touré",
    role: "Éducatrice — Maternelle",
    description: "Douce et patiente, elle crée un cocon de sécurité où les tout-petits font leurs premiers pas dans l'apprentissage.",
    initials: "MT",
    color: "#0783BD",
  },
  {
    name: "M. Ousmane Sy",
    role: "Coordinateur des activités",
    description: "Il orchestre les activités extrascolaires, du sport à la musique, pour révéler les talents cachés de chaque enfant.",
    initials: "OS",
    color: "#023250",
  },
];

export default function TeamPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Decorative shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 -left-20 w-[350px] h-[350px] opacity-[0.015]"
          viewBox="0 0 200 200"
        >
          <path
            d="M44.4,-65.2C57.6,-58.8,68.8,-47.6,75.2,-34.2C81.6,-20.8,83.2,-5.2,79.2,8.8C75.2,22.8,65.6,36.2,54.4,46.4C43.2,56.6,30.4,63.6,16.4,68.8C2.4,74,-12.8,77.4,-27.2,74.2C-41.6,71,-55.2,61.2,-64,48C-72.8,34.8,-76.8,18.2,-76.4,1.8C-76,-14.6,-71.2,-30.8,-62,-43.2C-52.8,-55.6,-39.2,-64.2,-25.2,-70C-11.2,-75.8,3.2,-78.8,17.2,-76.8C31.2,-74.8,31.2,-71.6,44.4,-65.2Z"
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
            Notre équipe
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
          >
            Des éducateurs{" "}
            <span className="relative inline-block">
              <span className="relative z-10">passionnés</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-navy/55 leading-relaxed"
          >
            Une équipe dévouée, qualifiée et passionnée qui met tout en
            oeuvre pour le bien-être et l&apos;épanouissement de chaque enfant.
          </motion.p>
        </div>

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
              className="group relative p-6 rounded-2xl bg-offwhite/50 hover:bg-offwhite transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              {/* Avatar placeholder */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${member.color}15` }}
                >
                  <span
                    className="font-heading font-bold text-lg"
                    style={{ color: member.color }}
                  >
                    {member.initials}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-navy">
                    {member.name}
                  </h3>
                  <span
                    className="text-xs font-heading font-semibold"
                    style={{ color: member.color }}
                  >
                    {member.role}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-navy/55 leading-relaxed">
                {member.description}
              </p>

              {/* Hover accent */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: member.color }}
              />
            </motion.div>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}

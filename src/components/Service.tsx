"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const services = [
  {
    cycle: "Maternelle",
    age: "3-6 ans",
    color: "#FF7800",
    description:
      "Éveil, découverte sensoriel et premières interactions sociales dans un cadre ludique et sécurisant. Développement du langage et de l'autonomie.",
    highlights: ["Jeu libre", "Éveil artistique", "Langage", "Motricité"],
  },
  {
    cycle: "Cycles des Fondamentaux",
    age: "6-9 ans",
    color: "#0783BD",
    description:
      "Consolidation des apprentissages fondamentaux : lecture, écriture, numération. Développement de la curiosité et de l'esprit d'observation.",
    highlights: ["Français", "Mathématiques", "Découverte du monde", "Anglais"],
  },
  {
    cycle: "Cycles Intermédiaires",
    age: "9-11 ans",
    color: "#023250",
    description:
      "Approfondissement des connaissances et préparation au collège. Esprit critique, projets collectifs et autonomie renforcée.",
    highlights: ["Projet interdisciplinaire", "Vie démocratique", "Anglais renforcé", "Sciences"],
  },
  {
    cycle: "Activités Extrascolaires",
    age: "Tous âges",
    color: "#0783BD",
    description:
      "Ateliers créatifs, sport, musique et sorties culturelles pour éveiller les passions et révéler les talents de chacun après les cours.",
    highlights: ["Arts", "Sport", "Musique", "Théâtre"],
  },
];

export default function Service() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="service"
      className="relative py-20 lg:py-28 bg-offwhite overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-[0.02]"
          viewBox="0 0 200 200"
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#023250"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <Container>
        <div ref={ref}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 lg:mb-20">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Service
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
            >
              Un accompagnement{" "}
              <span className="relative inline-block">
                <span className="relative z-10">complet</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue/15 -rotate-1 rounded-full" />
              </span>{" "}
              à chaque étape
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 lg:mt-0 max-w-md text-navy/55 leading-relaxed"
          >
            De la maternelle au CM2, nos services accompagnent chaque enfant
            dans un cheminement éducatif cohérent et stimulant.
          </motion.p>
        </div>

        {/* Service cards */}
        <div className="space-y-5">
          {services.map((service, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Color accent */}
                <div
                  className="w-full lg:w-2 h-2 lg:h-auto transition-all duration-300 group-hover:w-3"
                  style={{ backgroundColor: service.color }}
                />

                <div className="flex-1 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  {/* Left: info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className="font-heading text-xl lg:text-2xl font-bold"
                        style={{ color: service.color }}
                      >
                        {service.cycle}
                      </h3>
                      <span className="px-3 py-0.5 rounded-full bg-offwhite text-xs font-heading font-semibold text-navy/60">
                        {service.age}
                      </span>
                    </div>
                    <p className="text-navy/55 text-sm leading-relaxed max-w-xl">
                      {service.description}
                    </p>
                  </div>

                  {/* Right: highlights */}
                  <div className="flex flex-wrap gap-2">
                    {service.highlights.map((h, j) => (
                      <span
                        key={j}
                        className="px-4 py-1.5 rounded-full text-xs font-heading font-semibold border transition-colors duration-200"
                        style={{
                          borderColor: `${service.color}30`,
                          color: service.color,
                          backgroundColor: `${service.color}08`,
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const levels = [
  {
    cycle: "Petite Section",
    age: "3-4 ans",
    color: "#FF7800",
    description:
      "Découverte, éveil sensoriel et premières interactions sociales dans un cadre ludique et sécurisant.",
    highlights: ["Jeu libre", "Éveil artistique", "Langage"],
  },
  {
    cycle: "Moyenne & Grande Section",
    age: "4-6 ans",
    color: "#0783BD",
    description:
      "Construction des apprentissages fondamentaux : lecture, écriture, numération, par le jeu et l'exploration.",
    highlights: ["Lecture", "Écriture", "Découverte du monde"],
  },
  {
    cycle: "CP – CE2",
    age: "6-9 ans",
    color: "#023250",
    description:
      "Consolidation des fondamentaux et développement de l'autonomie. Apprentissages structurés et creatifs.",
    highlights: ["Français", "Mathématiques", "EN physically"],
  },
  {
    cycle: "CM1 – CM2",
    age: "9-11 ans",
    color: "#0783BD",
    description:
      "Approfondissement des connaissances et préparation au collège. Esprit critique et projets collectifs.",
    highlights: ["Projet interdisciplinaire", "Vie démocratique", "Anglais renforcé"],
  },
];

export default function Programs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="pedagogie"
      className="relative py-24 lg:py-32 bg-offwhite overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-[0.03]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float-reverse 25s ease-in-out infinite" }}
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#023250"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 lg:mb-20">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Pédagogie
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
            >
              Un parcours{" "}
              <span className="relative inline-block">
                <span className="relative z-10">adapté</span>
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
            De la maternelle au CM2, notre programme accompagne chaque enfant
            dans un cheminement éducatif cohérent et stimulant.
          </motion.p>
        </div>

        {/* Programs */}
        <div className="space-y-4">
          {levels.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-navy/5 transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Color accent */}
                <div
                  className="w-full lg:w-2 h-2 lg:h-auto transition-all duration-500 group-hover:w-3"
                  style={{ backgroundColor: level.color }}
                />

                <div className="flex-1 p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
                  {/* Left: info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className="font-heading text-xl lg:text-2xl font-bold"
                        style={{ color: level.color }}
                      >
                        {level.cycle}
                      </h3>
                      <span className="px-3 py-0.5 rounded-full bg-offwhite text-xs font-heading font-semibold text-navy/60">
                        {level.age}
                      </span>
                    </div>
                    <p className="text-navy/55 text-sm leading-relaxed max-w-xl">
                      {level.description}
                    </p>
                  </div>

                  {/* Right: highlights */}
                  <div className="flex flex-wrap gap-2">
                    {level.highlights.map((h, j) => (
                      <span
                        key={j}
                        className="px-4 py-1.5 rounded-full text-xs font-heading font-semibold border transition-colors duration-300"
                        style={{
                          borderColor: `${level.color}30`,
                          color: level.color,
                          backgroundColor: `${level.color}08`,
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

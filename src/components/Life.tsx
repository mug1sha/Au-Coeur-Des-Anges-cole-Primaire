"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const activities = [
  {
    title: "Atelier Créatif",
    description:
      "Arts plastiques, théâtre, musique et éveil artistique pour stimuler l'expression et l'imagination.",
    tag: "Arts",
    color: "#FF7800",
  },
  {
    title: "Éducation Physique",
    description:
      "Sports, jeux collectifs et épanouissement physique dans le respect du corps et des autres.",
    tag: "Sport",
    color: "#0783BD",
  },
  {
    title: "Découverte Scientifique",
    description:
      "Expériences, observation de la nature et initiations aux sciences dans le laboratoire scolaire.",
    tag: "Sciences",
    color: "#023250",
  },
  {
    title: "Sorties Culturelles",
    description:
      "Musées, théâtre, bibliothèques et voyages scolaires pour enrichir la culture générale des élèves.",
    tag: "Culture",
    color: "#FF7800",
  },
];

export default function Life() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="vie"
      className="relative py-24 lg:py-32 bg-navy overflow-hidden"
    >
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 -right-20 w-[500px] h-[500px] opacity-[0.08]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float 20s ease-in-out infinite" }}
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-[0.05]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float-reverse 18s ease-in-out infinite" }}
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Vie Scolaire
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance"
          >
            S&apos;épanouir en dehors{" "}
            <span className="relative inline-block">
              <span className="relative z-10">des cours</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/25 -rotate-1 rounded-full" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-lg text-white/55 leading-relaxed"
          >
            Au-delà des enseignements fondamentaux, nous offrons une vie
            scolaire riche et diversifiée pour éveiller les passions et
            révéler les talents de chacun.
          </motion.p>
        </div>

        {/* Activities grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {activities.map((activity, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="group relative p-6 lg:p-8 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-heading font-semibold"
                  style={{
                    backgroundColor: `${activity.color}20`,
                    color: activity.color,
                  }}
                >
                  {activity.tag}
                </span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${activity.color}15` }}
                  aria-hidden="true"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activity.color }}
                  />
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                {activity.title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">
                {activity.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const reasons = [
  {
    number: "01",
    title: "Un cadre d'exception",
    description:
      "Des espaces lumineux et pensés pour l'apprentissage, des salles de classe modernes et un jardin arboré où les enfants s'épanouissent chaque jour.",
    color: "#0783BD",
  },
  {
    number: "02",
    title: "Des enseignants passionnés",
    description:
      "Notre équipe pédagogique allie expertise, créativité et bienveillance pour offrir un enseignement de qualité à la hauteur de chaque enfant.",
    color: "#FF7800",
  },
  {
    number: "03",
    title: "Une vision holistique",
    description:
      "Nous cultivons l'esprit, le cœur et le corps. Chaque projet intègre dimensions intellectuelle, sociale, artistique et physique.",
    color: "#023250",
  },
  {
    number: "04",
    title: "Des résultats concrets",
    description:
      "Nos élèves sortent de l'école primaire avec des bases solides, confiance en eux et une curiosité intacte pour le monde qui les entoure.",
    color: "#0783BD",
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute top-0 -left-20 w-[350px] h-[350px] opacity-[0.03]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float 20s ease-in-out infinite" }}
        >
          <path
            d="M44.4,-65.2C57.6,-58.8,68.8,-47.6,75.2,-34.2C81.6,-20.8,83.2,-5.2,79.2,8.8C75.2,22.8,65.6,36.2,54.4,46.4C43.2,56.6,30.4,63.6,16.4,68.8C2.4,74,-12.8,77.4,-27.2,74.2C-41.6,71,-55.2,61.2,-64,48C-72.8,34.8,-76.8,18.2,-76.4,1.8C-76,-14.6,-71.2,-30.8,-62,-43.2C-52.8,-55.6,-39.2,-64.2,-25.2,-70C-11.2,-75.8,3.2,-78.8,17.2,-76.8C31.2,-74.8,31.2,-71.6,44.4,-65.2Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* Left: Sticky header */}
          <div className="lg:sticky lg:top-32">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Pourquoi nous choisir
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
            >
              Les familles nous font{" "}
              <span className="relative inline-block">
                <span className="relative z-10">confiance</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 text-navy/55 leading-relaxed max-w-md"
            >
              Depuis plus de 15 ans, nous construisons avec les familles un
              partenariat éducatif fondé sur la transparence, l&apos;écoute et
              l&apos;engagement mutuel.
            </motion.p>
          </div>

          {/* Right: Reasons list */}
          <div className="space-y-6">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="group relative flex gap-5 p-6 rounded-2xl bg-offwhite/60 hover:bg-offwhite transition-all duration-300"
              >
                {/* Number */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg transition-colors duration-300"
                  style={{
                    backgroundColor: `${reason.color}10`,
                    color: reason.color,
                  }}
                >
                  {reason.number}
                </div>

                {/* Content */}
                <div>
                  <h3
                    className="font-heading text-lg font-bold mb-1.5"
                    style={{ color: reason.color }}
                  >
                    {reason.title}
                  </h3>
                  <p className="text-sm text-navy/55 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

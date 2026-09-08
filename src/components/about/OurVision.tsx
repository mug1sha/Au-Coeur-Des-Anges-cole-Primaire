"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

export default function OurVision() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute top-0 -left-20 w-[350px] h-[350px] opacity-[0.015]"
          viewBox="0 0 200 200"
        >
          <path
            d="M44.4,-65.2C57.6,-58.8,68.8,-47.6,75.2,-34.2C81.6,-20.8,83.2,-5.2,79.2,8.8C75.2,22.8,65.6,36.2,54.4,46.4C43.2,56.6,30.4,63.6,16.4,68.8C2.4,74,-12.8,77.4,-27.2,74.2C-41.6,71,-55.2,61.2,-64,48C-72.8,34.8,-76.8,18.2,-76.4,1.8C-76,-14.6,-71.2,-30.8,-62,-43.2C-52.8,-55.6,-39.2,-64.2,-25.2,-70C-11.2,-75.8,3.2,-78.8,17.2,-76.8C31.2,-74.8,31.2,-71.6,44.4,-65.2Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <Container className="relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Notre vision
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl font-bold text-navy leading-tight text-balance"
            >
              Des enfants{" "}
              <span className="relative inline-block">
                <span className="relative z-10">confiants</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue/15 -rotate-1 rounded-full" />
              </span>
              ,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">responsables</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
              </span>{" "}
              et curieux
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 space-y-4"
            >
              <p className="text-navy/60 leading-relaxed">
                Notre vision est de former des enfants qui possèdent non seulement
                des connaissances solides, mais aussi la confiance en eux pour
                affronter les défis de demain. Nous voulons que chaque élève
                quitte notre école avec une curiosité intacte et la conviction
                qu&apos;il peut tout apprendre.
              </p>
              <p className="text-navy/60 leading-relaxed">
                Nous aspirons à créer des individus responsables, capables de
                pensée critique, empathiques envers les autres et engagés dans
                la construction d&apos;un monde meilleur. L&apos;éducation que nous
                offrons dépasse les murs de l&apos;école — elle prépare des
                citoyens du monde.
              </p>
            </motion.div>
          </div>

          {/* Right: Visual block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-navy via-[#032840] to-[#041e30] overflow-hidden">
              {/* Abstract visual */}
              <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
                {/* Background blobs */}
                <circle cx="300" cy="80" r="60" fill="#0783BD" opacity="0.08" />
                <circle cx="100" cy="220" r="50" fill="#FF7800" opacity="0.06" />

                {/* Abstract child figures */}
                <circle cx="200" cy="100" r="20" fill="#FF7800" opacity="0.3" />
                <circle cx="160" cy="130" r="15" fill="#0783BD" opacity="0.25" />
                <circle cx="240" cy="130" r="15" fill="#0783BD" opacity="0.25" />

                {/* Growth arrow */}
                <path d="M200,180 L200,80" stroke="#FFFFFF" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
                <path d="M190,90 L200,70 L210,90" stroke="#FFFFFF" strokeWidth="2" opacity="0.15" strokeLinecap="round" strokeLinejoin="round" />

                {/* Stars */}
                <path d="M80,60 L82,66 L88,66 L83,70 L85,76 L80,72 L75,76 L77,70 L72,66 L78,66 Z" fill="#FF7800" opacity="0.3" />
                <path d="M320,180 L322,186 L328,186 L323,190 L325,196 L320,192 L315,196 L317,190 L312,186 L318,186 Z" fill="#0783BD" opacity="0.3" />
                <path d="M340,80 L341,83 L344,83 L342,85 L343,88 L340,86 L337,88 L338,85 L336,83 L339,83 Z" fill="#FFFFFF" opacity="0.2" />

                {/* Circular rings */}
                <circle cx="200" cy="150" r="80" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.08" />
                <circle cx="200" cy="150" r="110" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.05" />
              </svg>

              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <span className="font-heading font-bold text-white text-sm">Notre vision</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

export default function Introduction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="introduction" className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Decorative shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.02]"
          viewBox="0 0 200 200"
          style={{ animation: "none" }}
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div ref={ref}>
        <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-offwhite to-lightgray overflow-hidden">
              {/* Abstract school illustration */}
              <svg viewBox="0 0 400 300" className="w-full h-full" aria-hidden="true">
                {/* Background pattern */}
                <defs>
                  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#023250" opacity="0.06" />
                  </pattern>
                </defs>
                <rect width="400" height="300" fill="url(#dots)" />

                {/* School building abstract */}
                <rect x="120" y="100" width="160" height="120" rx="4" fill="#023250" opacity="0.08" />
                <rect x="130" y="110" width="140" height="100" rx="3" fill="#0783BD" opacity="0.06" />

                {/* Roof */}
                <path d="M110,105 L200,55 L290,105 Z" fill="#FF7800" opacity="0.12" />

                {/* Windows */}
                <rect x="150" y="130" width="25" height="25" rx="2" fill="#FFFFFF" opacity="0.4" />
                <rect x="187" y="130" width="25" height="25" rx="2" fill="#FFFFFF" opacity="0.4" />
                <rect x="225" y="130" width="25" height="25" rx="2" fill="#FFFFFF" opacity="0.4" />
                <rect x="150" y="165" width="25" height="25" rx="2" fill="#FFFFFF" opacity="0.3" />
                <rect x="187" y="165" width="25" height="25" rx="2" fill="#FFFFFF" opacity="0.3" />
                <rect x="225" y="165" width="25" height="25" rx="2" fill="#FFFFFF" opacity="0.3" />

                {/* Door */}
                <rect x="185" y="195" width="30" height="25" rx="2" fill="#FF7800" opacity="0.2" />

                {/* Trees */}
                <circle cx="80" cy="180" r="25" fill="#0783BD" opacity="0.1" />
                <rect x="77" y="195" width="6" height="25" rx="2" fill="#023250" opacity="0.08" />
                <circle cx="320" cy="175" r="30" fill="#0783BD" opacity="0.08" />
                <rect x="317" y="195" width="6" height="30" rx="2" fill="#023250" opacity="0.06" />

                {/* Children silhouettes */}
                <circle cx="100" cy="230" r="8" fill="#FF7800" opacity="0.15" />
                <circle cx="100" cy="245" r="5" fill="#FF7800" opacity="0.1" />
                <circle cx="300" cy="228" r="9" fill="#0783BD" opacity="0.12" />
                <circle cx="300" cy="245" r="5.5" fill="#0783BD" opacity="0.08" />

                {/* Sun */}
                <circle cx="340" cy="50" r="20" fill="#FF7800" opacity="0.1" />
                <circle cx="340" cy="50" r="12" fill="#FF7800" opacity="0.15" />
              </svg>

              {/* Floating accent */}
              <div className="absolute top-4 right-4 w-16 h-16 rounded-2xl bg-orange/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Notre histoire
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl font-bold text-navy leading-tight text-balance"
            >
              Une école fondée sur la{" "}
              <span className="relative inline-block">
                <span className="relative z-10">confiance</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
              </span>{" "}
              et l&apos;excellence
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 space-y-4"
            >
              <p className="text-navy/60 leading-relaxed">
                Au Coeur Des Anges est une école primaire qui place l&apos;enfant
                au centre de son projet éducatif. Depuis notre création, nous
                cultivons un environnement où la bienveillance, la rigueur et la
                créativité se rejoignent pour éveiller les potentiels de chacun.
              </p>
              <p className="text-navy/60 leading-relaxed">
                Notre philosophie repose sur la conviction que chaque enfant
                possède un talent unique. Notre rôle est de le révéler, de le
                nourrir et de l&apos;accompagner avec passion et expertise. Les parents
                nous font confiance parce que nous traitons chaque élève comme
                notre propre enfant.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex items-center gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center" aria-hidden="true">
                  <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-heading font-semibold text-navy">Certifiée &amp; accréditée</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center" aria-hidden="true">
                  <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-sm font-heading font-semibold text-navy">Équipe dévouée</span>
              </div>
            </motion.div>
          </div>
        </div>
        </Container>
      </div>
    </section>
  );
}

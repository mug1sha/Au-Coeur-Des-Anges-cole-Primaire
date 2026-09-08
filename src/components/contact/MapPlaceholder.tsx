"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

export default function MapPlaceholder() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <div ref={ref} className="relative z-10">
        <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Localisation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
          >
            Nous{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange">trouver</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
            </span>
          </motion.h2>
        </div>

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative rounded-[5px] overflow-hidden bg-offwhite border border-lightgray"
        >
          <div className="aspect-[16/7] flex flex-col items-center justify-center p-8 text-center">
            {/* Map icon */}
            <div className="w-20 h-20 rounded-[5px] bg-navy/5 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-navy/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>

            <h3 className="font-heading text-xl font-bold text-navy mb-2">
              Carte interactive
            </h3>
            <p className="text-sm text-navy/50 max-w-md leading-relaxed mb-6">
              Intégrez ici Google Maps, OpenStreetMap ou tout autre service de
              cartographie pour afficher l&apos;emplacement exact de l&apos;école.
            </p>

            {/* Decorative grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.015]" aria-hidden="true">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="map-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#023250" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#map-grid)" />
              </svg>
            </div>

            {/* Pin markers (decorative) */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-orange/20" aria-hidden="true" />
            <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-blue/20" aria-hidden="true" />
            <div className="absolute bottom-1/3 left-1/2 w-4 h-4 rounded-full bg-navy/10" aria-hidden="true" />
          </div>
        </motion.div>
        </Container>
      </div>
    </section>
  );
}

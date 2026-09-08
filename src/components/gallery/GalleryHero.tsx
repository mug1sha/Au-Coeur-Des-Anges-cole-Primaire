"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

export default function GalleryHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="relative py-32 lg:py-40 bg-navy overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-24 -right-24 w-[450px] h-[450px] opacity-[0.07]"
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
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] opacity-[0.05]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float-reverse 24s ease-in-out infinite" }}
        >
          <path
            d="M44.4,-65.2C57.6,-58.8,68.8,-47.6,75.2,-34.2C81.6,-20.8,83.2,-5.2,79.2,8.8C75.2,22.8,65.6,36.2,54.4,46.4C43.2,56.6,30.4,63.6,16.4,68.8C2.4,74,-12.8,77.4,-27.2,74.2C-41.6,71,-55.2,61.2,-64,48C-72.8,34.8,-76.8,18.2,-76.4,1.8C-76,-14.6,-71.2,-30.8,-62,-43.2C-52.8,-55.6,-39.2,-64.2,-25.2,-70C-11.2,-75.8,3.2,-78.8,17.2,-76.8C31.2,-74.8,31.2,-71.6,44.4,-65.2Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 text-center">
        <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm font-heading font-medium mb-8"
          >
            <svg className="w-4 h-4 text-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Nos moments
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance"
          >
            Notre{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange">Galerie</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/25 -rotate-1 rounded-full" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Découvrez quelques moments de vie à Au Coeur Des Anges.
          </motion.p>
        </motion.div>
        </Container>
      </div>
    </section>
  );
}

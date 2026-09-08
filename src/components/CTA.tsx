"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 lg:py-28 bg-navy overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      <Container>
        <div ref={ref} className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
              Rejoignez{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-orange">notre communauté</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/20 -rotate-1 rounded-full" />
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-white/50 text-lg leading-relaxed"
          >
            Offrez à votre enfant une éducation de qualité dans un cadre
            bienveillant et stimulant. Contactez-nous dès aujourd&apos;hui.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button href="#contact" variant="primary" size="lg">
              Contactez-nous
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
            <Button href="#service" variant="secondary" size="lg" className="!border-white/25 !text-white hover:!bg-white hover:!text-navy">
              Nos services
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

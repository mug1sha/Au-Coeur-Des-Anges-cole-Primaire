"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Container from "@/components/Container";

export default function GalleryCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 lg:py-28 bg-offwhite">
      <Container>
        <div ref={ref} className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-navy/60 text-sm font-heading font-medium mb-8">
            <svg className="w-4 h-4 text-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            Contact
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
        >
          Une question sur{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-orange">notre école</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
          </span>
          {" "}?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-navy/55 text-lg leading-relaxed max-w-xl mx-auto"
        >
          Nous serions ravis de vous accueillir et de répondre à toutes vos
          questions sur notre projet pédagogique.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10"
        >
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-orange text-white font-heading font-semibold rounded-full text-base hover:bg-orange-light transition-all duration-300 hover:shadow-xl hover:shadow-orange/25 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-3"
          >
            Nous contacter
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const contactItems = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Adresse",
    value: "Kn41, 25, Nyarugenge, Kigali",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Téléphone",
    value: "+250 788 123 456",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "info@aucoeurdesanges.rw",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Horaires",
    value: "Lun–Ven, 8h00 – 16h30",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-offwhite overflow-hidden">
      <Container>
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Info */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Contactez-nous
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-6 text-balance"
            >
              Parlons de{" "}
              <span className="relative inline-block">
                <span className="relative z-10">l&apos;avenir</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
              </span>{" "}
              de votre enfant
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-navy/50 leading-relaxed mb-8"
            >
              Nous accueillons les familles qui souhaitent offrir à leurs
              enfants une éducation de qualité dans un cadre chaleureux et
              stimulant.
            </motion.p>

            <div className="space-y-4">
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-[5px] bg-white border border-navy/[0.04] hover:border-navy/[0.08] transition-colors"
                >
                  <div className="w-10 h-10 rounded-[5px] bg-navy/5 flex items-center justify-center text-navy flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] text-navy/35 font-heading font-semibold uppercase tracking-widest">
                      {item.label}
                    </div>
                    <div className="text-navy text-sm font-medium mt-0.5">
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Map placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-navy/[0.03] border border-navy/[0.06] rounded-[5px] aspect-[4/3] flex items-center justify-center overflow-hidden">
              <div className="text-center px-6">
                <svg className="w-12 h-12 mx-auto text-navy/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-navy/30 text-sm font-medium">Kn41, 25, Nyarugenge</p>
                <p className="text-navy/25 text-xs mt-1">Kigali, Rwanda</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

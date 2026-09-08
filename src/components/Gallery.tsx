"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

const galleryItems = [
  {
    title: "Cours créatif",
    category: "Arts",
    color: "#FF7800",
    span: "md:col-span-1",
    pattern: (
      <svg viewBox="0 0 300 200" className="w-full h-full" aria-hidden="true">
        <defs>
          <pattern id="g1" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="2" fill="#FF7800" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="300" height="200" fill="url(#g1)" />
        <circle cx="80" cy="100" r="45" fill="#FF7800" opacity="0.08" />
        <circle cx="200" cy="80" r="30" fill="#0783BD" opacity="0.06" />
        <circle cx="150" cy="140" r="20" fill="#023250" opacity="0.05" />
        <rect x="60" y="60" width="60" height="40" rx="4" fill="#FF7800" opacity="0.06" />
        <circle cx="240" cy="150" r="25" fill="#FF7800" opacity="0.05" />
      </svg>
    ),
  },
  {
    title: "Nature & jardin",
    category: "Plein air",
    color: "#0783BD",
    span: "md:col-span-2",
    pattern: (
      <svg viewBox="0 0 600 200" className="w-full h-full" aria-hidden="true">
        <path d="M0,160 Q75,100 150,140 Q225,180 300,120 Q375,60 450,100 Q525,140 600,80 L600,200 L0,200 Z" fill="#0783BD" opacity="0.06" />
        <path d="M0,180 Q100,130 200,160 Q300,190 400,140 Q500,90 600,120 L600,200 L0,200 Z" fill="#023250" opacity="0.04" />
        <circle cx="80" cy="100" r="30" fill="#0783BD" opacity="0.06" />
        <circle cx="250" cy="70" r="20" fill="#FF7800" opacity="0.05" />
        <circle cx="450" cy="90" r="25" fill="#0783BD" opacity="0.05" />
        <rect x="120" y="50" width="40" height="60" rx="3" fill="#023250" opacity="0.04" />
        <rect x="350" y="40" width="35" height="55" rx="3" fill="#023250" opacity="0.03" />
      </svg>
    ),
  },
  {
    title: "Lecture en groupe",
    category: "Apprentissage",
    color: "#023250",
    span: "md:col-span-1",
    pattern: (
      <svg viewBox="0 0 300 200" className="w-full h-full" aria-hidden="true">
        <rect x="60" y="50" width="180" height="100" rx="4" fill="#023250" opacity="0.06" />
        <rect x="70" y="60" width="160" height="80" rx="3" fill="#0783BD" opacity="0.04" />
        <circle cx="150" cy="100" r="15" fill="#FF7800" opacity="0.06" />
        <rect x="90" y="70" width="50" height="8" rx="2" fill="#FFFFFF" opacity="0.15" />
        <rect x="90" y="85" width="40" height="6" rx="2" fill="#FFFFFF" opacity="0.1" />
        <rect x="160" y="70" width="50" height="8" rx="2" fill="#FFFFFF" opacity="0.15" />
        <rect x="160" y="85" width="35" height="6" rx="2" fill="#FFFFFF" opacity="0.1" />
      </svg>
    ),
  },
  {
    title: "Éducation physique",
    category: "Sport",
    color: "#0783BD",
    span: "md:col-span-1",
    pattern: (
      <svg viewBox="0 0 300 200" className="w-full h-full" aria-hidden="true">
        <circle cx="150" cy="100" r="60" fill="none" stroke="#0783BD" strokeWidth="2" opacity="0.08" />
        <circle cx="150" cy="100" r="40" fill="none" stroke="#FF7800" strokeWidth="1.5" opacity="0.06" />
        <circle cx="150" cy="100" r="20" fill="#023250" opacity="0.05" />
        <circle cx="80" cy="70" r="12" fill="#0783BD" opacity="0.06" />
        <circle cx="220" cy="130" r="10" fill="#FF7800" opacity="0.06" />
      </svg>
    ),
  },
  {
    title: "Musique & rythme",
    category: "Arts",
    color: "#FF7800",
    span: "md:col-span-1",
    pattern: (
      <svg viewBox="0 0 300 200" className="w-full h-full" aria-hidden="true">
        <circle cx="80" cy="120" r="25" fill="#FF7800" opacity="0.06" />
        <circle cx="150" cy="80" r="18" fill="#0783BD" opacity="0.05" />
        <circle cx="220" cy="130" r="22" fill="#023250" opacity="0.05" />
        <line x1="80" y1="95" x2="80" y2="50" stroke="#FF7800" strokeWidth="2" opacity="0.08" />
        <line x1="220" y1="108" x2="220" y2="60" stroke="#023250" strokeWidth="2" opacity="0.06" />
        <circle cx="60" cy="60" r="5" fill="#FF7800" opacity="0.08" />
        <circle cx="240" cy="55" r="4" fill="#023250" opacity="0.06" />
      </svg>
    ),
  },
  {
    title: "Sciences en action",
    category: "Sciences",
    color: "#023250",
    span: "md:col-span-1",
    pattern: (
      <svg viewBox="0 0 300 200" className="w-full h-full" aria-hidden="true">
        <path d="M80,150 L110,50 L140,150 Z" fill="none" stroke="#023250" strokeWidth="2" opacity="0.08" />
        <path d="M160,150 L190,60 L220,150 Z" fill="none" stroke="#FF7800" strokeWidth="1.5" opacity="0.06" />
        <circle cx="150" cy="100" r="10" fill="#0783BD" opacity="0.08" />
        <circle cx="100" cy="120" r="6" fill="#FF7800" opacity="0.06" />
        <circle cx="200" cy="110" r="8" fill="#023250" opacity="0.06" />
      </svg>
    ),
  },
];

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="gallery" className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <Container>
        <div ref={ref}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Galerie
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
            >
              La vie à{" "}
              <span className="relative inline-block">
                <span className="relative z-10">l&apos;école</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
              </span>
            </motion.h2>
          </div>
          <motion.a
            href="/gallery"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-navy/15 text-navy font-heading font-semibold text-sm hover:bg-navy hover:text-white transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-navy focus-visible:outline-offset-2"
          >
            Voir toute la galerie
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[180px] md:auto-rows-[200px]">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
              className={`group relative rounded-[5px] bg-offwhite overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${item.span}`}
            >
              {/* Pattern background */}
              <div className="absolute inset-0">
                {item.pattern}
              </div>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${item.color}10 0%, transparent 60%)`,
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className="text-xs font-heading font-semibold uppercase tracking-wider"
                    style={{ color: item.color }}
                  >
                    {item.category}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold text-navy">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}

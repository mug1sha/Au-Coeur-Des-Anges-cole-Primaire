"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "./Container";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute top-10 -left-20 w-[350px] h-[350px] opacity-[0.02]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float 22s ease-in-out infinite" }}
        >
          <path
            d="M44.4,-65.2C57.6,-58.8,68.8,-47.6,75.2,-34.2C81.6,-20.8,83.2,-5.2,79.2,8.8C75.2,22.8,65.6,36.2,54.4,46.4C43.2,56.6,30.4,63.6,16.4,68.8C2.4,74,-12.8,77.4,-27.2,74.2C-41.6,71,-55.2,61.2,-64,48C-72.8,34.8,-76.8,18.2,-76.4,1.8C-76,-14.6,-71.2,-30.8,-62,-43.2C-52.8,-55.6,-39.2,-64.2,-25.2,-70C-11.2,-75.8,3.2,-78.8,17.2,-76.8C31.2,-74.8,31.2,-71.6,44.4,-65.2Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <Container>
        <div ref={ref} className="grid lg:grid-cols-3 gap-6">
          {/* Main quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 relative bg-navy rounded-[5px] p-8 lg:p-12 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 pointer-events-none" aria-hidden="true">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M20,50 Q50,10 80,50 Q50,90 20,50 Z"
                  fill="#FF7800"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <svg
                className="w-10 h-10 text-orange/60 mb-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
              <blockquote className="font-heading text-xl lg:text-2xl font-semibold text-white leading-relaxed mb-6">
                Mon fils a trouvé sa place au Coeur Des Anges. Il aime l&apos;école, il
                est épanoui et progresse chaque jour. L&apos;équipe pédagogique
                est à l&apos;écoute et les activités sont variées et enrichissantes.
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-orange text-sm">
                    SM
                  </span>
                </div>
                <div>
                  <div className="font-heading font-semibold text-white text-sm">
                    Sophie Martin
                  </div>
                  <div className="text-white/40 text-xs">
                    Parent d&apos;élève — CE1
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="flex-1 bg-offwhite rounded-[5px] p-6 lg:p-8"
            >
              <div className="flex items-center gap-1 mb-4" aria-label="5 étoiles sur 5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-orange"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-navy/60 text-sm leading-relaxed mb-4">
                &ldquo;Un cadre magnifique et une équipe dévouée. Les progrès
                de ma fille sont remarquables.&rdquo;
              </p>
              <div className="font-heading font-semibold text-navy text-sm">
                Thomas Lefèvre
              </div>
              <div className="text-navy/40 text-xs">Parent — CM2</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex-1 bg-offwhite rounded-[5px] p-6 lg:p-8"
            >
              <div className="w-12 h-12 rounded-[5px] bg-blue/10 flex items-center justify-center mb-4" aria-hidden="true">
                <svg className="w-6 h-6 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-navy/60 text-sm leading-relaxed mb-4">
                &ldquo;Les projets interdisciplinaires donnent du sens aux
                apprentissages. Ma fille est motivée chaque matin.&rdquo;
              </p>
              <div className="font-heading font-semibold text-navy text-sm">
                Claire Dubois
              </div>
              <div className="text-navy/40 text-xs">Parent — CP</div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}

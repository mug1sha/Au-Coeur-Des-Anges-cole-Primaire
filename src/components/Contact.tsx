"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";
import Button from "@/components/Button";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      className="relative py-24 lg:py-32 bg-offwhite overflow-hidden"
    >
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 -right-20 w-[450px] h-[450px] opacity-[0.03]"
          viewBox="0 0 200 200"
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <Container>
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Info */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
            >
              Contactez-nous
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight mb-6 text-balance"
            >
              Rejoignez{" "}
              <span className="relative inline-block">
                <span className="relative z-10">l&apos;aventure</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-navy/55 leading-relaxed mb-8"
            >
              Nous accueillons les familles qui souhaitent offrir à leurs
              enfants une éducation de qualité dans un cadre chaleureux et
              stimulant. Contactez-nous pour organiser une visite.
            </motion.p>

            {/* Contact details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="space-y-5"
            >
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  label: "Adresse",
                  value: "Kn41, 25, Nyarugenge, Kigali, Rwanda",
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
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[5px] bg-navy/5 flex items-center justify-center text-navy flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-navy/40 font-heading font-semibold uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-navy font-medium text-sm mt-0.5">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-navy rounded-[5px] p-8 lg:p-10 overflow-hidden relative">
              {/* Decorative blob */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-20 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <path
                    d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
                    fill="#0783BD"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>

              <div className="relative z-10">
                <h3 className="font-heading text-2xl font-bold text-white mb-3">
                  Demander un dossier d&apos;inscription
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  Remplissez le formulaire ci-dessous ou contactez-nous
                  directement. Nous vous répondrons sous 48 heures.
                </p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Prénom"
                      aria-label="Prénom"
                      className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-[5px] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-orange/50 focus:bg-white/[0.1] transition-all duration-200"
                    />
                    <input
                      type="text"
                      placeholder="Nom"
                      aria-label="Nom"
                      className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-[5px] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-orange/50 focus:bg-white/[0.1] transition-all duration-200"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    aria-label="Adresse e-mail"
                    className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-[5px] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-orange/50 focus:bg-white/[0.1] transition-all duration-200"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    aria-label="Numéro de téléphone"
                    className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-[5px] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-orange/50 focus:bg-white/[0.1] transition-all duration-200"
                  />
                  <select
                    aria-label="Niveau souhaité"
                    className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-[5px] text-white/50 text-sm focus:outline-none focus:border-orange/50 focus:bg-white/[0.1] transition-all duration-200 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Niveau souhaité</option>
                    <option value="ps">Petite Section</option>
                    <option value="ms">Moyenne Section</option>
                    <option value="gs">Grande Section</option>
                    <option value="cp">CP</option>
                    <option value="ce1">CE1</option>
                    <option value="ce2">CE2</option>
                    <option value="cm1">CM1</option>
                    <option value="cm2">CM2</option>
                  </select>
                  <textarea
                    placeholder="Message (facultatif)"
                    aria-label="Message"
                    rows={3}
                    className="w-full px-4 py-3 bg-white/[0.07] border border-white/10 rounded-[5px] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-orange/50 focus:bg-white/[0.1] transition-all duration-200 resize-none"
                  />
                  <Button type="submit" variant="primary" size="lg" className="w-full">Envoyer la demande</Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

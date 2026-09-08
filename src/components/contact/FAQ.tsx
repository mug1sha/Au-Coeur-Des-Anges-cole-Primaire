"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Container from "@/components/Container";

const faqs = [
  {
    question: "Comment inscrire mon enfant ?",
    answer:
      "L'inscription se fait en contactant notre secrétariat par téléphone ou par e-mail. Nous vous fournirons le dossier d'inscription et organiserons une visite de l'école pour vous accueillir et répondre à toutes vos questions.",
  },
  {
    question: "Quels niveaux accueillez-vous ?",
    answer:
      "Nous accueillons les enfants de la maternelle (PS, MS, GS) jusqu'au CM2, soit de 3 à 11 ans. Nos classes sont organisées par niveaux avec des effectifs réduits pour un suivi personnalisé de chaque élève.",
  },
  {
    question: "Quels sont vos horaires ?",
    answer:
      "L'école ouvre ses portes à 7h30 et les cours se terminent à 16h30. L'accueil périscolaire est disponible de 7h00 à 7h30 et de 16h30 à 18h00 pour faciliter les horaires des parents.",
  },
  {
    question: "Proposez-vous des activités extrascolaires ?",
    answer:
      "Oui, nous proposons un riche programme d'activités extrascolaires : sport (football, natation, athlétisme), arts (musique, théâtre, peinture),ainsi que des ateliers de science et de coderobótique. Ces activités sont incluses dans la scolarité.",
  },
  {
    question: "Comment visiter l'école ?",
    answer:
      "Vous pouvez planifier une visite en nous contactant par téléphone ou via le formulaire ci-dessous. Nous organisons des visites régulières du lundi au vendredi, avec presentation du projet pédagogique et rencontre avec l'équipe éducative.",
  },
];

function FAQItem({ faq, index }: { faq: (typeof faqs)[number]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-b border-lightgray last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-4 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-base font-semibold text-navy group-hover:text-blue transition-colors duration-200">
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-navy text-white rotate-180" : "bg-offwhite text-navy/50 group-hover:bg-lightgray"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-navy/55 leading-relaxed pr-0 md:pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-20 lg:py-28 bg-offwhite overflow-hidden">
      {/* Decorative shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.02]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float 22s ease-in-out infinite" }}
        >
          <path
            d="M45.3,-73.4C58.4,-66.1,68.9,-53.3,75.8,-39.1C82.7,-24.9,86,-9.3,83.7,5.8C81.4,20.9,73.5,35.5,63.4,47.2C53.3,58.9,41,67.7,27.2,73.3C13.4,78.9,-1.9,81.3,-16.8,78.5C-31.7,75.7,-46.2,67.7,-57.7,56.1C-69.2,44.5,-77.7,29.3,-80.3,13.3C-82.9,-2.7,-79.6,-19.4,-71.8,-33.2C-64,-47,-51.7,-57.9,-38.2,-65.1C-24.7,-72.3,-10,-75.8,3.4,-80.3C16.8,-84.8,32.2,-80.7,45.3,-73.4Z"
            fill="#0783BD"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto">
        <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4"
          >
            Questions fréquentes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight text-balance"
          >
            Vous avez des{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-orange">questions</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
            </span>
            {" "}?
          </motion.h2>
        </div>

        {/* FAQ list */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 md:p-8 shadow-card"
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </motion.div>
        </Container>
      </div>
    </section>
  );
}

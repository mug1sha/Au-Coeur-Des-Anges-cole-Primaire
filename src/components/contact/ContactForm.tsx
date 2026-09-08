"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Container from "@/components/Container";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const subjects = [
  "Demande d'information",
  "Inscription",
  "Visite de l'école",
  "Activités extrascolaires",
  "Autre",
];

export default function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Veuillez entrer votre nom.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Veuillez entrer votre adresse e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide.";
    }

    if (formData.phone && !/^[\d\s+\-()]{8,}$/.test(formData.phone)) {
      newErrors.phone = "Veuillez entrer un numéro valide.";
    }

    if (!formData.subject) {
      newErrors.subject = "Veuillez sélectionner un sujet.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Veuillez entrer votre message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    // Mock submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.1;
    setStatus(isSuccess ? "success" : "error");

    if (isSuccess) {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-offwhite overflow-hidden">
      {/* Decorative shape */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] opacity-[0.015]"
          viewBox="0 0 200 200"
          style={{ animation: "blob-float-reverse 25s ease-in-out infinite" }}
        >
          <path
            d="M39.5,-65.7C53.2,-60.2,68,-52.5,75.7,-40.2C83.4,-27.9,84,-11,80.8,4.3C77.6,19.6,70.6,33.3,61.2,44.4C51.8,55.5,40,64,27,70.1C14,76.2,-0.2,79.9,-14.4,77.8C-28.6,75.7,-42.8,67.8,-54.2,57.1C-65.6,46.4,-74.2,32.9,-78.1,18.1C-82,3.3,-81.2,-12.8,-75.2,-27.1C-69.2,-41.4,-58,-53.9,-44.8,-59.9C-31.6,-65.9,-16.4,-65.4,-0.4,-64.7C15.6,-64,25.8,-71.2,39.5,-65.7Z"
            fill="#FF7800"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div ref={ref} className="relative z-10">
        <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Header + info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="min-w-0"
          >
            <span className="inline-block text-orange font-heading font-semibold text-sm tracking-widest uppercase mb-4">
              Formulaire
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy leading-tight text-balance mb-6">
              Envoyez-nous un{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-orange">message</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-orange/15 -rotate-1 rounded-full" />
              </span>
            </h2>
            <p className="text-navy/55 leading-relaxed mb-10">
              Remplissez le formulaire ci-dessous et nous vous répondrons dans
              les meilleurs délais. Tous les champs marqués d&apos;une
              astérisque sont obligatoires.
            </p>

            {/* Quick contact cards */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold text-navy">Appelez-nous</p>
                  <p className="text-sm text-navy/50">+221 XX XXX XX XX</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-heading font-semibold text-navy">Écrivez-nous</p>
                  <p className="text-sm text-navy/50">contact@aucoeurdesanges.edu</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="min-w-0"
          >
            {/* Status messages */}
            {status === "success" && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-heading font-semibold text-green-800 text-sm">Message envoyé !</p>
                  <p className="text-green-700 text-sm mt-0.5">Nous vous répondrons dans les meilleurs délais.</p>
                </div>
              </div>
            )}
            {status === "error" && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="font-heading font-semibold text-red-800 text-sm">Erreur</p>
                  <p className="text-red-700 text-sm mt-0.5">Une erreur est survenue. Veuillez réessayer.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-heading font-semibold text-navy mb-1.5">
                  Nom complet <span className="text-orange">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Votre nom et prénom"
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-navy placeholder-navy/30 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue ${
                    errors.name ? "border-red-400" : "border-lightgray"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-heading font-semibold text-navy mb-1.5">
                  Adresse e-mail <span className="text-orange">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="votre@email.com"
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-navy placeholder-navy/30 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue ${
                    errors.email ? "border-red-400" : "border-lightgray"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-heading font-semibold text-navy mb-1.5">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-navy placeholder-navy/30 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue ${
                    errors.phone ? "border-red-400" : "border-lightgray"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-heading font-semibold text-navy mb-1.5">
                  Sujet <span className="text-orange">*</span>
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-navy text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue appearance-none ${
                    !formData.subject ? "text-navy/30" : ""
                  } ${errors.subject ? "border-red-400" : "border-lightgray"}`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23023250' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                  }}
                >
                  <option value="" disabled>
                    Sélectionnez un sujet
                  </option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-heading font-semibold text-navy mb-1.5">
                  Message <span className="text-orange">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Décrivez votre demande..."
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-navy placeholder-navy/30 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue resize-none ${
                    errors.message ? "border-red-400" : "border-lightgray"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="group w-full flex items-center justify-center gap-2.5 px-8 py-4 bg-orange text-white font-heading font-semibold rounded-full text-base hover:bg-orange-light transition-all duration-300 hover:shadow-xl hover:shadow-orange/25 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {status === "loading" ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M12 2a10 10 0 019.75 7.75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
        </Container>
      </div>
    </section>
  );
}

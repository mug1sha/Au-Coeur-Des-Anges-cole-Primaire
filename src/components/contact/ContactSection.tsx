"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight, Check, AlertCircle } from "lucide-react";
import { FadeLeft, FadeRight, StaggerContainer, StaggerItem } from "@/lib/animations";

const contactInfo = [
  { icon: MapPin, label: "Adresse", value: "Kigali, Rwanda" },
  { icon: Phone, label: "Téléphone", value: "+250 XXX XXX XXX" },
  { icon: Mail, label: "E-mail", value: "contact@example.com" },
  { icon: Clock, label: "Heures d\u2019ouverture", value: "Lundi \u2013 Vendredi\u00a007:00 \u2013 17:30" },
];

type FormState = "idle" | "loading" | "success" | "error";
const initialForm = { nom: "", email: "", telephone: "", enfant: "", age: "", service: "", message: "" };
type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

function validate(data: typeof initialForm): FormErrors {
  const errors: FormErrors = {};
  if (!data.nom.trim()) errors.nom = "Le nom est requis.";
  if (!data.email.trim()) errors.email = "L\u2019e-mail est requis.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Adresse e-mail invalide.";
  if (!data.message.trim()) errors.message = "Le message est requis.";
  else if (data.message.trim().length < 10) errors.message = "Le message doit comporter au moins 10 caractères.";
  return errors;
}

export default function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof initialForm]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setState("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setState("success");
  };

  const inputClass = (field: keyof typeof initialForm) =>
    `w-full rounded-[12px] border px-4 py-3 text-sm text-[#0B1B3D] outline-none transition-all duration-200 focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] ${
      errors[field] ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
    }`;

  return (
    <section className="bg-white px-5 py-16 md:px-8 lg:py-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">

          {/* LEFT */}
          <FadeLeft>
            <div className="space-y-6">
              <div className="rounded-[24px] bg-[#0B1B3D] p-7 text-white">
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-extrabold">Informations de contact</h2>
                <StaggerContainer className="mt-6 space-y-5">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    return (
                      <StaggerItem key={item.label}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/20">
                            <Icon size={15} className="text-[#FF6B35]" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white/50">{item.label}</p>
                            <p className="mt-0.5 whitespace-pre-line text-sm font-medium text-white/90">{item.value}</p>
                          </div>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </div>

              {/* WhatsApp with pulse */}
              <motion.a
                href="https://wa.me/250000000000"
                target="_blank"
                rel="noopener noreferrer"
                animate={{ boxShadow: ["0 0 0 0 rgba(37,211,102,0)", "0 0 0 8px rgba(37,211,102,0.2)", "0 0 0 0 rgba(37,211,102,0)"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                whileHover={{ y: -2 }}
                className="flex w-full items-center justify-center gap-3 rounded-[16px] bg-[#25D366] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#22c05e] hover:shadow-lg"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Écrire sur WhatsApp
              </motion.a>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-[20px] border border-slate-100 bg-[#F8F9FA]">
                <div className="flex aspect-[4/3] items-center justify-center bg-slate-100">
                  <div className="p-6 text-center">
                    <MapPin size={32} className="mx-auto mb-3 text-[#FF6B35]" />
                    <p className="font-[family-name:var(--font-heading)] font-bold text-[#0B1B3D]">Localisation de l&apos;école</p>
                    <p className="mt-1 text-sm text-[#0B1B3D]/55">Kigali, Rwanda</p>
                  </div>
                </div>
                <div className="p-4">
                  <a href="https://maps.google.com/?q=Kigali,Rwanda" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-[12px] border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0B1B3D] transition hover:border-[#FF6B35] hover:text-[#FF6B35]">
                    Obtenir l&apos;itinéraire <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </FadeLeft>

          {/* RIGHT: FORM */}
          <FadeRight>
            <div className="rounded-[24px] border border-slate-100 bg-white p-7 shadow-[0_8px_40px_rgba(11,27,61,0.06)] sm:p-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#0B1B3D]">Envoyer un message</h2>
              <p className="mt-2 text-sm text-[#0B1B3D]/55">Remplissez le formulaire ci-dessous, nous vous répondrons rapidement.</p>

              {state === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 flex flex-col items-center justify-center gap-4 rounded-[16px] bg-green-50 p-10 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <Check size={26} className="text-green-600" />
                  </div>
                  <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#0B1B3D]">Message bien reçu !</p>
                  <p className="text-sm text-[#0B1B3D]/60">Merci pour votre message. Notre équipe vous contactera très prochainement.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nom" className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">Nom complet <span className="text-[#FF6B35]">*</span></label>
                      <input id="nom" name="nom" type="text" value={form.nom} onChange={handleChange} placeholder="Votre nom" className={inputClass("nom")} />
                      {errors.nom && <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {errors.nom}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">E-mail <span className="text-[#FF6B35]">*</span></label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" className={inputClass("email")} />
                      {errors.email && <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="telephone" className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">Téléphone</label>
                      <input id="telephone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} placeholder="+250 XXX XXX XXX" className={inputClass("telephone")} />
                    </div>
                    <div>
                      <label htmlFor="service" className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">Service souhaité</label>
                      <select id="service" name="service" value={form.service} onChange={handleChange} className={inputClass("service")}>
                        <option value="">Sélectionnez…</option>
                        <option value="creche">Crèche</option>
                        <option value="maternelle">Maternelle</option>
                        <option value="visite">Demande de visite</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="enfant" className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">Nom de l&apos;enfant</label>
                      <input id="enfant" name="enfant" type="text" value={form.enfant} onChange={handleChange} placeholder="Prénom de l'enfant" className={inputClass("enfant")} />
                    </div>
                    <div>
                      <label htmlFor="age" className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">Âge de l&apos;enfant</label>
                      <input id="age" name="age" type="text" value={form.age} onChange={handleChange} placeholder="Ex : 2 ans" className={inputClass("age")} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">Message <span className="text-[#FF6B35]">*</span></label>
                    <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Votre message…" className={`${inputClass("message")} resize-none`} />
                    {errors.message && <p role="alert" className="mt-1 flex items-center gap-1 text-xs text-red-500"><AlertCircle size={12} /> {errors.message}</p>}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={state === "loading"}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#F95738] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state === "loading" ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Envoi en cours…
                      </span>
                    ) : (
                      <>Envoyer le message <ArrowRight size={16} /></>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </FadeRight>
        </div>
      </div>
    </section>
  );
}

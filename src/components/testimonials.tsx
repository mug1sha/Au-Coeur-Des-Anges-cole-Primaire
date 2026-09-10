"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { FadeUp } from "@/lib/animations";

const testimonials = [
  {
    name: "Marie D.",
    role: "Parent d\u2019élève",
    text: "Une équipe attentive et un cadre magnifique. Mon enfant est toujours ravi d\u2019aller à l\u2019école.",
  },
  {
    name: "Jean K.",
    role: "Parent d\u2019élève",
    text: "Nous avons trouvé ici bien plus qu\u2019une école, c\u2019est une vraie famille. Merci pour tout\u00a0!",
  },
  {
    name: "Aline M.",
    role: "Parent d\u2019élève",
    text: "Un environnement sûr, bienveillant et stimulant. Une très belle expérience pour notre famille.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const navigate = (dir: number) => {
    setActive((cur) => (cur + dir + testimonials.length) % testimonials.length);
  };

  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <FadeUp className="text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            Ce que disent les parents
          </h2>
          <p className="mt-3 text-[#0B1B3D]/60">La confiance des parents est notre plus belle récompense.</p>
        </FadeUp>

        {/* Mobile: single card with animated swap */}
        <div className="relative mt-12 md:hidden">
          <AnimatePresence mode="wait">
            <motion.article
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-[20px] border-2 border-[#FF6B35]/30 bg-white p-6 shadow-[0_15px_40px_rgba(11,27,61,0.10)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B35]/10 font-bold text-[#FF6B35]">
                  {testimonials[active].name.charAt(0)}
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={14} className="fill-[#FF6B35] text-[#FF6B35]" />
                  ))}
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#0B1B3D]/70">
                &ldquo;{testimonials[active].text}&rdquo;
              </p>
              <div className="mt-5">
                <p className="font-bold text-[#0B1B3D]">{testimonials[active].name}</p>
                <p className="text-xs text-[#0B1B3D]/50">{testimonials[active].role}</p>
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Mobile nav buttons */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              aria-label="Témoignage précédent"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md transition hover:bg-[#0B1B3D] hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`Afficher le témoignage ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-[#FF6B35]" : "w-2 bg-[#0B1B3D]/15"}`}
                />
              ))}
            </div>
            <button
              onClick={() => navigate(1)}
              aria-label="Témoignage suivant"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md transition hover:bg-[#0B1B3D] hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Desktop: all 3 cards, active one highlighted */}
        <div className="relative mt-12 hidden md:block">
          <button
            onClick={() => navigate(-1)}
            aria-label="Témoignage précédent"
            className="absolute -left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md transition hover:bg-[#0B1B3D] hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                animate={{
                  y: index === active ? -6 : 0,
                  scale: index === active ? 1.02 : 1,
                  boxShadow: index === active
                    ? "0 15px 40px rgba(11,27,61,0.12)"
                    : "0 8px 30px rgba(11,27,61,0.06)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={() => setActive(index)}
                className={`cursor-pointer rounded-[20px] border-2 bg-white p-6 transition-colors duration-300 ${
                  index === active ? "border-[#FF6B35]/40" : "border-slate-100 hover:border-[#FF6B35]/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full font-bold transition-colors duration-300 ${
                    index === active ? "bg-[#FF6B35] text-white" : "bg-[#FF6B35]/10 text-[#FF6B35]"
                  }`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={14} className="fill-[#FF6B35] text-[#FF6B35]" />
                    ))}
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-[#0B1B3D]/70">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="mt-5">
                  <p className="font-bold text-[#0B1B3D]">{testimonial.name}</p>
                  <p className="text-xs text-[#0B1B3D]/50">{testimonial.role}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            aria-label="Témoignage suivant"
            className="absolute -right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md transition hover:bg-[#0B1B3D] hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Desktop dots */}
        <div className="mt-7 hidden justify-center gap-2 md:flex">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActive(index)}
              aria-label={`Afficher le témoignage ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${index === active ? "w-6 bg-[#FF6B35]" : "w-2 bg-[#0B1B3D]/15"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

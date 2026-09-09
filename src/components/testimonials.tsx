"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

        <div className="relative mt-12">
          <button
            onClick={() => navigate(-1)}
            aria-label="Témoignage précédent"
            className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md transition hover:bg-[#0B1B3D] hover:text-white md:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                animate={{
                  y: index === active ? -4 : 0,
                  boxShadow: index === active
                    ? "0 15px 40px rgba(11,27,61,0.10)"
                    : "0 8px 30px rgba(11,27,61,0.06)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-[20px] border border-slate-100 bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B35]/10 font-bold text-[#FF6B35]">
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
            className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md transition hover:bg-[#0B1B3D] hover:text-white md:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-7 flex justify-center gap-2">
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

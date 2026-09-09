"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Marie D.",
    role: "Parent d'élève",
    text: "Une équipe attentive et un cadre magnifique. Mon enfant est toujours ravi d'aller à l'école.",
  },
  {
    name: "Jean K.",
    role: "Parent d'élève",
    text: "Nous avons trouvé ici bien plus qu'une école, c'est une vraie famille. Merci pour tout !",
  },
  {
    name: "Aline M.",
    role: "Parent d'élève",
    text: "Un environnement sûr, bienveillant et stimulant. Une très belle expérience pour notre famille.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const next = () => {
    setActive((current) => (current + 1) % testimonials.length);
  };

  const previous = () => {
    setActive(
      (current) => (current - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:py-24">
      <div className="mx-auto max-w-[1200px]">

        <div className="text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            Ce que disent les parents
          </h2>

          <p className="mt-3 text-[#0B1B3D]/60">
            La confiance des parents est notre plus belle récompense.
          </p>
        </div>

        <div className="relative mt-12">

          <button
            onClick={previous}
            aria-label="Témoignage précédent"
            className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white shadow-md transition hover:bg-[#0B1B3D] hover:text-white md:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.name}
                className={`rounded-[20px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(11,27,61,0.06)] transition ${
                  index === active
                    ? "md:-translate-y-1 md:shadow-[0_15px_40px_rgba(11,27,61,0.1)]"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B35]/10 font-bold text-[#FF6B35]">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className="fill-[#FF6B35] text-[#FF6B35]"
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#0B1B3D]/70">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="mt-5">
                  <p className="font-bold text-[#0B1B3D]">
                    {testimonial.name}
                  </p>

                  <p className="text-xs text-[#0B1B3D]/50">
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <button
            onClick={next}
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
              className={`h-2 rounded-full transition-all ${
                index === active
                  ? "w-6 bg-[#FF6B35]"
                  : "w-2 bg-[#0B1B3D]/15"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

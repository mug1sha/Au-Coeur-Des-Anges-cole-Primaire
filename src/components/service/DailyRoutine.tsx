"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { FadeUp } from "@/lib/animations";

const routine = [
  { time: "07:00", label: "Accueil des enfants", desc: "Arrivée et installation en douceur" },
  { time: "08:00", label: "Jeux libres", desc: "Activités libres et exploration" },
  { time: "09:00", label: "Atelier d\u2019apprentissage", desc: "Activités pédagogiques encadrées" },
  { time: "10:30", label: "Pause & goûter", desc: "Collation équilibrée et repos" },
  { time: "11:00", label: "Activités créatives", desc: "Arts, musique ou motricité" },
  { time: "12:00", label: "Déjeuner", desc: "Repas sain servi à l\u2019école" },
  { time: "13:00", label: "Repos", desc: "Sieste ou temps calme" },
  { time: "15:00", label: "Activités après-midi", desc: "Jeux, sorties et ateliers" },
  { time: "16:30", label: "Départ", desc: "Retrouvailles avec les familles" },
];

function TimelineItem({ item, index }: { item: typeof routine[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "start 0.4"] });
  const reduced = useReducedMotion();

  const opacity = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.4, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.97, 1]);
  const dotScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0.6, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale }}
      className="relative flex gap-5"
    >
      {/* DOT + LINE */}
      <div className="flex flex-col items-center">
        <motion.div
          style={{ scale: dotScale }}
          className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-white shadow-md"
        >
          <span className="text-[9px] font-bold">{index + 1}</span>
        </motion.div>
        {index < routine.length - 1 && (
          <div className="mt-1 w-[2px] flex-1 bg-[#FF6B35]/20 min-h-[40px]" />
        )}
      </div>

      {/* CONTENT */}
      <div className="pb-8 pt-1">
        <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-3 py-1 text-xs font-bold text-[#FF6B35]">
          {item.time}
        </span>
        <h3 className="mt-2 font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
          {item.label}
        </h3>
        <p className="mt-1 text-sm text-[#463ACB]/55">{item.desc}</p>
      </div>
    </motion.div>
  );
}

export default function DailyRoutine() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const reduced = useReducedMotion();
  const lineHeight = useTransform(scrollYProgress, [0, 1], reduced ? ["100%", "100%"] : ["0%", "100%"]);

  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Une journée type
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#463ACB] sm:text-4xl">
            Une journée chez Au Coeur Des Anges
          </h2>
          <p className="mt-3 text-[#463ACB]/60">
            Un programme équilibré qui alterne apprentissage, créativité et repos.
          </p>
        </FadeUp>

        {/* MOBILE & DESKTOP: vertical timeline */}
        <div ref={containerRef} className="relative mx-auto mt-14 max-w-[600px]">
          {/* Animated fill line (behind items) */}
          <div className="absolute left-[17px] top-0 h-full w-[2px] bg-[#FF6B35]/15">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-[#FF6B35] origin-top"
            />
          </div>

          <div className="space-y-0">
            {routine.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* DESKTOP: also show grid view at lg */}
        <div className="mt-14 hidden lg:grid lg:grid-cols-3 lg:gap-5">
          {routine.map((item, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="group rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#FF6B35]/30 hover:shadow-[0_12px_40px_rgba(11,27,61,0.10)]">
                <div className="mb-3 inline-flex rounded-full bg-[#FF6B35]/10 px-3 py-1 text-xs font-bold text-[#FF6B35]">
                  {item.time}
                </div>
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">{item.label}</h3>
                <p className="mt-1.5 text-sm text-[#463ACB]/55">{item.desc}</p>
                <div className="mt-4 h-[2px] w-8 rounded-full bg-[#FF6B35]/30 transition-all duration-300 group-hover:w-full group-hover:bg-[#FF6B35]/50" />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Images, Heart, Star } from "lucide-react";
import { HeroReveal } from "@/lib/animations";

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#F8F9FA]">
      {/* Decorative blobs */}
      <motion.div
        animate={reduced ? {} : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-10 top-20 h-28 w-28 rounded-full bg-[#FF6B35]/10 blur-3xl"
      />
      <motion.div
        animate={reduced ? {} : { y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute right-0 top-10 h-40 w-40 rounded-full bg-blue-100/70 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-20 xl:py-24">

        {/* LEFT */}
        <div className="relative z-10 max-w-[650px]">
          <HeroReveal delay={0}>
            <div className="mb-5 inline-flex rounded-full bg-[#FF6B35] px-4 py-2 text-xs font-bold text-white shadow-sm">
              Crèche & École Maternelle à Kigali
            </div>
          </HeroReveal>

          <HeroReveal delay={0.1}>
            <h1 className="font-[family-name:var(--font-heading)] text-[42px] font-extrabold leading-[1.08] tracking-[-1px] text-[#0B1B3D] sm:text-5xl lg:text-[58px] xl:text-[64px]">
              Un environnement chaleureux pour{" "}
              <span className="text-[#FF6B35]">grandir avec amour</span>{" "}
              et apprendre avec joie.
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.2}>
            <p className="mt-6 max-w-[570px] text-base leading-7 text-[#0B1B3D]/70 sm:text-lg">
              À Au Coeur Des Anges, nous offrons à vos enfants un cadre
              sécurisé, bienveillant et stimulant pour favoriser leur
              épanouissement et leur réussite.
            </p>
          </HeroReveal>

          <HeroReveal delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-6 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-1 hover:bg-[#F95738] hover:shadow-xl"
              >
                Découvrir nos programmes
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border-2 border-[#0B1B3D] bg-white px-6 py-3 text-sm font-bold text-[#0B1B3D] transition duration-200 hover:bg-[#0B1B3D] hover:text-white"
              >
                Visiter la galerie
                <Images size={17} />
              </Link>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.4}>
            <div className="mt-9 flex flex-wrap items-center gap-5 text-sm text-[#0B1B3D]/70">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B35]/10">
                  <Heart size={15} className="text-[#FF6B35]" />
                </div>
                <span>Un cadre bienveillant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B35]/10">
                  <Star size={15} className="fill-[#FF6B35] text-[#FF6B35]" />
                </div>
                <span>Éveil & créativité</span>
              </div>
            </div>
          </HeroReveal>
        </div>

        {/* RIGHT VISUAL */}
        <HeroReveal delay={0.2} className="relative mx-auto w-full max-w-[650px]">
          {/* Decorative arc */}
          <div className="absolute -left-3 top-2 z-20 h-24 w-24 rounded-tl-[80px] border-l-[6px] border-t-[6px] border-[#FF6B35] sm:h-32 sm:w-32" />

          {/* Image frame */}
          <div className="relative aspect-[1.05/0.85] overflow-hidden rounded-[34%_30%_35%_25%] border-[7px] border-[#FF6B35] bg-white shadow-2xl">
            <motion.div
              initial={{ scale: reduced ? 1 : 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src="/images/hero.jpg"
                alt="Enfants de Au Coeur Des Anges"
                fill
                priority
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/15 to-transparent" />
          </div>

          {/* Floating logo */}
          <div className="absolute -bottom-8 -right-3 z-20 h-28 w-28 rounded-full bg-white p-2 shadow-xl sm:h-36 sm:w-36">
            <Image
              src="/images/logo.png"
              alt="Logo Au Coeur Des Anges"
              fill
              className="rounded-full object-contain p-2"
            />
          </div>

          {/* Floating message */}
          <motion.div
            animate={reduced ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-2 top-[30px] hidden rotate-3 sm:block"
          >
            <div className="text-right font-[family-name:var(--font-heading)] font-bold text-[#0B1B3D]">
              <div className="text-sm">Petits pas,</div>
              <div className="text-lg text-[#FF6B35]">grands rêves</div>
              <Heart className="ml-auto mt-1 fill-[#FF6B35] text-[#FF6B35]" size={21} />
            </div>
          </motion.div>

          {/* Floating star */}
          <motion.div
            animate={reduced ? {} : { rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-4 bottom-16 hidden lg:block"
          >
            <Star className="fill-[#FF6B35] text-[#FF6B35]" size={30} />
          </motion.div>
        </HeroReveal>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images, Heart, Star } from "lucide-react";
import { HeroReveal, FadeRight } from "@/lib/animations";

export default function ServiceHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F9FA]">
      <div className="pointer-events-none absolute -left-10 top-20 h-32 w-32 rounded-full bg-[#FF6B35]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-24">
        <div className="max-w-[600px]">
          <HeroReveal delay={0}>
            <span className="mb-5 inline-flex rounded-full bg-[#FF6B35] px-4 py-2 text-xs font-bold text-white">
              Nos services
            </span>
          </HeroReveal>
          <HeroReveal delay={0.1}>
            <h1 className="font-[family-name:var(--font-heading)] text-[38px] font-extrabold leading-[1.1] tracking-tight text-[#463ACB] sm:text-5xl lg:text-[52px]">
              Des services pensés pour{" "}
              <span className="text-[#FF6B35]">accompagner chaque enfant.</span>
            </h1>
          </HeroReveal>
          <HeroReveal delay={0.2}>
            <p className="mt-5 max-w-[540px] text-base leading-7 text-[#463ACB]/65 sm:text-lg">
              Découvrez nos programmes, nos activités et notre approche pour
              offrir à chaque enfant un environnement sécurisé, stimulant et
              bienveillant.
            </p>
          </HeroReveal>
          <HeroReveal delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-6 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#F95738] hover:shadow-xl">
                Nous contacter <ArrowRight size={16} />
              </Link>
              <Link href="/gallery" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border-2 border-[#463ACB] bg-white px-6 py-3 text-sm font-bold text-[#463ACB] transition duration-200 hover:bg-[#463ACB] hover:text-white">
                Découvrir la galerie <Images size={16} />
              </Link>
            </div>
          </HeroReveal>
          <HeroReveal delay={0.4}>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-[#463ACB]/65">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/10">
                  <Heart size={14} className="text-[#FF6B35]" />
                </div>
                <span>Accompagnement bienveillant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/10">
                  <Star size={14} className="fill-[#FF6B35] text-[#FF6B35]" />
                </div>
                <span>Programmes adaptés</span>
              </div>
            </div>
          </HeroReveal>
        </div>

        <FadeRight delay={0.2} className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -left-3 top-3 z-10 h-20 w-20 rounded-tl-[60px] border-l-[5px] border-t-[5px] border-[#FF6B35] sm:h-28 sm:w-28" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-[6px] border-[#FF6B35] bg-white shadow-2xl">
            <Image src="/images/school.jpg" alt="Nos services éducatifs" fill priority className="object-cover transition duration-700 hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#463ACB]/20 to-transparent" />
          </div>
          <div className="absolute -bottom-5 -right-3 z-10 hidden sm:block">
            <Star className="fill-[#FF6B35] text-[#FF6B35]" size={28} />
          </div>
        </FadeRight>
      </div>
    </section>
  );
}

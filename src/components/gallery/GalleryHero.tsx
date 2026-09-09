import Image from "next/image";
import { Star } from "lucide-react";

export default function GalleryHero() {
  return (
    <section className="relative overflow-hidden bg-[#012dcc] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-[#FF6B35]/10 blur-3xl" />
        <div className="absolute right-0 top-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-24">
        {/* LEFT */}
        <div className="max-w-[580px]">
          <span className="mb-5 inline-flex rounded-full bg-[#FF6B35] px-4 py-2 text-xs font-bold text-white">
            Notre galerie
          </span>

          <h1 className="font-[family-name:var(--font-heading)] text-[38px] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[52px]">
            Découvrez{" "}
            <span className="text-[#FF6B35]">notre univers.</span>
          </h1>

          <p className="mt-5 max-w-[500px] text-base leading-7 text-white/70 sm:text-lg">
            Un aperçu des espaces, activités et moments qui font la vie
            d&apos;Au Coeur Des Anges au quotidien.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Star size={14} className="fill-[#FF6B35] text-[#FF6B35]" />
              <span>Espaces de vie</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={14} className="fill-[#FF6B35] text-[#FF6B35]" />
              <span>Activités & ateliers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={14} className="fill-[#FF6B35] text-[#FF6B35]" />
              <span>Moments de vie</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative mx-auto grid w-full max-w-[520px] grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
            <Image src="/images/hero.jpg" alt="Enfants à Au Coeur Des Anges" fill className="object-cover" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <Image src="/images/creche.jpg" alt="La crèche" fill className="object-cover" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <Image src="/images/maternelle.jpg" alt="La maternelle" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

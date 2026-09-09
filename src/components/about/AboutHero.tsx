import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F9FA]">
      <div className="pointer-events-none absolute -left-10 top-20 h-32 w-32 rounded-full bg-[#FF6B35]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-16 md:px-8 lg:grid-cols-2 lg:py-24">
        {/* LEFT */}
        <div className="max-w-[600px]">
          <span className="mb-5 inline-flex rounded-full bg-[#FF6B35] px-4 py-2 text-xs font-bold text-white">
            À propos de nous
          </span>

          <h1 className="font-[family-name:var(--font-heading)] text-[38px] font-extrabold leading-[1.1] tracking-tight text-[#0B1B3D] sm:text-5xl lg:text-[52px]">
            Grandir dans un environnement où{" "}
            <span className="text-[#FF6B35]">chaque enfant compte.</span>
          </h1>

          <p className="mt-5 max-w-[540px] text-base leading-7 text-[#0B1B3D]/65 sm:text-lg">
            À Au Coeur Des Anges, nous croyons que les premières années jouent
            un rôle essentiel dans le développement et l&apos;épanouissement de
            chaque enfant.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-6 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#F95738] hover:shadow-xl"
            >
              Nous contacter
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border-2 border-[#0B1B3D] bg-white px-6 py-3 text-sm font-bold text-[#0B1B3D] transition duration-200 hover:bg-[#0B1B3D] hover:text-white"
            >
              Nos programmes
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -left-3 top-3 z-10 h-20 w-20 rounded-tl-[60px] border-l-[5px] border-t-[5px] border-[#FF6B35] sm:h-28 sm:w-28" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-[6px] border-[#FF6B35] bg-white shadow-2xl">
            <Image
              src="/images/hero.jpg"
              alt="Au Coeur Des Anges"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/20 to-transparent" />
          </div>
          <div className="absolute -bottom-4 -right-4 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6B35] shadow-xl">
            <Heart className="fill-white text-white" size={22} />
          </div>
        </div>
      </div>
    </section>
  );
}

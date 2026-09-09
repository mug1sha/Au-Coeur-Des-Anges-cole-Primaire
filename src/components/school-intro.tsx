import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export default function SchoolIntro() {
  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2 lg:gap-20">

        {/* IMAGE */}
        <div className="relative">
          <div className="relative aspect-[1.25/1] overflow-hidden rounded-[28px]">
            <Image
              src="/images/school.jpg"
              alt="Environnement de Au Coeur Des Anges"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-5 -left-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B35] text-white shadow-lg">
            <Heart className="fill-white" size={25} />
          </div>

          <div className="absolute -right-4 -top-4 hidden h-20 w-20 rounded-full border-[5px] border-[#FF6B35]/20 sm:block" />
        </div>

        {/* CONTENT */}
        <div>
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Notre école
          </span>

          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold leading-tight text-[#0B1B3D] sm:text-4xl">
            Grandir avec amour,
            <br />
            apprendre avec joie.
          </h2>

          <p className="mt-5 leading-7 text-[#0B1B3D]/65">
            Au Coeur Des Anges est une crèche et maternelle qui place
            l&apos;enfant au centre de tout. Nous croyons en une éducation
            bienveillante, ludique et personnalisée, permettant à chaque
            enfant de développer son potentiel dans un cadre chaleureux
            et sécurisé.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#F95738]"
            >
              Découvrir notre histoire
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/about"
              className="inline-flex min-h-11 items-center justify-center px-4 py-3 text-sm font-bold text-[#0B1B3D] transition hover:text-[#FF6B35]"
            >
              En savoir plus
              <ArrowRight size={15} className="ml-2" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

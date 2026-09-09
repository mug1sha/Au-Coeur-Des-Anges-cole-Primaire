import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[24px] bg-[#0B1B3D] px-6 py-10 text-white sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <Heart className="mt-1 hidden shrink-0 fill-[#FF6B35] text-[#FF6B35] md:block" size={28} />
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold sm:text-3xl">
                Construisons ensemble les premières étapes de leur avenir.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
                Rencontrez notre équipe et découvrez notre école lors d&apos;une visite personnalisée.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#FF6B35] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#F95738] hover:shadow-lg"
          >
            Nous contacter
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

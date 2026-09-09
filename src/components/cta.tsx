import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { ScaleIn } from "@/lib/animations";

export default function CTA() {
  return (
    <section className="px-5 pb-8 md:px-8">
      <ScaleIn>
        <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[24px] bg-[#FF6B35] px-6 py-8 text-white sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <Heart className="mt-1 hidden shrink-0 fill-white md:block" size={28} />
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold sm:text-3xl">
                  Vous souhaitez réserver une place pour votre enfant ?
                </h2>
                <p className="mt-2 text-sm text-white/85 sm:text-base">
                  Notre équipe est à votre écoute pour répondre à toutes vos questions.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#0B1B3D] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#102A43] hover:shadow-lg"
            >
              Contactez-nous aujourd&apos;hui
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </ScaleIn>
    </section>
  );
}

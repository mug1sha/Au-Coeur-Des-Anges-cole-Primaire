import { Phone } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="px-5 py-16 md:px-8">
      <div className="mx-auto max-w-[1200px] rounded-[24px] bg-[#F8F9FA] px-6 py-10 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#0B1B3D] sm:text-3xl">
              Une question ? Parlons-en.
            </h2>
            <p className="mt-2 text-sm text-[#0B1B3D]/60 sm:text-base">
              Notre équipe est disponible du lundi au vendredi, de 07h00 à 17h30.
            </p>
          </div>
          <a
            href="tel:+250000000000"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#0B1B3D] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#102A43] hover:shadow-lg"
          >
            <Phone size={16} />
            +250 XXX XXX XXX
          </a>
        </div>
      </div>
    </section>
  );
}

import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F9FA]">
      <div className="pointer-events-none absolute -left-10 top-20 h-32 w-32 rounded-full bg-[#FF6B35]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-5 py-16 md:px-8 lg:py-20">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="mb-5 inline-flex rounded-full bg-[#FF6B35] px-4 py-2 text-xs font-bold text-white">
            Contactez-nous
          </span>

          <h1 className="font-[family-name:var(--font-heading)] text-[38px] font-extrabold leading-[1.1] tracking-tight text-[#463ACB] sm:text-5xl">
            Nous sommes là pour{" "}
            <span className="text-[#FF6B35]">vous accompagner.</span>
          </h1>

          <p className="mt-5 text-base leading-7 text-[#463ACB]/65 sm:text-lg">
            Une question, une demande de visite ou une inscription ?
            Notre équipe est à votre écoute du lundi au vendredi.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-[#463ACB]/70">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/10">
                <Phone size={14} className="text-[#FF6B35]" />
              </div>
              <span>+250 XXX XXX XXX</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/10">
                <Mail size={14} className="text-[#FF6B35]" />
              </div>
              <span>contact@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/10">
                <MapPin size={14} className="text-[#FF6B35]" />
              </div>
              <span>Kigali, Rwanda</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

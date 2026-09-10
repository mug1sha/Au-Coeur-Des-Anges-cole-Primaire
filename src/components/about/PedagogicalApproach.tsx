import Image from "next/image";
import { Check } from "lucide-react";
import { FadeLeft, FadeRight, StaggerContainer, StaggerItem } from "@/lib/animations";

const approaches = [
  "Apprentissage par le jeu",
  "Développement de la curiosité",
  "Activités pratiques et concrètes",
  "Socialisation et vie en groupe",
  "Autonomie progressive",
  "Intelligence émotionnelle",
];

export default function PedagogicalApproach() {
  return (
    <section className="bg-[#F8F9FA] px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <FadeLeft>
          <div>
            <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
              Pédagogie
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold leading-tight text-[#463ACB] sm:text-4xl">
              Notre approche pédagogique
            </h2>
            <p className="mt-5 leading-7 text-[#463ACB]/65">
              Notre pédagogie s&apos;appuie sur les dernières recherches en sciences de l&apos;éducation.
              Nous privilégions une approche globale qui prend en compte le développement cognitif,
              émotionnel et social de chaque enfant.
            </p>
            <StaggerContainer className="mt-7 space-y-3">
              {approaches.map((item) => (
                <StaggerItem key={item}>
                  <div className="flex items-center gap-3 text-[#463ACB]/80">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
                      <Check size={12} className="text-white" />
                    </span>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeLeft>

        <FadeRight>
          <div className="relative">
            <div className="relative aspect-[1/1] overflow-hidden rounded-[28px] shadow-xl">
              <Image src="/images/maternelle.jpg" alt="Notre approche pédagogique" fill className="object-cover transition duration-700 hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#463ACB]/10 to-transparent" />
            </div>
            <div className="absolute -right-4 -top-4 hidden h-20 w-20 rounded-full border-[5px] border-[#FF6B35]/25 sm:block" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[#FF6B35]/10" />
          </div>
        </FadeRight>
      </div>
    </section>
  );
}

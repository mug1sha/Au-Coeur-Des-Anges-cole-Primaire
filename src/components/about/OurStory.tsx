import Image from "next/image";
import { Heart, Shield, Star, Smile } from "lucide-react";

const pillars = [
  { icon: Heart, label: "Amour & bienveillance" },
  { icon: Shield, label: "Sécurité & confiance" },
  { icon: Star, label: "Éveil & créativité" },
  { icon: Smile, label: "Épanouissement" },
];

export default function OurStory() {
  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
        {/* IMAGE */}
        <div className="relative">
          <div className="relative aspect-[1.1/1] overflow-hidden rounded-[28px] shadow-xl">
            <Image
              src="/images/school.jpg"
              alt="Notre école Au Coeur Des Anges"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF6B35] shadow-lg">
            <Heart className="fill-white text-white" size={22} />
          </div>
          <div className="absolute -right-4 -top-4 hidden h-20 w-20 rounded-full border-[5px] border-[#FF6B35]/20 sm:block" />
        </div>

        {/* CONTENT */}
        <div>
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Notre histoire
          </span>

          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold leading-tight text-[#0B1B3D] sm:text-4xl">
            Une école construite autour de l&apos;enfant.
          </h2>

          <p className="mt-5 leading-7 text-[#0B1B3D]/65">
            Au Coeur Des Anges est née d&apos;une conviction profonde : chaque
            enfant mérite un espace où il se sent aimé, compris et libre de
            grandir à son rythme. Nous avons bâti un lieu chaleureux,
            bienveillant et stimulant, conçu pour accompagner les premières
            années de vie avec soin et attention.
          </p>

          <p className="mt-4 leading-7 text-[#0B1B3D]/65">
            Notre approche allie tendresse et exigence éducative, créativité et
            structure, liberté et sécurité. Ici, chaque journée est une
            invitation à découvrir, créer et grandir ensemble.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.label} className="flex items-center gap-3 rounded-[14px] border border-slate-100 bg-[#F8F9FA] px-4 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/10">
                    <Icon size={15} className="text-[#FF6B35]" />
                  </div>
                  <span className="text-sm font-semibold text-[#0B1B3D]">{p.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

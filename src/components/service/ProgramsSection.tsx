import Image from "next/image";
import { Baby, GraduationCap, Check } from "lucide-react";

const programs = [
  {
    title: "La Crèche",
    age: "3 mois – 2 ans",
    image: "/images/creche.jpg",
    icon: Baby,
    description:
      "Un environnement doux et sécurisé où les tout-petits bénéficient d'un accompagnement personnalisé, adapté à leur rythme et à leurs besoins.",
    items: [
      "Soins personnalisés",
      "Éveil sensoriel",
      "Développement moteur",
      "Temps de repos",
      "Accompagnement quotidien",
    ],
    bg: "bg-[#FFF4EF]",
    badge: "bg-[#FF6B35]/15 text-[#FF6B35]",
  },
  {
    title: "L\u2019École Maternelle",
    age: "3 ans – 6 ans",
    image: "/images/maternelle.jpg",
    icon: GraduationCap,
    description:
      "Un cadre stimulant où les enfants développent leur autonomie, leur créativité, leur langage et leurs premières compétences scolaires.",
    items: [
      "Développement du langage",
      "Premiers apprentissages",
      "Arts & créativité",
      "Socialisation",
      "Développement de l\u2019autonomie",
    ],
    bg: "bg-[#F0F7FF]",
    badge: "bg-[#0B1B3D]/10 text-[#0B1B3D]",
  },
];

export default function ProgramsSection() {
  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Nos programmes éducatifs
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            Des parcours adaptés à chaque étape
          </h2>
          <p className="mt-3 text-[#0B1B3D]/60">
            Des parcours adaptés aux différentes étapes du développement de
            votre enfant.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <div
                key={program.title}
                className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF6B35] text-white shadow-lg">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-heading)] text-lg font-extrabold text-white leading-tight">
                        {program.title}
                      </p>
                      <p className="text-xs font-semibold text-white/80">{program.age}</p>
                    </div>
                  </div>
                </div>

                <div className={`${program.bg} p-7`}>
                  <p className="text-sm leading-6 text-[#0B1B3D]/70">
                    {program.description}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {program.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#0B1B3D]/80">
                        <Check size={15} className="shrink-0 text-[#FF6B35]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

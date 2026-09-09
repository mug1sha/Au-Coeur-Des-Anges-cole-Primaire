import Image from "next/image";
import Link from "next/link";
import { Baby, GraduationCap, Check, ArrowRight } from "lucide-react";

const programs = [
  {
    title: "La Crèche",
    age: "3 mois – 2 ans",
    image: "/images/creche.jpg",
    icon: Baby,
    description:
      "Un accompagnement doux et personnalisé pour les premières années de votre enfant.",
    items: [
      "Soins personnalisés",
      "Éveil sensoriel",
      "Développement moteur",
      "Repos et confort",
    ],
    background: "bg-[#FFF4EF]",
  },
  {
    title: "L'École Maternelle",
    age: "3 ans – 6 ans",
    image: "/images/maternelle.jpg",
    icon: GraduationCap,
    description:
      "Un environnement stimulant pour apprendre, créer et développer son autonomie.",
    items: [
      "Développement du langage",
      "Premiers apprentissages",
      "Arts et créativité",
      "Socialisation",
    ],
    background: "bg-[#F0F7FF]",
  },
];

export default function Programs() {
  return (
    <section className="bg-[#F8F9FA] px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">

        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Nos programmes
          </span>

          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            Des parcours adaptés à chaque âge
          </h2>

          <p className="mt-3 text-[#0B1B3D]/60">
            Deux étapes essentielles pour bien grandir.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">

          {programs.map((program) => {
            const Icon = program.icon;

            return (
              <div
                key={program.title}
                className="grid overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[0.8fr_1.2fr]"
              >

                <div className="relative min-h-[260px]">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className={`${program.background} p-7 sm:p-8`}>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B35] text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#0B1B3D]">
                    {program.title}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-[#FF6B35]">
                    {program.age}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-[#0B1B3D]/65">
                    {program.description}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {program.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-[#0B1B3D]/80"
                      >
                        <Check
                          size={16}
                          className="mt-0.5 shrink-0 text-[#FF6B35]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0B1B3D] transition hover:text-[#FF6B35]"
                  >
                    En savoir plus
                    <ArrowRight size={15} />
                  </Link>

                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

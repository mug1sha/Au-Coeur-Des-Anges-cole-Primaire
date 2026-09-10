import { ShieldCheck, Palette, Apple } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/lib/animations";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Sécurité & Confort",
    description: "Un environnement sûr et adapté à chaque âge.",
  },
  {
    icon: Palette,
    title: "Éveil & Créativité",
    description: "Des activités ludiques pour développer les talents.",
  },
  {
    icon: Apple,
    title: "Nutrition Équilibrée",
    description: "Des repas sains pour une bonne croissance.",
  },
];

export default function Highlights() {
  return (
    <section className="relative z-10 -mt-5 px-5">
      <StaggerContainer className="mx-auto grid max-w-[1200px] gap-4 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <StaggerItem key={item.title}>
              <div className="group flex items-center gap-4 rounded-[18px] border border-slate-100 bg-white p-5 shadow-[0_10px_40px_rgba(11,27,61,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(11,27,61,0.12)]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-white transition duration-300 group-hover:scale-110">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-[#463ACB]/60">
                    {item.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}

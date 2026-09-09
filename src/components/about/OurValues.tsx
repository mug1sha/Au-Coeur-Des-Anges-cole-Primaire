import { Heart, Shield, Lightbulb, Users } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Bienveillance",
    description: "Chaque enfant mérite une attention respectueuse et chaleureuse, adaptée à sa personnalité unique.",
    color: "bg-rose-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
  },
  {
    icon: Shield,
    title: "Sécurité",
    description: "Créer un environnement dans lequel les enfants peuvent évoluer en toute sérénité et confiance.",
    color: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    icon: Lightbulb,
    title: "Épanouissement",
    description: "Encourager chaque enfant à découvrir ses talents, développer sa confiance et exprimer sa créativité.",
    color: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    icon: Users,
    title: "Partenariat",
    description: "Construire une relation de confiance et de collaboration entre l'école et les familles.",
    color: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
];

export default function OurValues() {
  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Nos valeurs
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            Ce en quoi nous croyons
          </h2>
          <p className="mt-3 text-[#0B1B3D]/60">
            Des valeurs qui guident chaque décision, chaque interaction, chaque journée.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="group rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(11,27,61,0.10)]"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${value.iconBg}`}>
                  <Icon size={22} className={value.iconColor} />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-extrabold text-[#0B1B3D]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#0B1B3D]/60">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

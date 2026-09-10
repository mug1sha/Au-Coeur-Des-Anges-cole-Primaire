import { Music, Scissors, Palette, BookOpen, MessageSquare, Bike } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/lib/animations";

const activities = [
  { icon: Music, title: "Éveil Musical", description: "Chants, rythmes et instruments pour éveiller la sensibilité artistique." },
  { icon: Scissors, title: "Arts & Bricolage", description: "Travaux manuels créatifs qui développent la motricité fine." },
  { icon: Palette, title: "Activités Créatives", description: "Peinture, dessin et expression libre pour stimuler l\u2019imagination." },
  { icon: BookOpen, title: "Jeux Éducatifs", description: "Jeux pédagogiques adaptés pour apprendre en s\u2019amusant." },
  { icon: MessageSquare, title: "Développement du Langage", description: "Histoires, poésies et conversations pour enrichir le vocabulaire." },
  { icon: Bike, title: "Activités Motrices", description: "Jeux de mouvement et exercices physiques adaptés à chaque âge." },
];

export default function ActivitiesSection() {
  return (
    <section className="bg-[#F8F9FA] px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Activités
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#463ACB] sm:text-4xl">
            Bien plus qu&apos;un programme scolaire
          </h2>
          <p className="mt-3 text-[#463ACB]/60">
            Des activités variées pour nourrir la curiosité et le développement global de chaque enfant.
          </p>
        </FadeUp>

        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <StaggerItem key={activity.title}>
                <div className="group rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(11,27,61,0.10)]">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B35]/10 transition duration-300 group-hover:bg-[#FF6B35]">
                    <Icon size={20} className="text-[#FF6B35] transition duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">{activity.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#463ACB]/60">{activity.description}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

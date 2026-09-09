import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="bg-[#F8F9FA] px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Ce qui nous guide
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            Notre mission & notre vision
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* MISSION */}
          <div className="relative overflow-hidden rounded-[24px] bg-[#0B1B3D] p-8 text-white">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[#FF6B35]/15" />
            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B35]">
                <Target size={22} />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold">
                Notre Mission
              </h3>
              <p className="mt-4 leading-7 text-white/75">
                Offrir à chaque enfant un environnement sécurisé, chaleureux et
                stimulant où il peut apprendre, grandir et développer sa
                personnalité dans le respect de son rythme et de ses besoins.
              </p>
              <div className="mt-6 h-[2px] w-12 rounded-full bg-[#FF6B35]" />
            </div>
          </div>

          {/* VISION */}
          <div className="relative overflow-hidden rounded-[24px] border border-[#FF6B35]/20 bg-white p-8">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#FF6B35]/5" />
            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B35]">
                <Eye size={22} className="text-white" />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#0B1B3D]">
                Notre Vision
              </h3>
              <p className="mt-4 leading-7 text-[#0B1B3D]/65">
                Accompagner chaque enfant dans ses premiers apprentissages en
                cultivant la curiosité, l&apos;autonomie, la confiance et le plaisir
                d&apos;apprendre — pour qu&apos;il devienne un être épanoui, créatif et
                confiant.
              </p>
              <div className="mt-6 h-[2px] w-12 rounded-full bg-[#FF6B35]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

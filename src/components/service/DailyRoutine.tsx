const routine = [
  { time: "07:00", label: "Accueil des enfants", desc: "Arrivée et installation en douceur" },
  { time: "08:00", label: "Jeux libres", desc: "Activités libres et exploration" },
  { time: "09:00", label: "Atelier d\u2019apprentissage", desc: "Activités pédagogiques encadrées" },
  { time: "10:30", label: "Pause & goûter", desc: "Collation équilibrée et repos" },
  { time: "11:00", label: "Activités créatives", desc: "Arts, musique ou motricité" },
  { time: "12:00", label: "Déjeuner", desc: "Repas sain servi à l\u2019école" },
  { time: "13:00", label: "Repos", desc: "Sieste ou temps calme" },
  { time: "15:00", label: "Activités après-midi", desc: "Jeux, sorties et ateliers" },
  { time: "16:30", label: "Départ", desc: "Retrouvailles avec les familles" },
];

export default function DailyRoutine() {
  return (
    <section className="bg-white px-5 py-20 md:px-8 lg:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#FF6B35]/10 px-4 py-2 text-xs font-bold text-[#FF6B35]">
            Une journée type
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-extrabold text-[#0B1B3D] sm:text-4xl">
            Une journée chez Au Coeur Des Anges
          </h2>
          <p className="mt-3 text-[#0B1B3D]/60">
            Un programme équilibré qui alterne apprentissage, créativité et repos.
          </p>
        </div>

        {/* VERTICAL TIMELINE (mobile) / GRID (desktop) */}
        <div className="mt-14">
          {/* Mobile: vertical */}
          <div className="relative lg:hidden">
            <div className="absolute left-[28px] top-0 h-full w-[2px] bg-[#FF6B35]/20" />
            <div className="space-y-6 pl-16">
              {routine.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[44px] flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B35] text-white shadow-md">
                    <span className="text-[9px] font-bold">{i + 1}</span>
                  </div>
                  <div className="rounded-[16px] border border-slate-100 bg-white p-4 shadow-sm">
                    <p className="text-xs font-bold text-[#FF6B35]">{item.time}</p>
                    <p className="mt-0.5 font-[family-name:var(--font-heading)] font-bold text-[#0B1B3D]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-[#0B1B3D]/55">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
            {routine.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#FF6B35]/30 hover:shadow-[0_12px_40px_rgba(11,27,61,0.10)]"
              >
                <div className="mb-3 inline-flex rounded-full bg-[#FF6B35]/10 px-3 py-1 text-xs font-bold text-[#FF6B35]">
                  {item.time}
                </div>
                <h3 className="font-[family-name:var(--font-heading)] font-bold text-[#0B1B3D]">
                  {item.label}
                </h3>
                <p className="mt-1.5 text-sm text-[#0B1B3D]/55">{item.desc}</p>
                <div className="mt-4 h-[2px] w-8 rounded-full bg-[#FF6B35]/30 transition-all duration-300 group-hover:w-full group-hover:bg-[#FF6B35]/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

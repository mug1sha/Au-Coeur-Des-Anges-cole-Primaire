"use client";

/**
 * Public-facing announcements page.
 *
 * Design:
 *  - Hero header with animated entrance
 *  - Pinned announcement shown prominently at top
 *  - Category filter bar
 *  - Announcement cards in a responsive grid
 *  - Announcement detail modal with safe HTML render
 *  - Fully accessible, no sensitive data exposed
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Calendar, Tag, Pin, X, ChevronRight,
  Clock, Search, AlertCircle, BookOpen, Users,
  CheckSquare, Sparkles,
} from "lucide-react";
import type { Announcement, AnnouncementCategory } from "@/lib/admin-types";
import { ANNOUNCEMENT_CATEGORY_LABELS } from "@/lib/admin-types";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const CATEGORY_CONFIG: Record<AnnouncementCategory, {
  label: string;
  icon: React.ElementType;
  accentBg: string;
  accentText: string;
  pill: string;
}> = {
  general:   { label: "Général",     icon: Megaphone,  accentBg: "bg-slate-100",   accentText: "text-slate-700",   pill: "bg-slate-100 text-slate-700 hover:bg-slate-200" },
  academic:  { label: "Académique",  icon: BookOpen,   accentBg: "bg-blue-50",     accentText: "text-blue-700",    pill: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
  event:     { label: "Événement",   icon: Sparkles,   accentBg: "bg-emerald-50",  accentText: "text-emerald-700", pill: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  important: { label: "Important",   icon: AlertCircle,accentBg: "bg-red-50",      accentText: "text-red-700",     pill: "bg-red-50 text-red-700 hover:bg-red-100" },
  parents:   { label: "Parents",     icon: Users,      accentBg: "bg-amber-50",    accentText: "text-amber-700",   pill: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

/**
 * Minimal HTML sanitiser — strips dangerous tags and attributes
 * before rendering user HTML in the public view.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+\s*=\s*(['"])[^'"]*\1/gi, "")
    .replace(/javascript:/gi, "");
}

// ─────────────────────────────────────────────
// CATEGORY PILL
// ─────────────────────────────────────────────
function CatPill({ category }: { category: AnnouncementCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.accentBg} ${cfg.accentText}`}>
      <Icon size={10} aria-hidden />
      {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// ANNOUNCEMENT DETAIL MODAL
// ─────────────────────────────────────────────
function AnnouncementModal({ ann, onClose }: { ann: Announcement; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ann-modal-title"
    >
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[24px] bg-white shadow-2xl"
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-sm transition hover:bg-black/20"
        >
          <X size={16} />
        </button>

        {/* Cover */}
        {ann.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ann.coverImage}
            alt={ann.title}
            className="h-52 w-full rounded-t-[24px] object-cover"
          />
        ) : (
          <div className={`flex h-32 items-center justify-center rounded-t-[24px] ${CATEGORY_CONFIG[ann.category].accentBg}`}>
            {(() => {
              const Icon = CATEGORY_CONFIG[ann.category].icon;
              return <Icon size={36} className={`${CATEGORY_CONFIG[ann.category].accentText} opacity-30`} aria-hidden />;
            })()}
          </div>
        )}

        <div className="px-7 pb-8 pt-5">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <CatPill category={ann.category} />
            {ann.pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6B35]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF6B35]">
                <Pin size={9} aria-hidden /> Épinglée
              </span>
            )}
          </div>

          {/* Title */}
          <h2
            id="ann-modal-title"
            className="font-[family-name:var(--font-heading)] text-2xl font-extrabold leading-snug text-[#463ACB]"
          >
            {ann.title}
          </h2>

          {/* Meta */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} aria-hidden />
              {formatDate(ann.publishedAt ?? ann.createdAt)}
            </span>
            {ann.expiresAt && (
              <span className="flex items-center gap-1.5">
                <Clock size={12} aria-hidden />
                Valide jusqu&apos;au {formatDate(ann.expiresAt)}
              </span>
            )}
          </div>

          {/* Excerpt */}
          {ann.excerpt && (
            <p className="mt-4 rounded-xl border-l-4 border-[#FF6B35] bg-slate-50 px-4 py-3 text-sm font-medium italic text-slate-600 leading-relaxed">
              {ann.excerpt}
            </p>
          )}

          {/* Content — sanitised HTML */}
          <div
            className="ann-content mt-5 text-sm leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(ann.content) }}
          />
        </div>
      </motion.div>

      {/* Scoped styles for rich content */}
      <style>{`
        .ann-content h2 { font-size: 1.15rem; font-weight: 700; margin: 1rem 0 0.4rem; color: #463ACB; }
        .ann-content h3 { font-size: 1rem; font-weight: 600; margin: 0.8rem 0 0.3rem; color: #463ACB; }
        .ann-content p  { margin-bottom: 0.6rem; }
        .ann-content ul { list-style: disc; padding-left: 1.4rem; margin: 0.5rem 0; }
        .ann-content ol { list-style: decimal; padding-left: 1.4rem; margin: 0.5rem 0; }
        .ann-content li { margin-bottom: 0.25rem; }
        .ann-content blockquote {
          border-left: 3px solid #FF6B35; padding-left: 1rem;
          margin: 0.75rem 0; color: #64748b; font-style: italic;
        }
        .ann-content strong { font-weight: 700; }
        .ann-content em     { font-style: italic; }
        .ann-content a      { color: #FF6B35; text-decoration: underline; }
      `}</style>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// ANNOUNCEMENT CARD
// ─────────────────────────────────────────────
function AnnouncementCard({
  ann, index, onClick,
}: { ann: Announcement; index: number; onClick: () => void }) {
  const catCfg = CATEGORY_CONFIG[ann.category];
  const excerpt = ann.excerpt || stripHtml(ann.content).slice(0, 140) + (stripHtml(ann.content).length > 140 ? "…" : "");

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`Lire l'annonce : ${ann.title}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50"
    >
      {/* Cover or placeholder */}
      {ann.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ann.coverImage}
          alt=""
          aria-hidden="true"
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div className={`flex h-32 items-center justify-center ${catCfg.accentBg} transition duration-300 group-hover:brightness-95`}>
          {(() => {
            const Icon = catCfg.icon;
            return <Icon size={32} className={`${catCfg.accentText} opacity-25`} aria-hidden />;
          })()}
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <CatPill category={ann.category} />
          {ann.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6B35]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FF6B35]">
              <Pin size={8} aria-hidden /> Épinglée
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-2.5 font-[family-name:var(--font-heading)] text-base font-bold leading-snug text-[#463ACB] group-hover:text-[#FF6B35] transition-colors line-clamp-2">
          {ann.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-slate-500">{excerpt}</p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Calendar size={11} aria-hidden />
            {formatDate(ann.publishedAt ?? ann.createdAt)}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#FF6B35] opacity-0 transition-opacity group-hover:opacity-100">
            Lire <ChevronRight size={13} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────
// PINNED BANNER
// ─────────────────────────────────────────────
function PinnedBanner({ ann, onClick }: { ann: Announcement; onClick: () => void }) {
  const catCfg = CATEGORY_CONFIG[ann.category];
  const Icon = catCfg.icon;
  const excerpt = ann.excerpt || stripHtml(ann.content).slice(0, 180) + "…";

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      aria-label={`Annonce épinglée : ${ann.title}`}
      className="group cursor-pointer overflow-hidden rounded-[20px] border border-[#FF6B35]/20 bg-gradient-to-r from-[#FF6B35]/5 to-[#FF6B35]/10 p-5 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 md:flex md:items-stretch md:gap-0"
    >
      {/* Left cover */}
      {ann.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ann.coverImage}
          alt=""
          aria-hidden
          className="mb-4 h-40 w-full rounded-xl object-cover md:mb-0 md:h-auto md:w-56 md:shrink-0 md:rounded-r-none md:rounded-l-xl"
        />
      )}

      <div className={`flex flex-1 flex-col justify-center ${ann.coverImage ? "md:px-6" : ""}`}>
        {/* Top badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B35] px-3 py-1 text-[11px] font-bold text-white">
            <Pin size={9} /> Épinglée
          </span>
          <CatPill category={ann.category} />
        </div>

        <h2 className="font-[family-name:var(--font-heading)] text-xl font-extrabold leading-snug text-[#463ACB] group-hover:text-[#FF6B35] transition-colors md:text-2xl">
          {ann.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{excerpt}</p>

        <div className="mt-4 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar size={12} /> {formatDate(ann.publishedAt ?? ann.createdAt)}
          </span>
          <span className="ml-auto flex items-center gap-1 text-sm font-bold text-[#FF6B35]">
            Lire l&apos;annonce <ChevronRight size={15} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// MAIN CLIENT COMPONENT
// ─────────────────────────────────────────────
interface Props {
  initialAnnouncements: Announcement[];
}

export default function AnnouncementsPublicClient({ initialAnnouncements }: Props) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<AnnouncementCategory | "all">("all");
  const [selected, setSelected] = useState<Announcement | null>(null);

  // Separate pinned from rest
  const pinned = initialAnnouncements.find((a) => a.pinned);
  const rest = initialAnnouncements.filter((a) => !a.pinned);

  // All for filter counting (pinned included)
  const all = initialAnnouncements;

  const filtered = useMemo(() => {
    const pool = catFilter === "all" ? all : all.filter((a) => a.category === catFilter);
    if (!search.trim()) return pool.filter((a) => !a.pinned);
    const q = search.toLowerCase();
    return pool.filter((a) =>
      !a.pinned &&
      [a.title, a.excerpt ?? "", stripHtml(a.content)].some((v) => v.toLowerCase().includes(q))
    );
  }, [all, catFilter, search]);

  const categoriesWithCount = useMemo(() => {
    const counts: Record<string, number> = { all: all.length };
    all.forEach((a) => {
      counts[a.category] = (counts[a.category] ?? 0) + 1;
    });
    return counts;
  }, [all]);

  // Show pinned when no active filter/search
  const showPinned = pinned && !search && catFilter === "all";

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#463ACB] pb-24 pt-28">
        {/* Organic shape */}
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#FF6B35]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-[#FF6B35]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1200px] px-5 text-center md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/10 px-4 py-1.5 text-xs font-semibold text-[#FF6B35] mb-5"
          >
            <Megaphone size={13} /> Annonces & Actualités
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-[family-name:var(--font-heading)] text-3xl font-extrabold text-white sm:text-4xl md:text-5xl"
          >
            Restez informés
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="mx-auto mt-4 max-w-lg text-base text-white/70"
          >
            Informations, événements et actualités de l&apos;école Au Coeur Des Anges.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.5 }}
            className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-[16px] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md"
          >
            <Search size={16} className="shrink-0 text-white/50" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une annonce…"
              aria-label="Rechercher une annonce"
              className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="mx-auto max-w-[1200px] px-5 py-12 md:px-8 md:py-16">

        {/* Category filter */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCatFilter("all")}
            aria-pressed={catFilter === "all"}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              catFilter === "all"
                ? "border-[#FF6B35] bg-[#FF6B35] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#FF6B35]/30 hover:text-[#FF6B35]"
            }`}
          >
            Toutes ({categoriesWithCount.all})
          </button>
          {(Object.keys(ANNOUNCEMENT_CATEGORY_LABELS) as AnnouncementCategory[]).map((k) => {
            if (!categoriesWithCount[k]) return null;
            const cfg = CATEGORY_CONFIG[k];
            return (
              <button
                key={k}
                onClick={() => setCatFilter(k)}
                aria-pressed={catFilter === k}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  catFilter === k
                    ? `border-transparent ${cfg.accentBg} ${cfg.accentText}`
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {cfg.label} ({categoriesWithCount[k]})
              </button>
            );
          })}
        </div>

        {/* Pinned announcement */}
        <AnimatePresence>
          {showPinned && pinned && (
            <motion.div
              key="pinned"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <PinnedBanner ann={pinned} onClick={() => setSelected(pinned)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {all.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Megaphone size={26} className="text-slate-300" aria-hidden />
            </div>
            <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#463ACB]">
              Aucune annonce pour le moment
            </p>
            <p className="mt-2 max-w-xs text-sm text-slate-400">
              Revenez bientôt pour les dernières nouvelles de l&apos;école.
            </p>
          </div>
        ) : filtered.length === 0 && !showPinned ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Search size={22} className="text-slate-300" aria-hidden />
            </div>
            <p className="font-[family-name:var(--font-heading)] font-bold text-[#463ACB]">
              Aucun résultat
            </p>
            <p className="mt-1 text-sm text-slate-400">Essayez un autre terme de recherche.</p>
            <button
              onClick={() => { setSearch(""); setCatFilter("all"); }}
              className="mt-3 text-sm font-medium text-[#FF6B35] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ann, i) => (
              <AnnouncementCard
                key={ann.id}
                ann={ann}
                index={i}
                onClick={() => setSelected(ann)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selected && (
          <AnnouncementModal ann={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Bell, Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { getAdminSession, adminLogout, type AdminSession } from "@/lib/admin-auth";

// ─────────────────────────────────────────────
// PAGE TITLE MAP
// ─────────────────────────────────────────────
const PAGE_TITLES: Record<string, { title: string; breadcrumb: string[] }> = {
  "/admin": { title: "Tableau de bord", breadcrumb: ["Administration"] },
  "/admin/services": { title: "Services", breadcrumb: ["Administration", "École"] },
  "/admin/teachers": { title: "Enseignants", breadcrumb: ["Administration", "École"] },
  "/admin/gallery": { title: "Galerie", breadcrumb: ["Administration", "École"] },
  "/admin/announcements": { title: "Annonces", breadcrumb: ["Administration", "Communication"] },
  "/admin/website": { title: "Contenu du site", breadcrumb: ["Administration", "Communication"] },
  "/admin/finance/revenues": { title: "Revenus", breadcrumb: ["Administration", "Finance"] },
  "/admin/finance/expenses": { title: "Dépenses", breadcrumb: ["Administration", "Finance"] },
  "/admin/finance/accounting": { title: "Comptabilité", breadcrumb: ["Administration", "Finance"] },
  "/admin/finance/reports": { title: "Rapports financiers", breadcrumb: ["Administration", "Finance"] },
  "/admin/users": { title: "Utilisateurs & Rôles", breadcrumb: ["Administration"] },
  "/admin/activity": { title: "Journal d'activité", breadcrumb: ["Administration"] },
  "/admin/settings": { title: "Paramètres", breadcrumb: ["Administration"] },
};

// ─────────────────────────────────────────────
// PROFILE DROPDOWN
// ─────────────────────────────────────────────
function ProfileDropdown({ session }: { session: AdminSession | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const name = session?.name ?? "Administrateur";
  const email = session?.email ?? "";
  const role = session?.role ?? "admin";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const ROLE_LABELS: Record<string, string> = {
    super_admin: "Super Administrateur",
    admin: "Administrateur",
    teacher: "Enseignant",
    accountant: "Comptable",
    parent: "Parent",
  };

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6B35] text-xs font-bold text-white">
          {initials}
        </div>
        <div className="hidden flex-col items-start leading-none lg:flex">
          <span className="max-w-[100px] truncate text-xs font-semibold text-[#463ACB]">{name}</span>
          <span className="text-[10px] text-slate-400">{ROLE_LABELS[role] ?? role}</span>
        </div>
        <ChevronDown
          size={13}
          className={`hidden text-slate-400 transition-transform lg:block ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-[16px] border border-slate-200 bg-white shadow-xl">
          {/* User info header */}
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-bold text-[#463ACB]">{name}</p>
            <p className="truncate text-xs text-slate-400">{email}</p>
            <p className="mt-1 inline-flex items-center rounded-full bg-[#FF6B35]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FF6B35]">
              {ROLE_LABELS[role] ?? role}
            </p>
          </div>

          {/* Menu items */}
          <div className="p-1.5">
            <button
              onClick={() => { setOpen(false); router.push("/admin/settings"); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <User size={15} className="shrink-0 text-slate-400" />
              Mon profil
            </button>
            <button
              onClick={() => { setOpen(false); router.push("/admin/settings"); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <Settings size={15} className="shrink-0 text-slate-400" />
              Paramètres
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-slate-100 p-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={15} className="shrink-0" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// NOTIFICATIONS BUTTON
// ─────────────────────────────────────────────
function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const MOCK_NOTIFS = [
    { id: "n1", title: "Nouveau paiement reçu", time: "il y a 5 min", unread: true },
    { id: "n2", title: "Annonce en attente de publication", time: "il y a 1h", unread: true },
    { id: "n3", title: "Rapport mensuel disponible", time: "il y a 3h", unread: false },
  ];

  const unreadCount = MOCK_NOTIFS.filter((n) => n.unread).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ""}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6B35] px-0.5 text-[9px] font-bold text-white leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-[16px] border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-bold text-[#463ACB]">Notifications</p>
          </div>
          <ul>
            {MOCK_NOTIFS.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-3 border-b border-slate-50 px-4 py-3 transition last:border-0 hover:bg-slate-50/70 ${n.unread ? "bg-[#FF6B35]/[0.03]" : ""}`}
              >
                {n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#FF6B35]" />}
                {!n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-transparent" />}
                <div className="min-w-0">
                  <p className={`text-sm ${n.unread ? "font-semibold text-[#463ACB]" : "text-slate-600"}`}>
                    {n.title}
                  </p>
                  <p className="text-[11px] text-slate-400">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-2">
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-xl py-2 text-xs font-medium text-[#FF6B35] hover:bg-[#FF6B35]/5 transition"
            >
              Tout marquer comme lu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN HEADER EXPORT
// ─────────────────────────────────────────────
export default function AdminHeader({ onMenuClick, session }: { onMenuClick: () => void; session: AdminSession | null }) {
  const pathname = usePathname();
  const meta = PAGE_TITLES[pathname] ?? { title: "Administration", breadcrumb: ["Administration"] };

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur-md md:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu size={18} />
      </button>

      {/* Title + breadcrumb */}
      <div className="min-w-0">
        <h1 className="truncate font-[family-name:var(--font-heading)] text-[17px] font-bold text-[#463ACB] leading-tight">
          {meta.title}
        </h1>
        <nav aria-label="Fil d'Ariane" className="hidden sm:block">
          <ol className="flex items-center gap-1 text-[11px] text-slate-400">
            {meta.breadcrumb.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <span aria-hidden>/</span>}
                <span className={i === meta.breadcrumb.length - 1 ? "font-medium text-[#FF6B35]" : ""}>
                  {crumb}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-[#FF6B35] focus-within:ring-2 focus-within:ring-[#FF6B35]/20 sm:flex">
          <Search size={13} className="shrink-0 text-slate-400" />
          <input
            type="search"
            placeholder="Rechercher…"
            aria-label="Recherche globale"
            className="w-36 bg-transparent text-sm text-[#463ACB] outline-none placeholder:text-slate-400 lg:w-48"
          />
        </div>

        {/* Notifications */}
        <NotificationsButton />

        {/* Profile */}
        <ProfileDropdown session={session} />
      </div>
    </header>
  );
}

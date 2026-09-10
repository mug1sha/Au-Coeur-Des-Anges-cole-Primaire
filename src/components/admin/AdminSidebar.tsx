"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Settings, Users, Activity, ChevronLeft, ChevronRight,
  BookOpen, GraduationCap, Image as ImageIcon, Megaphone, Globe,
  TrendingUp, TrendingDown, Calculator, BarChart3, LogOut, X,
} from "lucide-react";
import { getAdminSession, adminLogout } from "@/lib/admin-auth";
import { ROLE_PERMISSIONS } from "@/lib/admin-types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** Permission resource key required to show this item. '*' = always visible. */
  resource: string;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    heading: "TABLEAU DE BORD",
    items: [
      { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard, resource: "dashboard" },
    ],
  },
  {
    heading: "ÉCOLE",
    items: [
      { label: "Services", href: "/admin/services", icon: BookOpen, resource: "services" },
      { label: "Enseignants", href: "/admin/teachers", icon: GraduationCap, resource: "teachers" },
      { label: "Galerie", href: "/admin/gallery", icon: ImageIcon, resource: "gallery" },
    ],
  },
  {
    heading: "COMMUNICATION",
    items: [
      { label: "Annonces", href: "/admin/announcements", icon: Megaphone, resource: "announcements" },
      { label: "Contenu du site", href: "/admin/website", icon: Globe, resource: "website" },
    ],
  },
  {
    heading: "FINANCE",
    items: [
      { label: "Revenus", href: "/admin/finance/revenues", icon: TrendingUp, resource: "finance" },
      { label: "Dépenses", href: "/admin/finance/expenses", icon: TrendingDown, resource: "finance" },
      { label: "Comptabilité", href: "/admin/finance/accounting", icon: Calculator, resource: "finance" },
      { label: "Rapports", href: "/admin/finance/reports", icon: BarChart3, resource: "finance" },
    ],
  },
  {
    heading: "ADMINISTRATION",
    items: [
      { label: "Utilisateurs", href: "/admin/users", icon: Users, resource: "users" },
      { label: "Journal d'activité", href: "/admin/activity", icon: Activity, resource: "activity" },
      { label: "Paramètres", href: "/admin/settings", icon: Settings, resource: "settings" },
    ],
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AdminSidebar({ open, onClose, collapsed, onToggleCollapse }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* DESKTOP sidebar — fixed */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-full flex-col border-r border-slate-200/80 bg-white transition-all duration-300 lg:flex ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          isActive={isActive}
          onClose={onClose}
          isMobile={false}
        />
      </aside>

      {/* MOBILE drawer */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-[280px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          collapsed={false}
          onToggleCollapse={onToggleCollapse}
          isActive={isActive}
          onClose={onClose}
          isMobile={true}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  collapsed,
  onToggleCollapse,
  isActive,
  onClose,
  isMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isActive: (href: string) => boolean;
  onClose: () => void;
  isMobile: boolean;
}) {
  const router = useRouter();
  const session = getAdminSession();
  const initials = session?.name
    ? session.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "A";

  // ── Role-based nav filtering ─────────────
  // A user can see a nav item if their role has the '*' wildcard permission,
  // or explicitly has the resource permission for that item.
  const userPerms = session ? (ROLE_PERMISSIONS[session.role] ?? []) : [];
  const hasWildcard = userPerms.includes("*");

  const filteredGroups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      hasWildcard || userPerms.includes(item.resource)
    ),
  })).filter((group) => group.items.length > 0);

  function handleLogout() {
    adminLogout();
    router.push("/admin/login");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* LOGO */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-slate-100 ${
          collapsed ? "justify-center px-2" : "gap-3 px-5"
        }`}
      >
        <div className="relative h-9 w-9 shrink-0">
          <Image src="/images/logo.png" alt="Au Coeur Des Anges" fill className="object-contain" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-[family-name:var(--font-heading)] text-sm font-bold text-[#463ACB]">
              Au Coeur Des Anges
            </p>
            <p className="text-[10px] text-slate-400">Administration</p>
          </div>
        )}
        {isMobile && (
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto py-4" aria-label="Navigation principale">
        {filteredGroups.map((group) => (
          <div key={group.heading} className="mb-2">
            {!collapsed && (
              <p className="mb-1 px-5 text-[10px] font-semibold tracking-wider text-slate-400">
                {group.heading}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={isMobile ? onClose : undefined}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  className={`mx-2 mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-150 ${
                    active
                      ? "bg-[#FF6B35]/10 text-[#FF6B35]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[#463ACB]"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {active && !collapsed && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
                  )}
                </Link>
              );
            })}
            {!collapsed && <div className="mx-5 mt-2 border-b border-slate-100" />}
          </div>
        ))}
      </nav>

      {/* BOTTOM — user + logout */}
      <div className="shrink-0 border-t border-slate-100 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF6B35] text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#463ACB]">
                {session?.name ?? "Admin"}
              </p>
              <p className="truncate text-xs text-slate-400">{session?.role ?? "admin"}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-[#FF6B35] transition"
              title="Déconnexion"
              aria-label="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#FF6B35] text-sm font-bold text-white"
            title="Déconnexion"
            aria-label="Se déconnecter"
          >
            {initials}
          </button>
        )}

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-1.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label={collapsed ? "Développer le menu" : "Réduire le menu"}
          >
            {collapsed ? (
              <ChevronRight size={14} />
            ) : (
              <>
                <ChevronLeft size={14} />
                <span>Réduire</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

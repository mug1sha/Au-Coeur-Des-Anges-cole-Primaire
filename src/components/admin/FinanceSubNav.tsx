"use client";

/**
 * FinanceSubNav — active-tab aware navigation for the finance section.
 * This must be a Client Component to use usePathname().
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Calculator,
  BarChart3,
} from "lucide-react";

const FINANCE_TABS = [
  { href: "/admin/finance",            label: "Vue d'ensemble", icon: LayoutGrid  },
  { href: "/admin/finance/revenues",   label: "Revenus",        icon: TrendingUp  },
  { href: "/admin/finance/expenses",   label: "Dépenses",       icon: TrendingDown },
  { href: "/admin/finance/accounting", label: "Comptabilité",   icon: Calculator  },
  { href: "/admin/finance/reports",    label: "Rapports",       icon: BarChart3   },
] as const;

export default function FinanceSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-6 flex gap-1 overflow-x-auto rounded-[20px] border border-slate-100 bg-white p-1.5 shadow-sm"
      aria-label="Navigation finance"
    >
      {FINANCE_TABS.map((tab) => {
        const isActive =
          tab.href === "/admin/finance"
            ? pathname === "/admin/finance"
            : pathname.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2 rounded-[14px] px-4 py-2 text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-[#FF6B35] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#0B1B3D]"
            }`}
          >
            <Icon size={15} className="shrink-0" />
            <span className="hidden sm:inline">{tab.label}</span>
            {/* Short label on mobile */}
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Finance sub-layout — wraps all /admin/finance/* pages.
 *
 * Renders:
 *   - FinanceSubNav: active-tab navigation tabs (Client Component)
 *   - Page content
 *
 * This layout is a Server Component.
 * The active-tab logic lives in FinanceSubNav (Client Component)
 * which uses usePathname() for tab highlighting.
 */

import FinanceSubNav from "@/components/admin/FinanceSubNav";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <FinanceSubNav />
      {children}
    </div>
  );
}

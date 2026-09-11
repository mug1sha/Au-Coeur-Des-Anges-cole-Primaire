/**
 * Auth layout — wraps /admin/login (and any future auth pages).
 *
 * This layout intentionally contains NO dashboard chrome:
 * no sidebar, no header, no session provider, no navigation.
 * It is a pure pass-through that simply sets the html bg colour
 * so the login page looks clean on all screens.
 */
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {children}
    </div>
  );
}

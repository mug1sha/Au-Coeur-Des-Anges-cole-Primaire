"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getAdminSession, type AdminSession } from "@/lib/admin-auth";

interface SessionContextValue {
  session: AdminSession | null;
  loading: boolean;
  refresh: () => void;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  loading: false,
  refresh: () => {},
});

export function AdminSessionProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: AdminSession | null;
}) {
  // If an initial session was provided server-side, start with it — no loading needed.
  const [session, setSession] = useState<AdminSession | null>(initial ?? null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getAdminSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Only fetch client-side if no server-side session was provided.
    // This prevents the double-render spinner on every admin page.
    if (initial === undefined || initial === null) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, refresh: load }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useAdminSession() {
  return useContext(SessionContext);
}

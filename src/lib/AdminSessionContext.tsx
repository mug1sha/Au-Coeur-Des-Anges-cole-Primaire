"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAdminSession, type AdminSession } from "@/lib/admin-auth";

interface SessionContextValue {
  session: AdminSession | null;
  loading: boolean;
  refresh: () => void;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  loading: true,
  refresh: () => {},
});

export function AdminSessionProvider({ children, initial }: { children: ReactNode; initial?: AdminSession | null }) {
  const [session, setSession] = useState<AdminSession | null>(initial ?? null);
  const [loading, setLoading] = useState(!initial);

  function load() {
    setLoading(true);
    getAdminSession().then((s) => {
      setSession(s);
      setLoading(false);
    });
  }

  useEffect(() => {
    if (!initial) load();
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

import React, { createContext, useContext, useEffect, useState } from "react";
import { AUTH_EMAIL_KEY, AUTH_EXPIRES_KEY, AUTH_KEY, SESSION_MS, clearStored, readSession, writeSession } from "@/lib/session";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState(() => readSession());
  const [memorySession, setMemorySession] = useState<{ email: string; expiresAt: number } | null>(null);
  const current = session ?? memorySession;
  const isAuthenticated = current !== null;
  const expiresAt = current?.expiresAt;

  // Another tab logged in or out: follow it. `key === null` is a clear() of the whole store.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === AUTH_KEY || e.key === AUTH_EMAIL_KEY || e.key === AUTH_EXPIRES_KEY) setSession(readSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Sign out when the session runs out while the tab is open.
  useEffect(() => {
    if (expiresAt === undefined) return;
    const id = window.setTimeout(() => {
      clearStored();
      setSession(null);
      setMemorySession(null);
    }, Math.max(0, expiresAt - Date.now()));
    return () => window.clearTimeout(id);
  }, [expiresAt]);

  const login = (email: string) => {
    const next = { email, expiresAt: Date.now() + SESSION_MS };
    writeSession(next.email, next.expiresAt);
    const stored = readSession();
    setSession(stored);
    // Storage unavailable: readSession finds nothing, so keep the login in memory for this page load only.
    setMemorySession(stored ? null : next);
  };

  const logout = () => {
    clearStored();
    setSession(null);
    setMemorySession(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

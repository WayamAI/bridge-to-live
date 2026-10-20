import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const AUTH_KEY = "wayam-auth";
export const AUTH_EMAIL_KEY = "wayam-auth-email";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// The session lives in localStorage so every tab shares it and a logout in one tab signs out all of them.
// Storage can throw (private window, blocked site data); then the session lasts only for this page load.
function readAuth(): boolean {
  try {
    return window.localStorage.getItem(AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

function writeAuth(email: string | null) {
  try {
    if (email === null) {
      window.localStorage.removeItem(AUTH_KEY);
      window.localStorage.removeItem(AUTH_EMAIL_KEY);
    } else {
      window.localStorage.setItem(AUTH_KEY, "true");
      window.localStorage.setItem(AUTH_EMAIL_KEY, email);
    }
  } catch {
    /* keep the in-memory state only */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuth);

  // Another tab logged in or out: follow it. `key === null` is a clear() of the whole store.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === AUTH_KEY) setIsAuthenticated(readAuth());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (email: string) => {
    writeAuth(email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    writeAuth(null);
    setIsAuthenticated(false);
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

import React, { createContext, useContext, useState } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const STORAGE_KEY = "wayam-auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getInitialAuth(): boolean {
  if (typeof window === "undefined") return false;
  // Clear out any stale persisted login from before auth was session-scoped.
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem("wayam-auth-email");
  return window.sessionStorage.getItem(STORAGE_KEY) === "true";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuth);

  const login = (email: string) => {
    window.sessionStorage.setItem(STORAGE_KEY, "true");
    window.sessionStorage.setItem("wayam-auth-email", email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem("wayam-auth-email");
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

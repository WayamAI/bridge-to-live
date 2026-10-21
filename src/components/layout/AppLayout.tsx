import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { locate } from "./nav";
import type { Alert, UserRole } from "@/hooks/usePlantData";

interface AppLayoutProps {
  alerts: Alert[];
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  breadcrumb?: string;
}

const AppLayout = ({ alerts, userRole, onRoleChange, breadcrumb }: AppLayoutProps) => {
  // Layout-only state: rail width (expanded by default on desktop) and the off-canvas drawer below lg.
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // Document title: the page's name from nav.ts, then the product.
  useEffect(() => {
    document.title = `${locate(pathname).title} · PlantMind`;
  }, [pathname]);

  // The off-canvas sidebar closes after navigating.
  useEffect(() => setMobileOpen(false), [pathname]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    // Fixed-viewport shell: the document never scrolls, <main> does.
    <div className="flex h-screen w-full overflow-hidden bg-page">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/50 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-active lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        alerts={alerts}
        userRole={userRole}
        expanded={expanded}
        onToggleExpanded={() => setExpanded((v) => !v)}
        mobileOpen={mobileOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar userRole={userRole} onRoleChange={onRoleChange} breadcrumb={breadcrumb} onOpenNav={() => setMobileOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

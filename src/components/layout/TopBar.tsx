import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, ChevronDown, Sun, Moon, LogOut, Menu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/hooks/usePlantData";
import { locate } from "./nav";
import { formatTime } from "@/lib/format";

const ROLE_LABELS: Record<UserRole, string> = {
  plant_director: "Plant Director",
  operations_engineer: "Operations Engineer",
  reliability_engineer: "Reliability Engineer",
  maintenance_manager: "Maintenance Manager",
  energy_manager: "Energy Manager",
  security_analyst: "IT/OT Security Analyst",
  handover_manager: "Handover Manager",
};

const iconBtn =
  "flex size-8 shrink-0 items-center justify-center rounded-full bg-action text-tertiary outline-none transition-colors duration-[180ms] hover:bg-raised-2 hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-active";

interface TopBarProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  breadcrumb?: string;
  onOpenNav: () => void;
}

const TopBar = ({ userRole, onRoleChange, onOpenNav }: TopBarProps) => {
  const [time, setTime] = useState(new Date());
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { group, title } = locate(pathname);

  const handleLogout = () => {
    setShowRoleMenu(false);
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="shrink-0">
    <header className="relative z-30 flex h-14 items-center justify-between gap-3 border-b border-hairline bg-page px-4 sm:px-5">
      {/* Location: group eyebrow (no breadcrumbs in Chronus). The h1 is the page's only h1; the visible title is the PageHeader h2. */}
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" aria-label="Open navigation" onClick={onOpenNav} className={`${iconBtn} lg:hidden`}>
          <Menu className="size-4" aria-hidden />
        </button>
        <h1 className="sr-only">{title}</h1>
        {group && <div className="type-eyebrow hidden truncate text-quaternary sm:block" aria-hidden>{group}</div>}
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        {/* Live state: a quiet dot and text (replaces the pulsing icon) */}
        <div className="type-label-sm flex items-center gap-1.5 text-success">
          <span className="size-1.5 rounded-full bg-success" aria-hidden />
          Live
        </div>
        <span className="type-body-sm tabular hidden text-tertiary md:inline">
          {formatTime(time)} IST
        </span>
        <span className="type-body-sm tabular hidden text-tertiary lg:inline">
          42,400 tags active
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className={iconBtn}
        >
          {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
        </button>

        {/* Role selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            aria-haspopup="menu"
            aria-expanded={showRoleMenu}
            aria-label={`Role: ${ROLE_LABELS[userRole]}`}
            className="flex items-center gap-2 rounded-full bg-action py-0.5 pl-0.5 pr-0.5 outline-none transition-colors duration-[180ms] hover:bg-raised-2 focus-visible:ring-2 focus-visible:ring-active md:pr-3"
          >
            <span className="grid size-7 place-items-center rounded-full bg-raised-2 text-tertiary">
              <User className="size-3.5" aria-hidden />
            </span>
            <span className="type-label-sm hidden text-foreground md:inline">{ROLE_LABELS[userRole]}</span>
            <ChevronDown className="hidden size-3 text-quaternary md:block" aria-hidden />
          </button>
          {showRoleMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
              <div role="menu" className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 rounded-lg border border-hairline bg-container p-2 shadow-lg">
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    role="menuitem"
                    onClick={() => { onRoleChange(key as UserRole); setShowRoleMenu(false); }}
                    className={`type-label-sm w-full rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-raised hover:text-foreground ${
                      key === userRole ? "bg-raised text-foreground" : "text-secondary-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <div className="my-1 border-t border-hairline" />
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="type-label-sm flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-error transition-colors duration-150 hover:bg-raised"
                >
                  <LogOut className="size-3.5" aria-hidden />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
    {/* Below lg the clock (below md) and tag count sit on a quiet second line instead of being hidden. */}
    <div className="type-body-sm tabular flex h-7 items-center gap-3 border-b border-hairline bg-page px-4 text-quaternary sm:px-5 lg:hidden">
      <span className="md:hidden">{formatTime(time)} IST</span>
      <span>42,400 tags active</span>
    </div>
    </div>
  );
};

export default TopBar;

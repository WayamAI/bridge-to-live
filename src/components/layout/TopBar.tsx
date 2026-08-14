import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Radio, User, ChevronDown, Sun, Moon, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/hooks/usePlantData";

const ROLE_LABELS: Record<UserRole, string> = {
  plant_director: "Plant Director",
  operations_engineer: "Operations Engineer",
  reliability_engineer: "Reliability Engineer",
  maintenance_manager: "Maintenance Manager",
  energy_manager: "Energy Manager",
  security_analyst: "IT/OT Security Analyst",
  handover_manager: "Handover Manager",
};

interface TopBarProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  breadcrumb?: string;
}

const TopBar = ({ userRole, onRoleChange, breadcrumb }: TopBarProps) => {
  const [time, setTime] = useState(new Date());
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

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
    <header className="h-11 border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {breadcrumb ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Logo size={62} showText={false} />
            <span>/</span>
            <span>{breadcrumb}</span>
          </div>
        ) : (
          <Logo size={62} showText={false} />
        )}
      </div>
      <div className="flex items-center gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-operational">
          <Radio className="w-3 h-3 animate-pulse-glow" />
          LIVE
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          {time.toLocaleTimeString()} IST
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          42,400 tags active
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Role selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-3 h-3 text-primary" />
            </div>
            <span className="text-foreground font-medium hidden md:inline">{ROLE_LABELS[userRole]}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {showRoleMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-popover border border-border rounded-lg shadow-xl z-50 py-1">
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { onRoleChange(key as UserRole); setShowRoleMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${
                      key === userRole ? "text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-1.5 text-left px-3 py-1.5 text-xs text-destructive hover:bg-muted transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;

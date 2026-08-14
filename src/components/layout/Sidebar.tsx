import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Activity, Cpu, AlertTriangle, Wrench, Zap,
  Shield, ArrowRightLeft, Database, Settings, ChevronLeft, ChevronRight,
  Bell, BarChart3, Target, Search, Network, FileCheck, Gauge, Clock,
  TrendingDown, ListChecks, Brain, Bolt, Leaf, MonitorSpeaker, Lock,
  ClipboardCheck, Beaker, Cable
} from "lucide-react";
import Logo from "@/components/Logo";
import type { Alert } from "@/hooks/usePlantData";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  alerts: Alert[];
  userRole: string;
}

const Sidebar = ({ alerts, userRole }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;
  const criticalAlerts = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;

  const navGroups: NavGroup[] = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/" },
      ],
    },
    {
      title: "Equipment Health",
      items: [
        { label: "Plant Overview", icon: Activity, path: "/equipment" },
        { label: "Equipment Detail", icon: Cpu, path: "/equipment/detail" },
        { label: "Failure Analysis", icon: TrendingDown, path: "/failure-analysis" },
        { label: "Remaining Useful Life", icon: Clock, path: "/rul" },
      ],
    },
    {
      title: "Maintenance",
      items: [
        { label: "Predictive Maintenance", icon: Brain, path: "/predictive-maintenance" },
        { label: "Work Orders", icon: ListChecks, path: "/work-orders" },
        { label: "Cost Tracker", icon: BarChart3, path: "/maintenance-cost" },
      ],
    },
    {
      title: "Energy Intelligence",
      items: [
        { label: "Consumption", icon: Zap, path: "/energy" },
        { label: "Load Optimisation", icon: Bolt, path: "/load-optimisation" },
        { label: "Sustainability", icon: Leaf, path: "/sustainability" },
      ],
    },
    {
      title: "Alarm Management",
      items: [
        { label: "Active Alarms", icon: Bell, path: "/alarms", badge: unacknowledgedAlerts },
        { label: "Alarm Analytics", icon: BarChart3, path: "/alarm-analytics" },
        { label: "Rationalisation", icon: Target, path: "/alarm-rationalisation" },
      ],
    },
    {
      title: "OT Security",
      items: [
        { label: "Asset Registry", icon: MonitorSpeaker, path: "/ot-assets" },
        { label: "Threat Monitor", icon: Shield, path: "/threat-monitor" },
        { label: "Network Segmentation", icon: Network, path: "/network" },
        { label: "Compliance", icon: Lock, path: "/compliance" },
      ],
    },
    {
      title: "Operational Handover",
      items: [
        { label: "Handover Tracker", icon: ArrowRightLeft, path: "/handover" },
        { label: "Engineering Twin Sync", icon: Cable, path: "/twin-sync" },
        { label: "Data Completeness", icon: FileCheck, path: "/data-completeness" },
        { label: "ISO Validator", icon: ClipboardCheck, path: "/iso-validator" },
      ],
    },
    {
      title: "Simulator",
      items: [
        { label: "What-If Simulator", icon: Beaker, path: "/simulator" },
      ],
    },
    {
      title: "Data Sources",
      items: [
        { label: "Connected Systems", icon: Database, path: "/data-sources" },
        { label: "Data Quality", icon: Gauge, path: "/data-quality" },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Configuration", icon: Settings, path: "/settings" },
      ],
    },
  ];

  return (
    <aside className={`h-screen sticky top-0 flex flex-col border-r border-border bg-sidebar transition-all duration-200 ${collapsed ? "w-14" : "w-56"}`}>
      {/* Logo */}
      <div className="h-12 flex items-center px-3 border-b border-sidebar-border shrink-0">
        <Logo size={58} showText={!collapsed} />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.title} className="px-2">
            {!collapsed && (
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50 px-2 pt-3 pb-1">
                {group.title}
              </p>
            )}
            {collapsed && <div className="h-2" />}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary" : ""}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="bg-destructive text-destructive-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute left-8 top-0 w-2 h-2 bg-destructive rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-10 flex items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default Sidebar;

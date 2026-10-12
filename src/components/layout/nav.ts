import {
  LayoutDashboard, Activity, Cpu, Zap, Shield, ArrowRightLeft, Database, Settings,
  Bell, BarChart3, Target, Network, FileCheck, Gauge, Clock, TrendingDown, ListChecks, Brain,
  Bolt, Leaf, MonitorSpeaker, Lock, ClipboardCheck, Beaker, Cable, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  /** Sidebar label. */
  label: string;
  icon: LucideIcon;
  /** Page title when it differs from the sidebar label; used for the h1 and the page header. */
  title?: string;
  /** Shows the unacknowledged-alarm count (computed in the sidebar from the alerts prop). */
  alertBadge?: boolean;
}

// One array drives the sidebar and the top-bar location (group eyebrow + page title).
// Paths, labels, groups and order are the app's routes and must not change.
export const navGroups: { section: string; items: NavItem[] }[] = [
  { section: "Overview", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
  ]},
  { section: "Equipment Health", items: [
    { to: "/equipment", label: "Plant Overview", icon: Activity },
    { to: "/equipment/detail", label: "Equipment Detail", icon: Cpu },
    { to: "/failure-analysis", label: "Failure Analysis", icon: TrendingDown },
    { to: "/rul", label: "Remaining Useful Life", icon: Clock, title: "Remaining Useful Life (RUL)" },
  ]},
  { section: "Maintenance", items: [
    { to: "/predictive-maintenance", label: "Predictive Maintenance", icon: Brain },
    { to: "/work-orders", label: "Work Orders", icon: ListChecks, title: "Work Order Integration" },
    { to: "/maintenance-cost", label: "Cost Tracker", icon: BarChart3, title: "Maintenance Cost Tracker" },
  ]},
  { section: "Energy Intelligence", items: [
    { to: "/energy", label: "Consumption", icon: Zap, title: "Energy Consumption" },
    { to: "/load-optimisation", label: "Load Optimisation", icon: Bolt },
    { to: "/sustainability", label: "Sustainability", icon: Leaf, title: "Sustainability & Emissions" },
  ]},
  { section: "Alarm Management", items: [
    { to: "/alarms", label: "Active Alarms", icon: Bell, alertBadge: true },
    { to: "/alarm-analytics", label: "Alarm Analytics", icon: BarChart3, title: "Alarm History & Analytics" },
    { to: "/alarm-rationalisation", label: "Rationalisation", icon: Target, title: "Alarm Rationalisation" },
  ]},
  { section: "OT Security", items: [
    { to: "/ot-assets", label: "Asset Registry", icon: MonitorSpeaker, title: "OT Asset Registry" },
    { to: "/threat-monitor", label: "Threat Monitor", icon: Shield },
    { to: "/network", label: "Network Segmentation", icon: Network, title: "Network Segmentation Status" },
    { to: "/compliance", label: "Compliance", icon: Lock, title: "Compliance Dashboard" },
  ]},
  { section: "Operational Handover", items: [
    { to: "/handover", label: "Handover Tracker", icon: ArrowRightLeft },
    { to: "/twin-sync", label: "Engineering Twin Sync", icon: Cable },
    { to: "/data-completeness", label: "Data Completeness", icon: FileCheck, title: "Data Completeness Monitor" },
    { to: "/iso-validator", label: "ISO Validator", icon: ClipboardCheck, title: "ISO 15926 / CFIHOS Validator" },
  ]},
  { section: "Simulator", items: [
    { to: "/simulator", label: "What-If Simulator", icon: Beaker },
  ]},
  { section: "Data Sources", items: [
    { to: "/data-sources", label: "Connected Systems", icon: Database },
    { to: "/data-quality", label: "Data Quality", icon: Gauge, title: "Data Quality Monitor" },
  ]},
  { section: "Settings", items: [
    { to: "/settings", label: "Configuration", icon: Settings, title: "Settings & Configuration" },
  ]},
];

/** Group eyebrow and page title for a pathname. */
export const locate = (pathname: string): { group: string; title: string } => {
  for (const g of navGroups) {
    const item = g.items.find(i => i.to === pathname);
    if (item) return { group: g.section, title: item.title ?? item.label };
  }
  return { group: "", title: "Page not found" };
};

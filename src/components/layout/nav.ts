import { navIcon } from "@/lib/icons";
import type { LucideIcon } from "lucide-react";

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
    { to: "/", label: "Dashboard", icon: navIcon["/"] },
  ]},
  { section: "Equipment Health", items: [
    { to: "/equipment", label: "Plant Overview", icon: navIcon["/equipment"] },
    { to: "/equipment/detail", label: "Equipment Detail", icon: navIcon["/equipment/detail"] },
    { to: "/failure-analysis", label: "Failure Analysis", icon: navIcon["/failure-analysis"] },
    { to: "/rul", label: "Remaining Useful Life", icon: navIcon["/rul"], title: "Remaining Useful Life (RUL)" },
  ]},
  { section: "Maintenance", items: [
    { to: "/predictive-maintenance", label: "Predictive Maintenance", icon: navIcon["/predictive-maintenance"] },
    { to: "/work-orders", label: "Work Orders", icon: navIcon["/work-orders"], title: "Work Order Integration" },
    { to: "/maintenance-cost", label: "Cost Tracker", icon: navIcon["/maintenance-cost"], title: "Maintenance Cost Tracker" },
  ]},
  { section: "Energy Intelligence", items: [
    { to: "/energy", label: "Consumption", icon: navIcon["/energy"], title: "Energy Consumption" },
    { to: "/load-optimisation", label: "Load Optimisation", icon: navIcon["/load-optimisation"] },
    { to: "/sustainability", label: "Sustainability", icon: navIcon["/sustainability"], title: "Sustainability & Emissions" },
  ]},
  { section: "Alarm Management", items: [
    { to: "/alarms", label: "Active Alarms", icon: navIcon["/alarms"], alertBadge: true },
    { to: "/alarm-analytics", label: "Alarm Analytics", icon: navIcon["/alarm-analytics"], title: "Alarm History & Analytics" },
    { to: "/alarm-rationalisation", label: "Rationalisation", icon: navIcon["/alarm-rationalisation"], title: "Alarm Rationalisation" },
  ]},
  { section: "OT Security", items: [
    { to: "/ot-assets", label: "Asset Registry", icon: navIcon["/ot-assets"], title: "OT Asset Registry" },
    { to: "/threat-monitor", label: "Threat Monitor", icon: navIcon["/threat-monitor"] },
    { to: "/network", label: "Network Segmentation", icon: navIcon["/network"], title: "Network Segmentation Status" },
    { to: "/compliance", label: "Compliance", icon: navIcon["/compliance"], title: "Compliance Dashboard" },
  ]},
  { section: "Operational Handover", items: [
    { to: "/handover", label: "Handover Tracker", icon: navIcon["/handover"] },
    { to: "/twin-sync", label: "Engineering Twin Sync", icon: navIcon["/twin-sync"] },
    { to: "/data-completeness", label: "Data Completeness", icon: navIcon["/data-completeness"], title: "Data Completeness Monitor" },
    { to: "/iso-validator", label: "ISO Validator", icon: navIcon["/iso-validator"], title: "ISO 15926 / CFIHOS Validator" },
  ]},
  { section: "Simulator", items: [
    { to: "/simulator", label: "What-If Simulator", icon: navIcon["/simulator"] },
  ]},
  { section: "Data Sources", items: [
    { to: "/data-sources", label: "Connected Systems", icon: navIcon["/data-sources"] },
    { to: "/data-quality", label: "Data Quality", icon: navIcon["/data-quality"], title: "Data Quality Monitor" },
  ]},
  { section: "Settings", items: [
    { to: "/settings", label: "Configuration", icon: navIcon["/settings"], title: "Settings & Configuration" },
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

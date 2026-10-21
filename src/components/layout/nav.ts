import { navIcon } from "@/lib/icons";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  /** The page's one name: sidebar label, top-bar title, page heading and document title all use it. */
  label: string;
  /** One line under the heading. Detail that does not fit in the name (standards, scope) goes here. */
  description: string;
  icon: LucideIcon;
  /** Shows the unacknowledged-alarm count (computed in the sidebar from the alerts prop). */
  alertBadge?: boolean;
}

export interface NavGroup {
  section: string;
  items: NavItem[];
  /** No heading and no collapsing: the group is a single always-visible item (the dashboard). */
  flat?: boolean;
  /** Pinned to the bottom of the sidebar instead of the scrolling list. */
  pinned?: boolean;
}

// One array drives the sidebar and the top-bar location (group eyebrow + page name).
// Route paths are the app's routes and must not change; groups, labels and order are presentation.
export const navGroups: NavGroup[] = [
  { section: "Overview", flat: true, items: [
    { to: "/", label: "Dashboard", description: "Plant health, alarms and equipment status at a glance", icon: navIcon["/"] },
  ]},
  { section: "Asset health", items: [
    { to: "/equipment", label: "Plant Overview", description: "Equipment status, health and remaining useful life across the plant", icon: navIcon["/equipment"] },
    { to: "/equipment/detail", label: "Equipment Detail", description: "One machine at a time: health, live sensors and maintenance", icon: navIcon["/equipment/detail"] },
    { to: "/failure-analysis", label: "Failure Analysis", description: "Statistical failure analysis across equipment classes and systemic issue identification", icon: navIcon["/failure-analysis"] },
    { to: "/rul", label: "Remaining Useful Life", description: "Predicted remaining operating life (RUL) across the equipment fleet", icon: navIcon["/rul"] },
  ]},
  { section: "Maintenance", items: [
    { to: "/predictive-maintenance", label: "Predictive Maintenance", description: "AI-generated maintenance recommendations ranked by risk and value", icon: navIcon["/predictive-maintenance"] },
    { to: "/work-orders", label: "Work Orders", description: "Integrated view of all maintenance work orders in Maximo CMMS", icon: navIcon["/work-orders"] },
    { to: "/maintenance-cost", label: "Maintenance Cost", description: "Cost tracker: budget tracking and cost allocation across maintenance activities", icon: navIcon["/maintenance-cost"] },
    { to: "/simulator", label: "What-If Simulator", description: "Model operational scenarios and compare impact against current baseline", icon: navIcon["/simulator"] },
  ]},
  { section: "Energy", items: [
    { to: "/energy", label: "Energy Consumption", description: "Utility consumption against setpoints, AI-detected anomalies and optimisation opportunities", icon: navIcon["/energy"] },
    { to: "/load-optimisation", label: "Load Optimisation", description: "Energy cost reduction opportunities ranked by annual value", icon: navIcon["/load-optimisation"] },
    { to: "/sustainability", label: "Sustainability", description: "Environmental performance tracking: carbon emissions, water usage and waste management", icon: navIcon["/sustainability"] },
  ]},
  { section: "Alarms", items: [
    { to: "/alarms", label: "Active Alarms", description: "Review, filter and acknowledge plant alarms", icon: navIcon["/alarms"], alertBadge: true },
    { to: "/alarm-analytics", label: "Alarm Analytics", description: "Alarm history: historical performance analysis and chattering alarm identification", icon: navIcon["/alarm-analytics"] },
    { to: "/alarm-rationalisation", label: "Alarm Rationalisation", description: "Systematic review of alarm setpoints per ISA-18.2 / IEC 62682 standards", icon: navIcon["/alarm-rationalisation"] },
  ]},
  { section: "OT security", items: [
    { to: "/ot-assets", label: "OT Asset Registry", description: "Comprehensive inventory of all OT assets: IEC 62443 asset management", icon: navIcon["/ot-assets"] },
    { to: "/threat-monitor", label: "Threat Monitor", description: "OT security event log with MITRE ATT&CK for ICS framework mapping", icon: navIcon["/threat-monitor"] },
    { to: "/network", label: "Network Segmentation", description: "Segmentation status by Purdue model: OT network zones and inter-zone connection monitoring", icon: navIcon["/network"] },
    { to: "/compliance", label: "Compliance", description: "Compliance dashboard: IEC 62443 Industrial Cybersecurity Standard assessment", icon: navIcon["/compliance"] },
  ]},
  { section: "Handover & data", items: [
    { to: "/handover", label: "Handover Tracker", description: "Handover readiness against target: project summary and requirement scorecard", icon: navIcon["/handover"] },
    { to: "/twin-sync", label: "Engineering Twin Sync", description: "Synchronization status between Hexagon SmartPlant engineering twin and PlantMind operational twin", icon: navIcon["/twin-sync"] },
    { to: "/data-completeness", label: "Data Completeness", description: "Tracking data completeness across all engineering and operational data categories", icon: navIcon["/data-completeness"] },
    { to: "/iso-validator", label: "ISO Validator", description: "ISO 15926 / CFIHOS validation of the engineering data package against handover standards", icon: navIcon["/iso-validator"] },
    { to: "/data-sources", label: "Connected Systems", description: "Connected engineering and operational systems: status, last sync and record volumes", icon: navIcon["/data-sources"] },
    { to: "/data-quality", label: "Data Quality", description: "Real-time monitoring of data source health, freshness and ingestion quality", icon: navIcon["/data-quality"] },
  ]},
  { section: "Settings", pinned: true, items: [
    { to: "/settings", label: "Settings", description: "System configuration, thresholds, alert rules and model parameters", icon: navIcon["/settings"] },
  ]},
];

/** Group eyebrow, page name and description for a pathname. */
export const locate = (pathname: string): { group: string; title: string; description: string } => {
  for (const g of navGroups) {
    const item = g.items.find(i => i.to === pathname);
    if (item) return { group: g.section, title: item.label, description: item.description };
  }
  return { group: "", title: "Page not found", description: "" };
};

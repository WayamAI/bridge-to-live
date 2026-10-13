// One status and severity mapping for the redesign (CHRONUS_DESIGN_SYSTEM.md section 4.9).
// Severity mapping: critical -> error, high -> warning, medium -> info, low -> neutral.
// Old PlantMind colours: operational -> success, gap -> warning, destructive -> error, engineering -> info.
import type { AlarmSeverity, EquipmentStatus } from "@/hooks/usePlantData";

export type Tone = "success" | "info" | "warning" | "error" | "neutral";

/** Solid badge fill with white label, per tone (feedback badge tokens). */
export const toneBadgeClass: Record<Tone, string> = {
  success: "bg-success-badge text-badge",
  info: "bg-info-badge text-badge",
  warning: "bg-warning-badge text-badge",
  error: "bg-error-badge text-badge",
  neutral: "bg-neutral-badge text-badge",
};

export const equipmentLabel: Record<EquipmentStatus, string> = {
  running: "Running",
  warning: "Warning",
  critical: "Critical",
  offline: "Offline",
  maintenance: "Maintenance",
};

export const equipmentTone: Record<EquipmentStatus, Tone> = {
  running: "success",
  warning: "warning",
  critical: "error",
  offline: "neutral",
  maintenance: "info",
};

/** Alarm priority P1 to P4. Same meaning as before; P3 changes from indigo to blue (info). */
export const priorityTone = (priority: number): Tone =>
  priority === 1 ? "error" : priority === 2 ? "warning" : priority === 3 ? "info" : "neutral";

/** Alarm severity (info, warning, critical). */
export const severityTone: Record<AlarmSeverity, Tone> = {
  critical: "error",
  warning: "warning",
  info: "info",
};

/**
 * Chart fills for meaning-bearing colours, as CSS variables so charts follow the theme.
 * Same slots as the Chronus series: info 1, success 2, warning 3, error 4, neutral 5.
 */
export const toneChart: Record<Tone, string> = {
  info: "var(--analytics-series-1)",
  success: "var(--analytics-series-2)",
  warning: "var(--analytics-series-3)",
  error: "var(--analytics-series-4)",
  neutral: "var(--analytics-series-5)",
};

/**
 * Workflow states for tables (recommendation, work order, data quality, twin sync and similar).
 * Quiet dot and text by default; `solid` marks the states that need attention (solid badge).
 */
export interface WorkflowTone { tone: Tone; solid?: boolean }

export const recommendationStatus: Record<string, WorkflowTone> = {
  Pending: { tone: "warning" },
  Scheduled: { tone: "info" },
  "In-Progress": { tone: "info" },
  Completed: { tone: "success" },
  Deferred: { tone: "neutral" },
};

/** Work-order type: planned success, predictive info, corrective warning, emergency error (solid, needs attention). */
export const workOrderType: Record<string, WorkflowTone> = {
  "Planned PM": { tone: "success" },
  Predictive: { tone: "info" },
  Corrective: { tone: "warning" },
  Emergency: { tone: "error", solid: true },
};

/** Work-order status: Awaiting Parts means blocked, so it is the one solid badge. */
export const workOrderStatus: Record<string, WorkflowTone> = {
  Open: { tone: "warning" },
  "In-Progress": { tone: "info" },
  "Awaiting Parts": { tone: "error", solid: true },
  Completed: { tone: "success" },
  Cancelled: { tone: "neutral" },
};

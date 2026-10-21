// One status and severity mapping for the redesign (Wayam Chronus design system: badges and status).
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
  "In progress": { tone: "info" },
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

/** Work-order status: Awaiting parts means blocked, so it is the one solid badge. */
export const workOrderStatus: Record<string, WorkflowTone> = {
  Open: { tone: "warning" },
  "In progress": { tone: "info" },
  "Awaiting parts": { tone: "error", solid: true },
  Completed: { tone: "success" },
  Cancelled: { tone: "neutral" },
};

/** Implementation complexity (Low, Medium, High). A cost indicator, not an alert, so it stays quiet. */
export const complexityTone: Record<string, Tone> = {
  Low: "success",
  Medium: "warning",
  High: "error",
};

/** Opportunity pipeline stage (Identified to Implemented). */
export const opportunityStatus: Record<string, WorkflowTone> = {
  Identified: { tone: "neutral" },
  "Under review": { tone: "warning" },
  Approved: { tone: "info" },
  Implemented: { tone: "success" },
};

/** Alarm-quality classification: Chattering is the problem state (solid badge); the rest are quiet. */
export const chatteringStatus: Record<string, WorkflowTone> = {
  Chattering: { tone: "error", solid: true },
  Fleeting: { tone: "warning" },
  Stale: { tone: "warning" },
  Standing: { tone: "info" },
  Repeating: { tone: "neutral" },
};

/** Alarm rationalisation review state. */
export const rationalisationStatus: Record<string, WorkflowTone> = {
  Reviewed: { tone: "success" },
  Pending: { tone: "warning" },
  Approved: { tone: "info" },
  Suppressed: { tone: "neutral" },
};

/** OT patch status: End-of-life is the one that needs attention (solid badge). */
export const patchStatus: Record<string, WorkflowTone> = {
  "Up to date": { tone: "success" },
  "Patch available": { tone: "warning" },
  "End-of-life": { tone: "error", solid: true },
};

/** Threat event severity: critical error, high warning, medium info, low neutral. Critical and High need attention (solid). */
export const threatSeverity: Record<string, WorkflowTone> = {
  Critical: { tone: "error", solid: true },
  High: { tone: "warning", solid: true },
  Medium: { tone: "info" },
  Low: { tone: "neutral" },
};

/** Threat event handling state: Investigating needs attention (solid). */
export const threatStatus: Record<string, WorkflowTone> = {
  Investigating: { tone: "error", solid: true },
  Contained: { tone: "warning" },
  Resolved: { tone: "success" },
  Monitoring: { tone: "info" },
};

/** Network zone and flow state: green allowed, amber monitored with warnings, red policy violation. */
export const zoneTone: Record<"green" | "amber" | "red", Tone> = { green: "success", amber: "warning", red: "error" };

/** Handover requirement status: At risk needs attention (solid). */
export const handoverItemStatus: Record<string, WorkflowTone> = {
  Complete: { tone: "success" },
  "On track": { tone: "info" },
  Warning: { tone: "warning" },
  "At risk": { tone: "error", solid: true },
};

/** Connected system status: Active success, Degraded warning, anything else (down) error and solid. */
export const connectedSystemTone = (status: string): WorkflowTone =>
  status === "Active" ? { tone: "success" } : status === "Degraded" ? { tone: "warning" } : { tone: "error", solid: true };

/** A sync run: quiet success, or quiet warning when it finished with errors. */
export const syncRunTone = (errors: number): Tone => (errors > 0 ? "warning" : "success");

/** Data completeness state from a percentage: 100 Complete (success), 80 and above On track (warning), below 80 At risk (error, solid). */
export const completenessState = (pct: number): { label: string } & WorkflowTone =>
  pct === 100 ? { label: "Complete", tone: "success" } : pct >= 80 ? { label: "On track", tone: "warning" } : { label: "At risk", tone: "error", solid: true };

/** ISO / CFIHOS validation result: Fail needs attention (solid). */
export const validationStatus: Record<string, WorkflowTone> = {
  Pass: { tone: "success" },
  Warning: { tone: "warning" },
  Fail: { tone: "error", solid: true },
};

/** Data source health: Degraded needs attention (solid). */
export const sourceHealth: Record<string, WorkflowTone> = {
  Healthy: { tone: "success" },
  Warning: { tone: "warning" },
  Degraded: { tone: "error", solid: true },
};

// Lookups with a fallback. A value that is not in a map (new or unexpected data) renders as quiet neutral text
// showing the raw label, like the baseline did (an unmapped colour class meant plain text). They never throw.
const NEUTRAL: WorkflowTone = { tone: "neutral" };

/** Workflow state for `key`, or quiet neutral when the map does not know it. */
export const workflowTone = (map: Record<string, WorkflowTone>, key: string): WorkflowTone => map[key] ?? NEUTRAL;

/** Tone for `key`, or neutral when the map does not know it. */
export const toneOf = (map: Record<string, Tone>, key: string): Tone => map[key] ?? "neutral";

/** Display label for `key`, or the raw key when the map does not know it. */
export const labelOf = (map: Record<string, string>, key: string): string => map[key] ?? key;

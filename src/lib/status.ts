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

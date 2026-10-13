import { describe, it, expect } from "vitest";
import {
  chatteringStatus, completenessState, complexityTone, connectedSystemTone, equipmentLabel, equipmentTone, handoverItemStatus, labelOf,
  opportunityStatus, patchStatus, priorityTone, rationalisationStatus, recommendationStatus, severityTone, sourceHealth, syncRunTone,
  threatSeverity, threatStatus, toneOf, validationStatus, workflowTone, workOrderStatus, workOrderType, zoneTone,
} from "@/lib/status";

describe("status and severity mapping", () => {
  it("maps alarm priority P1 to P4 to error, warning, info, neutral", () => {
    expect([1, 2, 3, 4].map(priorityTone)).toEqual(["error", "warning", "info", "neutral"]);
  });
  it("maps alarm severity", () => {
    expect(severityTone).toEqual({ critical: "error", warning: "warning", info: "info" });
  });
  it("maps equipment status", () => {
    expect(equipmentTone).toEqual({ running: "success", warning: "warning", critical: "error", offline: "neutral", maintenance: "info" });
  });
});

describe("lookups with unknown values", () => {
  const neutral = { tone: "neutral" };
  const workflowMaps = {
    recommendationStatus, workOrderType, workOrderStatus, opportunityStatus, chatteringStatus, rationalisationStatus,
    patchStatus, threatSeverity, threatStatus, handoverItemStatus, validationStatus, sourceHealth,
  };
  it.each(Object.entries(workflowMaps))("%s falls back to quiet neutral for an unknown value", (_name, map) => {
    expect(workflowTone(map, "Not a real status")).toEqual(neutral);
    expect(workflowTone(map, "")).toEqual(neutral);
  });
  it.each(Object.entries(workflowMaps))("%s still returns its own entry for a known value", (_name, map) => {
    const key = Object.keys(map)[0];
    expect(workflowTone(map, key)).toBe(map[key]);
  });
  it("falls back to neutral for tone maps", () => {
    expect(toneOf(complexityTone, "Extreme")).toBe("neutral");
    expect(toneOf(severityTone, "fatal")).toBe("neutral");
    expect(toneOf(zoneTone, "purple")).toBe("neutral");
    expect(toneOf(equipmentTone, "exploded")).toBe("neutral");
    expect(toneOf(complexityTone, "High")).toBe("error");
  });
  it("shows the raw label for an unknown equipment status", () => {
    expect(labelOf(equipmentLabel, "exploded")).toBe("exploded");
    expect(labelOf(equipmentLabel, "running")).toBe("Running");
  });
  it("derived mappings never throw on unexpected input", () => {
    expect(priorityTone(99)).toBe("neutral");
    expect(connectedSystemTone("Unknown")).toEqual({ tone: "error", solid: true });
    expect(completenessState(-1).tone).toBe("error");
    expect(syncRunTone(0)).toBe("success");
  });
});

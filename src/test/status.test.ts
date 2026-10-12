import { describe, it, expect } from "vitest";
import { equipmentTone, priorityTone, severityTone } from "@/lib/status";

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

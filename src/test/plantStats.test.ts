import { describe, expect, it } from "vitest";
import { handoverReadiness, predictedFailureCounts } from "@/lib/plantStats";

const DAY = 86_400_000;
const now = Date.parse("2026-10-20T00:00:00Z");
const at = (days: number) => ({ predictedFailure: new Date(now + days * DAY) });

describe("predictedFailureCounts", () => {
  it("counts the next 30 days and the next 90 days from the same list", () => {
    const eq = [at(9), at(18), at(36), at(-3), {}, at(120)];
    expect(predictedFailureCounts(eq, now)).toEqual({ within30: 2, within90: 3 });
  });
  it("is zero for an empty list", () => {
    expect(predictedFailureCounts([], now)).toEqual({ within30: 0, within90: 0 });
  });
});

describe("handoverReadiness", () => {
  it("is completed over target, rounded", () => {
    expect(handoverReadiness([{ completed: 1, target: 3 }, { completed: 5, target: 6 }])).toBe(67);
  });
  it("is zero when there is no target", () => {
    expect(handoverReadiness([])).toBe(0);
  });
});

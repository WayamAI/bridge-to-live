import { describe, expect, it } from "vitest";
import { sparklineDomain } from "@/lib/sparkline";

describe("sparklineDomain", () => {
  it("fits the data with a margin, not the instrument range or the whole normal band", () => {
    const { min, max } = sparklineDomain([3.1, 3.3, 3.2], 2.5, 4.5);
    expect(min).toBeLessThan(3.1);
    expect(min).toBeGreaterThan(2.5);
    expect(max).toBeGreaterThan(3.3);
    expect(max).toBeLessThan(4.5);
  });
  it("does not stretch a reading that barely moves into noise", () => {
    const { min, max } = sparklineDomain([50, 50.001, 50], 35, 60);
    expect(max - min).toBeGreaterThan(2); // at least 10% of the 25-wide band
  });
  it("stretches to include a reading outside the band", () => {
    const { min, max } = sparklineDomain([1, 9], 2.5, 4.5);
    expect(min).toBeLessThan(1);
    expect(max).toBeGreaterThan(9);
  });
  it("never returns an empty domain", () => {
    const { min, max } = sparklineDomain([5, 5, 5], 5, 5);
    expect(max).toBeGreaterThan(min);
  });
});

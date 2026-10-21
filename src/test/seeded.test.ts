import { describe, expect, it } from "vitest";
import { createRng } from "@/lib/seeded";

describe("createRng", () => {
  it("gives the same sequence for the same seed and a different one for another seed", () => {
    const a = createRng(42), b = createRng(42), c = createRng(43);
    const seqA = Array.from({ length: 8 }, a), seqB = Array.from({ length: 8 }, b), seqC = Array.from({ length: 8 }, c);
    expect(seqA).toEqual(seqB);
    expect(seqA).not.toEqual(seqC);
  });

  it("stays in [0, 1) and is not constant", () => {
    const r = createRng(7);
    const values = Array.from({ length: 1000 }, r);
    values.forEach((v) => { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); });
    expect(new Set(values).size).toBeGreaterThan(990);
  });
});

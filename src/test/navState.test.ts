import { beforeEach, describe, expect, it, vi } from "vitest";
import { NAV_GROUPS_KEY, initialOpenGroups, readOpenGroups, writeOpenGroups } from "@/lib/navState";

describe("nav group state", () => {
  beforeEach(() => window.localStorage.clear());

  it("round-trips the open groups", () => {
    writeOpenGroups({ Energy: true, Alarms: false });
    expect(readOpenGroups()).toEqual({ Energy: true, Alarms: false });
  });

  it("returns null when nothing is stored", () => {
    expect(readOpenGroups()).toBeNull();
  });

  it.each([["not json", "{oops"], ["an array", "[true]"], ["a string", '"x"'], ["null", "null"]])("ignores %s", (_n, raw) => {
    window.localStorage.setItem(NAV_GROUPS_KEY, raw);
    expect(readOpenGroups()).toBeNull();
  });

  it("keeps only boolean entries", () => {
    window.localStorage.setItem(NAV_GROUPS_KEY, JSON.stringify({ A: true, B: "yes", C: 1, D: false }));
    expect(readOpenGroups()).toEqual({ A: true, D: false });
  });

  it("does not throw when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(readOpenGroups()).toBeNull();
    expect(() => writeOpenGroups({ A: true })).not.toThrow();
    vi.restoreAllMocks();
  });

  describe("initialOpenGroups", () => {
    const sections = ["A", "B", "C"];
    it("opens only the viewer's group when nothing is stored", () => {
      expect(initialOpenGroups(sections, "B", null)).toEqual({ A: false, B: true, C: false });
    });
    it("uses the stored choice and still opens the active group", () => {
      expect(initialOpenGroups(sections, "B", { A: true, B: false, C: false })).toEqual({ A: true, B: true, C: false });
    });
  });
});

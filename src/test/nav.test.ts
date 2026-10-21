import { describe, expect, it } from "vitest";
import { locate, navGroups } from "@/components/layout/nav";

const items = navGroups.flatMap((g) => g.items);

describe("nav is the one source of page names", () => {
  it("gives every route a name and a description, and no two pages share a name", () => {
    items.forEach((i) => {
      expect(i.label.trim(), i.to).not.toBe("");
      expect(i.description.trim().length, i.to).toBeGreaterThan(10);
    });
    expect(new Set(items.map((i) => i.label)).size).toBe(items.length);
    expect(new Set(items.map((i) => i.to)).size).toBe(items.length);
  });

  it("locate returns the same name the sidebar shows, with its group", () => {
    navGroups.forEach((g) => g.items.forEach((i) => expect(locate(i.to)).toEqual({ group: g.section, title: i.label, description: i.description })));
  });

  it("falls back for an unknown path", () => {
    expect(locate("/nope")).toEqual({ group: "", title: "Page not found", description: "" });
  });

  it("keeps names short enough for the sidebar", () => {
    items.forEach((i) => expect(i.label.length, i.to).toBeLessThanOrEqual(24));
  });
});

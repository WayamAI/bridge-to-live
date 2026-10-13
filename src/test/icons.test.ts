import { describe, expect, it } from "vitest";
import { navGroups } from "@/components/layout/nav";
import { alarmIcon, alarmTypeIcon, eventIcon, eventTypeIcon, icons, iconForPath, navIcon, unknownTypeIcon } from "@/lib/icons";

describe("icon mapping", () => {
  it("gives every nav item its mapped icon and no two pages share one", () => {
    const items = navGroups.flatMap((g) => g.items);
    expect(items.length).toBe(Object.keys(navIcon).length);
    items.forEach((i) => expect(i.icon).toBe(navIcon[i.to]));
    expect(new Set(Object.values(navIcon)).size).toBe(Object.keys(navIcon).length);
  });
  it("uses the sidebar icon for the page header", () => {
    expect(iconForPath("/alarms")).toBe(navIcon["/alarms"]);
    expect(iconForPath("/no-such-page")).toBeUndefined();
  });
  it("does not reuse a nav icon for another meaning", () => {
    const nav = new Set<unknown>(Object.values(navIcon));
    const sharedMeaning = new Set<unknown>([icons.alarms, icons.maintenance]); // the same thing as its nav item or type
    Object.entries(icons).forEach(([name, icon]) => {
      if (sharedMeaning.has(icon)) return;
      expect(nav.has(icon), `icons.${name} duplicates a nav icon`).toBe(false);
    });
  });
  it("falls back for unknown alarm and event types instead of throwing", () => {
    expect(alarmIcon("something new")).toBe(unknownTypeIcon);
    expect(eventIcon("something new")).toBe(unknownTypeIcon);
    expect(alarmIcon("predictive")).toBe(alarmTypeIcon.predictive);
    expect(eventIcon("Predictive")).toBe(eventTypeIcon.Predictive);
  });
  it("keeps the type icons distinct within a map", () => {
    expect(new Set(Object.values(alarmTypeIcon)).size).toBe(Object.keys(alarmTypeIcon).length);
  });
});

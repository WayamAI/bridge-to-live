import { describe, expect, it } from "vitest";
import { navGroups } from "@/components/layout/nav";
import { alarmIcon, emptyIcon, energyKpiIcon, kpi, panelIcon, alarmTypeIcon, eventIcon, eventTypeIcon, icons, iconForPath, markForPath, navIcon, unknownTypeIcon } from "@/lib/icons";

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
  it("has a page mark for every route and shares the pump between the two equipment routes", () => {
    navGroups.flatMap((g) => g.items).forEach((i) => expect(markForPath(i.to), i.to).toBeTruthy());
    expect(markForPath("/equipment")).toBe(markForPath("/equipment/detail"));
    expect(markForPath("/no-such-page")).toBeUndefined();
  });

  it("gives each KPI meaning its own icon, and only alarms share the sidebar bell", () => {
    const values = Object.values(kpi);
    expect(new Set(values).size).toBe(values.length);
    const nav = new Set<unknown>(Object.values(navIcon));
    Object.entries(kpi).forEach(([name, icon]) => {
      if (name === "alarms") return; // alarms and the alarms page are the same thing
      expect(nav.has(icon), `kpi.${name} duplicates a nav icon`).toBe(false);
    });
    expect(kpi.alarms).toBe(navIcon["/alarms"]);
  });

  it("keeps the energy tile icons to kpi meanings", () => {
    const allowed = new Set<unknown>(Object.values(kpi));
    Object.entries(energyKpiIcon).forEach(([label, icon]) => expect(allowed.has(icon), label).toBe(true));
  });

  it("has distinct empty-state icons and distinct Dashboard panel icons", () => {
    expect(new Set(Object.values(emptyIcon)).size).toBe(Object.keys(emptyIcon).length);
    expect(new Set(Object.values(panelIcon)).size).toBe(Object.keys(panelIcon).length);
    expect(panelIcon.alerts).toBe(navIcon["/alarms"]);
  });
});

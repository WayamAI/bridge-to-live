import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { navGroups } from "@/components/layout/nav";
import { iconFileNames, iconUrl } from "@/components/ui/Icon";
import {
  alarmIcon, alarmTypeIcon, emptyIcon, energyKpiIcon, equipmentClassIcons, equipmentIcon, eventIcon, eventTypeIcon, iconForPath, icons,
  iconSize, kpi, markForPath, navIcon, networkZoneIcon, notFoundIcon, otTypeIcon, panelIcon, settingsTabIcon, statusIcon, trendIcon, unknownTypeIcon,
} from "@/lib/icons";

/** Every concept -> file entry in lib/icons.ts, as [concept, file]. */
const concepts: [string, string][] = [
  ...Object.entries(navIcon).map(([k, v]) => [`nav ${k}`, v] as [string, string]),
  ...Object.entries(alarmTypeIcon).map(([k, v]) => [`alarm type ${k}`, v] as [string, string]),
  ...Object.entries(eventTypeIcon).map(([k, v]) => [`event type ${k}`, v] as [string, string]),
  ...Object.entries(settingsTabIcon).map(([k, v]) => [`settings tab ${k}`, v] as [string, string]),
  ...Object.entries(icons).map(([k, v]) => [`icons.${k}`, v] as [string, string]),
  ...Object.entries(kpi).map(([k, v]) => [`kpi.${k}`, v] as [string, string]),
  ...Object.entries(emptyIcon).map(([k, v]) => [`empty.${k}`, v] as [string, string]),
  ...Object.entries(panelIcon).map(([k, v]) => [`panel.${k}`, v] as [string, string]),
  ...Object.entries(statusIcon).map(([k, v]) => [`status.${k}`, v] as [string, string]),
  ...Object.entries(trendIcon).map(([k, v]) => [`trend.${k}`, v] as [string, string]),
  ...equipmentClassIcons.map((v) => [`equipment class ${v}`, v] as [string, string]),
  ...Object.entries(otTypeIcon).map(([k, v]) => [`ot type ${k}`, v] as [string, string]),
  ...Object.entries(networkZoneIcon).map(([k, v]) => [`zone ${k}`, v] as [string, string]),
  ["unknown type", unknownTypeIcon],
  ["404", notFoundIcon],
];

/** Where one file legitimately serves two concepts because they are the same thing (decided with the icon set). */
const sameThing: Record<string, string[]> = {
  "icon-nav-alarms": ["nav /alarms", "icons.alarms", "kpi.alarms", "panel.alerts", "settings tab alerts"],
  "icon-nav-predictive-maintenance": ["nav /predictive-maintenance", "alarm type predictive", "event type Predictive"],
  "icon-maintenance": ["icons.maintenance", "alarm type maintenance", "event type Planned PM"],
  "icon-status-ok": ["icons.acknowledge", "status.success"],
  "icon-status-warning": ["icons.warning", "status.warning"],
};

describe("icon files", () => {
  const files = new Set(iconFileNames());

  it("has a 48px and a 96px file for every concept", () => {
    concepts.forEach(([concept, file]) => {
      expect(files.has(file), `${concept} -> ${file}`).toBe(true);
      expect(iconUrl(file, 16), `${concept} 48px`).toBeTruthy();
      expect(iconUrl(file, 96), `${concept} 96px`).toBeTruthy();
    });
  });

  it("uses every icon file somewhere", () => {
    const used = new Set(concepts.map(([, f]) => f));
    const unused = [...files].filter((f) => !used.has(f));
    expect(unused).toEqual([]);
  });
});

describe("icon mapping", () => {
  it("gives one meaning one icon: a file serves two concepts only where they are the same thing", () => {
    const byFile = new Map<string, string[]>();
    concepts.forEach(([c, f]) => byFile.set(f, [...(byFile.get(f) ?? []), c]));
    byFile.forEach((cs, file) => {
      if (cs.length === 1) return;
      expect(sameThing[file], `${file} is used for ${cs.join(", ")}`).toBeTruthy();
      expect(cs.sort(), file).toEqual([...sameThing[file]].sort());
    });
  });

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

  it("does not reuse a nav icon for another meaning except the named ones", () => {
    const nav = new Set<string>(Object.values(navIcon));
    const named = new Set(Object.values(sameThing).flat());
    concepts.forEach(([c, f]) => {
      if (c.startsWith("nav ") || named.has(c)) return;
      expect(nav.has(f), `${c} duplicates a nav icon`).toBe(false);
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
    expect(kpi.alarms).toBe(navIcon["/alarms"]);
  });

  it("keeps the energy tile icons to kpi meanings", () => {
    const allowed = new Set<string>(Object.values(kpi));
    Object.entries(energyKpiIcon).forEach(([label, icon]) => expect(allowed.has(icon), label).toBe(true));
  });

  it("has distinct empty-state icons and distinct Dashboard panel icons", () => {
    expect(new Set(Object.values(emptyIcon)).size).toBe(Object.keys(emptyIcon).length);
    expect(new Set(Object.values(panelIcon)).size).toBe(Object.keys(panelIcon).length);
    expect(panelIcon.alerts).toBe(navIcon["/alarms"]);
  });

  it("covers every equipment class, OT device type and network zone", () => {
    const types = ["pump", "compressor", "valve", "motor", "vessel", "heat_exchanger", "turbine", "substation", "safety_valve", "generator", "analyser", "air_cooler", "transmitter"];
    types.forEach((t) => expect(equipmentIcon({ type: t }), t).toBeTruthy());
    expect(new Set(types.map((t) => equipmentIcon({ type: t }))).size).toBe(types.length);
    // generated plant items have a code as their type: the class code is the fallback
    expect(equipmentIcon({ type: "psv", equipmentClass: "PSV" })).toBe("icon-equip-safety-valve");
    expect(equipmentIcon({ type: "unheard of", equipmentClass: "ZZZ" })).toBeUndefined();
    expect(Object.keys(otTypeIcon)).toHaveLength(10);
    expect(Object.keys(networkZoneIcon)).toHaveLength(6);
  });

  it("sizes: 22px sidebar, 20px KPI tiles, 16px rows, buttons and controls, 14px chevrons, 48px empty, 96px 404", () => {
    expect(iconSize).toMatchObject({ sidebar: 22, kpi: 20, header: 20, button: 16, row: 16, control: 16, chevron: 14, empty: 48, notFound: 96 });
  });
});

// "Routed code" = every module reachable from App.tsx. None of it may import lucide-react.
describe("no lucide in routed code", () => {
  const src = resolve(__dirname, "..");
  const resolveImport = (from: string, spec: string): string | undefined => {
    const base = spec.startsWith("@/") ? resolve(src, spec.slice(2)) : spec.startsWith(".") ? resolve(dirname(from), spec) : undefined;
    if (!base) return undefined;
    return [".ts", ".tsx", "/index.ts", "/index.tsx", ""].map((e) => base + e).find((p) => existsSync(p) && /\.(ts|tsx)$/.test(p));
  };
  const reachable = new Set<string>();
  const walk = (file: string) => {
    if (reachable.has(file)) return;
    reachable.add(file);
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g)) {
      const target = resolveImport(file, m[1]);
      if (target) walk(target);
    }
  };
  walk(resolve(src, "App.tsx"));

  it("walks the real app", () => {
    expect(reachable.size).toBeGreaterThan(60);
    expect([...reachable].some((f) => f.endsWith("primitives.tsx"))).toBe(true);
  });

  it("imports lucide-react from no routed module", () => {
    const offenders = [...reachable].filter((f) => /["']lucide-react["']/.test(readFileSync(f, "utf8")));
    expect(offenders.map((f) => f.replace(src, "src"))).toEqual([]);
  });
});

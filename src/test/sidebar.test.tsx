import { act, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Sidebar from "@/components/layout/Sidebar";
import { navGroups } from "@/components/layout/nav";
import { NAV_GROUPS_KEY } from "@/lib/navState";

const setup = (path = "/alarms") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar alerts={[]} userRole="plant_director" expanded onToggleExpanded={() => {}} mobileOpen={false} />
    </MemoryRouter>,
  );

describe("Sidebar", () => {
  beforeEach(() => window.localStorage.clear());

  it("lists six collapsible groups, Dashboard without a heading and Settings in the footer", () => {
    setup();
    const primary = screen.getByRole("navigation", { name: "Primary" });
    expect(within(primary).getAllByRole("button").map((b) => b.textContent)).toEqual(["Asset Health", "Maintenance", "Energy", "Alarms", "OT Security", "Handover & Data"]);
    expect(within(screen.getByRole("navigation", { name: "Settings" })).getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/settings");
    expect(navGroups.flatMap((g) => g.items)).toHaveLength(26);
  });

  it("opens the group holding the current page and closes the rest", () => {
    setup("/alarms");
    expect(screen.getByRole("button", { name: "Alarms" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Energy" })).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles a group and remembers the choice in localStorage", () => {
    setup("/alarms");
    act(() => screen.getByRole("button", { name: "Energy" }).click());
    expect(screen.getByRole("button", { name: "Energy" })).toHaveAttribute("aria-expanded", "true");
    expect(JSON.parse(window.localStorage.getItem(NAV_GROUPS_KEY) as string).Energy).toBe(true);
  });

  it("restores the remembered state", () => {
    window.localStorage.setItem(NAV_GROUPS_KEY, JSON.stringify({ Maintenance: true }));
    setup("/alarms");
    expect(screen.getByRole("button", { name: "Maintenance" })).toHaveAttribute("aria-expanded", "true");
  });
});

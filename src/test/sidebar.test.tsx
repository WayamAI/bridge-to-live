import { act, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Sidebar from "@/components/layout/Sidebar";
import { navGroups } from "@/components/layout/nav";

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
    expect(within(primary).getAllByRole("button").map((b) => b.textContent)).toEqual(["Asset health", "Maintenance", "Energy", "Alarms", "OT security", "Handover & data"]);
    expect(within(screen.getByRole("navigation", { name: "Settings" })).getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/settings");
    expect(navGroups.flatMap((g) => g.items)).toHaveLength(26);
  });

  const groups = ["Asset health", "Maintenance", "Energy", "Alarms", "OT security", "Handover & data"];
  const expanded = () => groups.filter((name) => screen.getByRole("button", { name }).getAttribute("aria-expanded") === "true");

  it("opens only the group holding the current page", () => {
    setup("/alarms");
    expect(expanded()).toEqual(["Alarms"]);
  });

  it("opens no group on the Dashboard", () => {
    setup("/");
    expect(expanded()).toEqual([]);
  });

  it("is an accordion: opening a group closes the open one", () => {
    setup("/alarms");
    act(() => screen.getByRole("button", { name: "Energy" }).click());
    expect(expanded()).toEqual(["Energy"]);
    act(() => screen.getByRole("button", { name: "Energy" }).click());
    expect(expanded()).toEqual([]);
  });

  it("remembers nothing: a toggle writes no storage and a stored map is ignored", () => {
    window.localStorage.setItem("wayam-nav-groups", JSON.stringify({ Energy: true, Alarms: false }));
    setup("/alarms");
    expect(expanded()).toEqual(["Alarms"]);
    act(() => screen.getByRole("button", { name: "Maintenance" }).click());
    expect(window.localStorage.getItem("wayam-nav-groups")).toBe(JSON.stringify({ Energy: true, Alarms: false }));
  });
});

import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { EmptyState, EquipmentStatusLabel, KpiTile, Panel, PillSelect, QuietStatus, SearchField, StatusDot, Unit } from "@/components/ui/primitives";

describe("Chronus primitives", () => {
  it("Panel renders an eyebrow title, an action and its body", () => {
    render(<Panel title="Top Active Alerts" action={<span>View all</span>}>body</Panel>);
    expect(screen.getByRole("heading", { name: "Top Active Alerts" }).className).toContain("type-eyebrow");
    expect(screen.getByText("View all")).toBeTruthy();
    expect(screen.getByText("body")).toBeTruthy();
  });

  it("KpiTile renders label, value, currency prefix, unit, delta and hint", () => {
    render(<KpiTile label="Annual Savings" prefix="₹" value="14.2L" unit="/yr" delta="+3.1%" tone="success" hint="vs last month" />);
    expect(screen.getByText("Annual Savings")).toBeTruthy();
    expect(screen.getByText("₹")).toBeTruthy();
    expect(screen.getByText("/yr")).toBeTruthy();
    expect(screen.getByText("+3.1%").className).toContain("text-success");
    expect(screen.getByText("vs last month")).toBeTruthy();
  });

  it("KpiTile is a button only when it has an onClick", () => {
    const { rerender } = render(<KpiTile label="Plain" value="1" />);
    expect(screen.queryByRole("button")).toBeNull();
    rerender(<KpiTile label="Clickable" value="1" onClick={() => {}} />);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("Unit, StatusDot and QuietStatus render", () => {
    const { container } = render(
      <>
        <Unit>%</Unit>
        <StatusDot tone="error" />
        <QuietStatus tone="success">Live</QuietStatus>
      </>,
    );
    expect(screen.getByText("%")).toBeTruthy();
    expect(screen.getByText("Live")).toBeTruthy();
    expect(container.querySelector(".bg-error")).toBeTruthy();
    expect(container.querySelector(".bg-success")).toBeTruthy();
  });

  it("EquipmentStatusLabel is quiet when normal and a solid badge when it needs attention", () => {
    const { container, rerender } = render(<EquipmentStatusLabel status="running" />);
    expect(container.querySelector(".bg-success-badge")).toBeNull();
    expect(screen.getByText("Running")).toBeTruthy();
    for (const s of ["offline", "maintenance"] as const) {
      rerender(<EquipmentStatusLabel status={s} />);
      expect(container.querySelector("[class*='-badge']")).toBeNull();
    }
    rerender(<EquipmentStatusLabel status="warning" />);
    expect(container.querySelector(".bg-warning-badge")).toBeTruthy();
    rerender(<EquipmentStatusLabel status="critical" />);
    expect(container.querySelector(".bg-error-badge")).toBeTruthy();
    rerender(<EquipmentStatusLabel status={null} />);
    expect(screen.getByText("—")).toBeTruthy();
  });

  it("EmptyState has a default title and optional detail", () => {
    const { rerender } = render(<EmptyState />);
    expect(screen.getByText("Nothing to show")).toBeTruthy();
    rerender(<EmptyState title="No alarms match this filter" detail="Clear the filter to see the rest." />);
    expect(screen.getByText("No alarms match this filter")).toBeTruthy();
    expect(screen.getByText("Clear the filter to see the rest.")).toBeTruthy();
  });
});

describe("PillSelect and SearchField pass-through", () => {
  it("PillSelect forwards id, name, aria-*, data-* and value handling to the native select", () => {
    let picked = "";
    const { container } = render(
      <PillSelect id="sev" name="severity" aria-label="Filter by severity" data-testid="sev-select" value="All" onChange={(e) => { picked = e.target.value; }}>
        <option value="All">All</option>
        <option value="critical">Critical</option>
      </PillSelect>,
    );
    const select = container.querySelector("select")!;
    expect(select.id).toBe("sev");
    expect(select.getAttribute("name")).toBe("severity");
    expect(select.getAttribute("aria-label")).toBe("Filter by severity");
    expect(select.getAttribute("data-testid")).toBe("sev-select");
    expect(select.value).toBe("All");
    fireEvent.change(select, { target: { value: "critical" } });
    expect(picked).toBe("critical");
  });

  it("SearchField forwards id, name, placeholder, aria-*, data-* and onChange to the native input", () => {
    let typed = "";
    const { container } = render(
      <SearchField id="q" name="search" type="text" placeholder="Search equipment…" aria-label="Search equipment" data-testid="q-input" value="" onChange={(e) => { typed = e.target.value; }} />,
    );
    const input = container.querySelector("input")!;
    expect(input.id).toBe("q");
    expect(input.getAttribute("name")).toBe("search");
    expect(input.getAttribute("type")).toBe("text");
    expect(input.getAttribute("placeholder")).toBe("Search equipment…");
    expect(input.getAttribute("aria-label")).toBe("Search equipment");
    expect(input.getAttribute("data-testid")).toBe("q-input");
    fireEvent.change(input, { target: { value: "COMP" } });
    expect(typed).toBe("COMP");
  });
});

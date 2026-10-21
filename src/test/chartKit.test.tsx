import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { ChartBox } from "@/components/dashboard/chartKit";
import { wrapLabel } from "@/lib/chartLabels";
import { formatIsoDayMonth } from "@/lib/format";

describe("wrapLabel", () => {
  it("keeps a short label on one line", () => {
    expect(wrapLabel("Bearing failure", 22)).toEqual(["Bearing failure"]);
  });
  it("wraps at a word onto two lines", () => {
    expect(wrapLabel("Lube oil contamination", 14)).toEqual(["Lube oil", "contamination"]);
  });
  it("truncates past two lines with an ellipsis", () => {
    const lines = wrapLabel("Very long label that keeps going and going on", 10);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith("…")).toBe(true);
  });
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("ChartBox", () => {
  beforeAll(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  });
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("shows a readable empty state instead of a blank plot", () => {
    render(<ChartBox empty emptyTitle="No alarms in this period"><div /></ChartBox>);
    expect(screen.getByText("No alarms in this period")).toBeInTheDocument();
  });
  it("names the chart for screen readers", () => {
    render(<ChartBox label="Alarms per day, last 30 days"><div /></ChartBox>);
    expect(screen.getByRole("img", { name: "Alarms per day, last 30 days" })).toBeInTheDocument();
  });
});

describe("formatIsoDayMonth", () => {
  it("shortens an ISO date and leaves other text alone", () => {
    expect(formatIsoDayMonth("2026-07-22")).toBe("22 Jul");
    expect(formatIsoDayMonth("Oct '25")).toBe("Oct '25");
  });
});

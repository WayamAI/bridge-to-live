import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OEEDashboard from "@/components/twin/OEEDashboard";

const oee = { availability: 87.5, performance: 92.3, quality: 98.1, overall: 79.2 };

describe("OEEDashboard", () => {
  it("draws four gauges that all use the same series colour", () => {
    const { container } = render(<OEEDashboard oee={oee as never} />);
    const arcs = [...container.querySelectorAll("svg circle[stroke]")];
    expect(arcs).toHaveLength(4);
    arcs.forEach((c) => expect(c.getAttribute("stroke")).toBe("var(--analytics-series-1)"));
  });

  it("shows every value and the OEE label, with no foreground-coloured ring", () => {
    const { container } = render(<OEEDashboard oee={oee as never} />);
    ["87.5", "92.3", "98.1", "79.2"].forEach((v) => expect(screen.getByText(v)).toBeInTheDocument());
    expect(screen.getByText("OEE")).toBeInTheDocument();
    expect(container.querySelector(".border-foreground")).toBeNull();
  });
});

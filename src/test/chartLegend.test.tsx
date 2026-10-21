import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChartLegend from "@/components/dashboard/ChartLegend";

describe("ChartLegend", () => {
  it("lists exactly the items it is given, with a swatch each", () => {
    const { container } = render(
      <ChartLegend items={[{ label: "Total", color: "red" }, { label: "Target", color: "blue", kind: "dashed" }]} />,
    );
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Total", "Target"]);
    expect(container.querySelectorAll("li > span[aria-hidden]")).toHaveLength(2);
  });
});

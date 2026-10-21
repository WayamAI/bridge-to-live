import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import EquipmentHealthPage from "@/pages/EquipmentHealth";

const page = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <EquipmentHealthPage equipment={[]} selectedEquipmentId={null} onSelectEquipment={() => {}} />
    </MemoryRouter>,
  );

describe("Equipment Detail with nothing selected", () => {
  it("shows a Select equipment state that links to the overview", () => {
    page("/equipment/detail");
    expect(screen.getByText("Select equipment")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Plant Overview" })).toHaveAttribute("href", "/equipment");
    expect(screen.queryByText("Equipment Registry")).toBeNull();
  });

  it("keeps Plant Overview as the registry, with a Select equipment panel beside it", () => {
    page("/equipment");
    expect(screen.getByText("Equipment Registry")).toBeInTheDocument();
    expect(screen.getByText("Select equipment")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Go to Plant Overview" })).toBeNull();
  });
});

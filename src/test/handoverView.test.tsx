import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import HandoverPage from "@/pages/HandoverTracker";
import type { ConnectedSystem, HandoverItem } from "@/hooks/usePlantData";

const handoverData: HandoverItem[] = [{ requirement: "P&IDs", target: 10, completed: 5, unit: "docs", status: "On track" }];
const connectedSystems: ConnectedSystem[] = [{ name: "Maximo", type: "CMMS", status: "Active", lastSync: "2 min ago", recordsPer24h: "1,240" }];
const plantInfo = { name: "Plant", operator: "Client", handoverTarget: "2026-12-01", daysRemaining: 30 };

const view = (path: string, v: "handover" | "systems") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <HandoverPage view={v} handoverData={handoverData} connectedSystems={connectedSystems} plantInfo={plantInfo} />
    </MemoryRouter>,
  );

describe("handover page views", () => {
  it("/handover shows the project and the scorecard, not the systems table", () => {
    view("/handover", "handover");
    expect(screen.getByText("Active Handover Project")).toBeInTheDocument();
    expect(screen.getByText("Handover Readiness Scorecard")).toBeInTheDocument();
    expect(screen.queryByText("System Status")).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Handover Tracker" })).toBeInTheDocument();
  });

  it("/data-sources shows the connected-systems table, not the project or scorecard", () => {
    view("/data-sources", "systems");
    expect(screen.getByText("System Status")).toBeInTheDocument();
    expect(screen.getByText("Maximo")).toBeInTheDocument();
    expect(screen.queryByText("Active Handover Project")).toBeNull();
    expect(screen.queryByText("Handover Readiness Scorecard")).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "Connected Systems" })).toBeInTheDocument();
  });
});

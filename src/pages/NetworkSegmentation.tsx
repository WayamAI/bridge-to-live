import { axisTick, chartTooltipStyle, chartTooltipLabelStyle } from "@/components/dashboard/chartTheme";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, StatusDot, ToneStatus } from "@/components/ui/primitives";
import { zoneTone, toneOf } from "@/lib/status";
import { kpi } from "@/lib/icons";

interface PurdueLevel {
  level: string;
  label: string;
  devices: { name: string; status: "green" | "amber" | "red" }[];
}

const PURDUE_LEVELS: PurdueLevel[] = [
  { level: "Level 4", label: "Enterprise IT", devices: [
    { name: "SAP ERP Server", status: "green" }, { name: "Maximo CMMS", status: "green" }, { name: "Email Gateway", status: "green" }, { name: "PlantMind Cloud", status: "green" },
  ]},
  { level: "Level 3.5", label: "DMZ / Firewall", devices: [
    { name: "FW-DMZ-01 (Palo Alto)", status: "green" }, { name: "FW-DMZ-02 (Palo Alto)", status: "amber" }, { name: "Jump Server JS-01", status: "green" },
  ]},
  { level: "Level 3", label: "Plant Network / Historians", devices: [
    { name: "PI Historian Server", status: "green" }, { name: "PI Interface Node 01", status: "amber" }, { name: "EW-001", status: "amber" }, { name: "EW-002", status: "amber" }, { name: "EW-003", status: "red" },
  ]},
  { level: "Level 2", label: "SCADA / DCS / HMI", devices: [
    { name: "DCS DC-01", status: "green" }, { name: "DCS DC-02", status: "green" }, { name: "HMI-A-001", status: "green" }, { name: "HMI-A-002", status: "amber" }, { name: "HMI-B-001", status: "green" }, { name: "HMI-B-002", status: "red" }, { name: "SW-L2-01", status: "amber" },
  ]},
  { level: "Level 1", label: "PLCs / RTUs / Controllers", devices: [
    { name: "PLC-A-01", status: "green" }, { name: "PLC-A-02", status: "green" }, { name: "PLC-B-01", status: "amber" }, { name: "PLC-B-02", status: "amber" }, { name: "PLC-CW-01", status: "green" }, { name: "PLC-F-01", status: "green" }, { name: "RTU-ML-01", status: "green" }, { name: "RTU-FW-01", status: "green" }, { name: "SIS-01", status: "green" }, { name: "SIS-02", status: "green" },
  ]},
  { level: "Level 0", label: "Field Devices / Sensors", devices: [
    { name: "Gas Detectors (GD-01/02)", status: "green" }, { name: "Weather Station WS-01", status: "green" }, { name: "LDAR Detector", status: "green" }, { name: "Smart Transmitters (42,400 tags)", status: "green" },
  ]},
];

const CONNECTIONS = [
  { from: "Level 4", to: "Level 3.5", protocol: "HTTPS / TLS 1.3", status: "green" as const },
  { from: "Level 3.5", to: "Level 3", protocol: "OPC-UA / SSH", status: "green" as const },
  { from: "Level 3", to: "Level 2", protocol: "OPC-DA / PI-SDK", status: "amber" as const },
  { from: "Level 2", to: "Level 1", protocol: "Profinet / Modbus", status: "green" as const },
  { from: "Level 1", to: "Level 0", protocol: "HART / 4-20mA", status: "green" as const },
  { from: "192.168.3.44 → DC-02", to: "Level 2", protocol: "OPC-UA (UNAUTHORIZED)", status: "red" as const },
];

const NetworkSegmentation = () => (
  <PageHeader>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: "Network Zones", icon: kpi.groups, value: "6 (L0–L4+DMZ)" },
        { label: "Monitored Connections", icon: kpi.connections, value: "48" },
        { label: "Policy Violations", icon: kpi.risk, value: "1", color: "text-error" },
        { label: "Unmonitored Flows", icon: kpi.unmonitored, value: "0" },
      ].map(s => (
        <KpiTile key={s.label} icon={s.icon} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
      ))}
    </div>

    {/* Purdue Model */}
    <Panel title="Purdue Model · Network Zone Map" padded={false}>
      <p className="type-caption px-4 py-3 text-quaternary">Green = allowed & monitored · Amber = monitored with warnings · Red = policy violation</p>
      <div className="p-4 space-y-2">
        {PURDUE_LEVELS.map((level, li) => (
          <div key={level.level}>
            <div className="rounded-lg border border-strong border-l-[3px] p-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="type-caption tabular font-semibold text-tertiary w-16">{level.level}</span>
                <span className="type-body-sm font-medium">{level.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {level.devices.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 type-caption px-2 py-1 rounded border border-hairline bg-raised">
                    <StatusDot tone={toneOf(zoneTone, d.status)} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
            {li < PURDUE_LEVELS.length - 1 && (
              <div className="flex items-center gap-2 py-1 pl-8">
                <div className="h-4 border-l border-dashed border-hairline" />
                <span className="type-caption text-tertiary tabular">{CONNECTIONS[li]?.protocol}</span>
                <StatusDot tone={toneOf(zoneTone, CONNECTIONS[li]?.status || "green")} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Panel>

    {/* Inter-Zone Connections */}
    <Panel title="Inter-Zone Data Flows" padded={false}>
      <div className="overflow-x-auto">
        <table className="w-full type-body-sm">
          <thead>
            <tr className="border-b border-hairline">
              <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Source → Destination</th>
              <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Protocol</th>
              <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
            </tr>
          </thead>
          <tbody>
            {CONNECTIONS.map((c, i) => (
              <tr key={i} className="border-b border-hairline">
                <td className="py-2 px-3 font-medium">{c.from} → {c.to}</td>
                <td className="py-2 px-3 tabular type-body-sm whitespace-nowrap">{c.protocol}</td>
                <td className="py-2 px-3">
                  <ToneStatus tone={toneOf(zoneTone, c.status)} solid={c.status === "red"}>
                    {c.status === "green" ? "Allowed" : c.status === "amber" ? "Warning" : "Violation"}
                  </ToneStatus>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  </PageHeader>
);

export default NetworkSegmentation;

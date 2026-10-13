import { Network as NetworkIcon, Shield, ArrowRight } from "lucide-react";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";

interface PurdueLevel {
  level: string;
  label: string;
  color: string;
  devices: { name: string; status: "green" | "amber" | "red" }[];
}

const PURDUE_LEVELS: PurdueLevel[] = [
  { level: "Level 4", label: "Enterprise IT", color: seriesColor(0), devices: [
    { name: "SAP ERP Server", status: "green" }, { name: "Maximo CMMS", status: "green" }, { name: "Email Gateway", status: "green" }, { name: "PlantMind Cloud", status: "green" },
  ]},
  { level: "Level 3.5", label: "DMZ / Firewall", color: seriesColor(1), devices: [
    { name: "FW-DMZ-01 (Palo Alto)", status: "green" }, { name: "FW-DMZ-02 (Palo Alto)", status: "amber" }, { name: "Jump Server JS-01", status: "green" },
  ]},
  { level: "Level 3", label: "Plant Network / Historians", color: seriesColor(5), devices: [
    { name: "PI Historian Server", status: "green" }, { name: "PI Interface Node 01", status: "amber" }, { name: "EW-001", status: "amber" }, { name: "EW-002", status: "amber" }, { name: "EW-003", status: "red" },
  ]},
  { level: "Level 2", label: "SCADA / DCS / HMI", color: seriesColor(4), devices: [
    { name: "DCS DC-01", status: "green" }, { name: "DCS DC-02", status: "green" }, { name: "HMI-A-001", status: "green" }, { name: "HMI-A-002", status: "amber" }, { name: "HMI-B-001", status: "green" }, { name: "HMI-B-002", status: "red" }, { name: "SW-L2-01", status: "amber" },
  ]},
  { level: "Level 1", label: "PLCs / RTUs / Controllers", color: seriesColor(2), devices: [
    { name: "PLC-A-01", status: "green" }, { name: "PLC-A-02", status: "green" }, { name: "PLC-B-01", status: "amber" }, { name: "PLC-B-02", status: "amber" }, { name: "PLC-CW-01", status: "green" }, { name: "PLC-F-01", status: "green" }, { name: "RTU-ML-01", status: "green" }, { name: "RTU-FW-01", status: "green" }, { name: "SIS-01", status: "green" }, { name: "SIS-02", status: "green" },
  ]},
  { level: "Level 0", label: "Field Devices / Sensors", color: seriesColor(3), devices: [
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

const STATUS_DOT = { green: "bg-operational", amber: "bg-gap", red: "bg-destructive" };

const NetworkSegmentation = () => (
  <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
    <h2 className="text-lg font-bold flex items-center gap-2"><NetworkIcon className="w-5 h-5 text-primary" /> Network Segmentation Status</h2>
    <p className="text-xs text-muted-foreground -mt-3">Purdue model — OT network zone visualization and inter-zone connection monitoring</p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: "Network Zones", value: "6 (L0–L4+DMZ)" },
        { label: "Monitored Connections", value: "48" },
        { label: "Policy Violations", value: "1", color: "text-destructive" },
        { label: "Unmonitored Flows", value: "0", color: "text-operational" },
      ].map(s => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-3">
          <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
          <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
        </div>
      ))}
    </div>

    {/* Purdue Model */}
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Purdue Model — Network Zone Map</h3>
        <p className="text-[9px] text-muted-foreground">Green = allowed & monitored · Amber = monitored with warnings · Red = policy violation</p>
      </div>
      <div className="p-4 space-y-2">
        {PURDUE_LEVELS.map((level, li) => (
          <div key={level.level}>
            <div className="rounded-lg border border-border p-3" style={{ borderLeftWidth: 3, borderLeftColor: level.color }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-mono font-bold text-muted-foreground w-16">{level.level}</span>
                <span className="text-xs font-medium">{level.label}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {level.devices.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border border-border bg-muted/20">
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[d.status]}`} />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
            {li < PURDUE_LEVELS.length - 1 && (
              <div className="flex items-center gap-2 py-1 pl-8">
                <div className="h-4 border-l border-dashed border-muted-foreground/30" />
                <span className="text-[9px] text-muted-foreground font-mono">{CONNECTIONS[li]?.protocol}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[CONNECTIONS[li]?.status || "green"]}`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Inter-Zone Connections */}
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Inter-Zone Data Flows</h3>
      </div>
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
                  <span className={`inline-flex items-center gap-1.5 type-body-sm px-2 py-0.5 rounded-full font-medium ${c.status === "green" ? "bg-operational/10 text-operational" : c.status === "amber" ? "bg-gap/10 text-gap" : "bg-destructive/10 text-destructive"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[c.status]}`} />
                    {c.status === "green" ? "Allowed" : c.status === "amber" ? "Warning" : "Violation"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default NetworkSegmentation;

import { Shield, AlertTriangle, Clock } from "lucide-react";

interface ThreatEvent {
  id: string;
  timestamp: string;
  asset: string;
  eventType: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Investigating" | "Contained" | "Resolved" | "Monitoring";
  mitreTactic: string;
  details: string;
}

const THREAT_EVENTS: ThreatEvent[] = [
  { id: "t1", timestamp: "2026-03-30 14:23:07", asset: "DCS Controller DC-02", eventType: "Unexpected OPC-UA connection", severity: "Critical", status: "Investigating", mitreTactic: "Initial Access", details: "Connection from 192.168.3.44 — not in approved connection matrix" },
  { id: "t2", timestamp: "2026-03-30 09:44:52", asset: "PLC-A-01", eventType: "Unauthorised write command", severity: "High", status: "Contained", mitreTactic: "Execution", details: "Modbus write from EW-003 outside maintenance window" },
  { id: "t3", timestamp: "2026-03-30 02:11:34", asset: "HMI-B-002", eventType: "Firmware version query", severity: "Medium", status: "Monitoring", mitreTactic: "Discovery", details: "From unknown IP 10.42.8.91 — reconnaissance pattern" },
  { id: "t4", timestamp: "2026-03-29 18:32:41", asset: "OT Switch SW-L2-01", eventType: "Port scan detected", severity: "High", status: "Resolved", mitreTactic: "Discovery", details: "Sequential port scan from 192.168.3.44 across Level 2 subnet" },
  { id: "t5", timestamp: "2026-03-29 11:15:22", asset: "PI Interface Node 01", eventType: "Failed authentication attempts", severity: "Medium", status: "Resolved", mitreTactic: "Credential Access", details: "14 failed login attempts from EW-002 in 3 minutes" },
  { id: "t6", timestamp: "2026-03-28 22:48:19", asset: "Engineering Workstation EW-003", eventType: "Unauthorised USB device", severity: "High", status: "Contained", mitreTactic: "Initial Access", details: "USB mass storage device connected — policy violation" },
  { id: "t7", timestamp: "2026-03-28 08:12:04", asset: "CCTV NVR NVR-01", eventType: "Outbound connection attempt", severity: "Medium", status: "Resolved", mitreTactic: "Command and Control", details: "HTTP connection to external IP blocked by firewall" },
  { id: "t8", timestamp: "2026-03-27 16:55:38", asset: "RTU-ML-01", eventType: "Configuration change", severity: "Low", status: "Monitoring", mitreTactic: "Impair Process Control", details: "Setpoint change via authorised session — logged for audit" },
  { id: "t9", timestamp: "2026-03-27 04:22:11", asset: "Smart Transmitter Gateway GTW-01", eventType: "MQTT topic subscription anomaly", severity: "Low", status: "Resolved", mitreTactic: "Collection", details: "Subscription to all sensor topics from unexpected client ID" },
  { id: "t10", timestamp: "2026-03-26 14:08:55", asset: "OT Firewall FW-DMZ-02", eventType: "Rule bypass attempt", severity: "Critical", status: "Resolved", mitreTactic: "Lateral Movement", details: "Attempted Level 4→Level 2 traversal bypassing DMZ — blocked" },
];

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive",
  High: "bg-gap/10 text-gap",
  Medium: "bg-secondary/10 text-secondary",
  Low: "bg-muted text-muted-foreground",
};

const STATUS_COLORS: Record<string, string> = {
  Investigating: "bg-destructive/10 text-destructive",
  Contained: "bg-gap/10 text-gap",
  Resolved: "bg-operational/10 text-operational",
  Monitoring: "bg-secondary/10 text-secondary",
};

const ThreatMonitor = () => {
  const critical = THREAT_EVENTS.filter(e => e.severity === "Critical").length;
  const active = THREAT_EVENTS.filter(e => e.status === "Investigating" || e.status === "Contained").length;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h1 className="text-lg font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-destructive" /> Threat Monitor</h1>
      <p className="text-xs text-muted-foreground -mt-3">OT security event log — MITRE ATT&CK for ICS framework mapping</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Events (7 Days)", value: THREAT_EVENTS.length.toString() },
          { label: "Critical Events", value: critical.toString(), color: "text-destructive" },
          { label: "Active Investigations", value: active.toString(), color: "text-gap" },
          { label: "Mean Response Time", value: "18 min", color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Security Event Log — Most Recent</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Timestamp</th>
                <th className="text-left py-2 px-3 font-medium">Asset</th>
                <th className="text-left py-2 px-3 font-medium">Event Type</th>
                <th className="text-left py-2 px-3 font-medium">Severity</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-left py-2 px-3 font-medium">MITRE Tactic</th>
                <th className="text-left py-2 px-3 font-medium min-w-[250px]">Details</th>
              </tr>
            </thead>
            <tbody>
              {THREAT_EVENTS.map(e => (
                <tr key={e.id} className={`border-b border-border/50 hover:bg-muted/20 ${e.severity === "Critical" ? "bg-destructive/5" : ""}`}>
                  <td className="py-2 px-3 font-mono text-[10px] whitespace-nowrap">{e.timestamp}</td>
                  <td className="py-2 px-3 font-medium">{e.asset}</td>
                  <td className="py-2 px-3">{e.eventType}</td>
                  <td className="py-2 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${SEVERITY_COLORS[e.severity]}`}>{e.severity}</span></td>
                  <td className="py-2 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[e.status]}`}>{e.status}</span></td>
                  <td className="py-2 px-3 text-[10px] font-mono">{e.mitreTactic}</td>
                  <td className="py-2 px-3 text-[10px]">{e.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ThreatMonitor;

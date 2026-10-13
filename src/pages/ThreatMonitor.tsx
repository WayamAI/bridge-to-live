import { Shield, AlertTriangle, Clock } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { threatSeverity, threatStatus } from "@/lib/status";

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

const ThreatMonitor = () => {
  const critical = THREAT_EVENTS.filter(e => e.severity === "Critical").length;
  const active = THREAT_EVENTS.filter(e => e.status === "Investigating" || e.status === "Contained").length;

  return (
    <PageHeader title="Threat Monitor" subtitle="OT security event log with MITRE ATT&CK for ICS framework mapping">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Events (7 Days)", value: THREAT_EVENTS.length.toString() },
          { label: "Critical Events", value: critical.toString(), color: critical > 0 ? "text-error" : "" },
          { label: "Active Investigations", value: active.toString() },
          { label: "Mean Response Time", value: "18 min" },
        ].map(s => (
          <KpiTile key={s.label} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      <Panel title="Security Event Log · Most Recent" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Timestamp</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Asset</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Event Type</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Severity</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">MITRE Tactic</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary min-w-[250px]">Details</th>
              </tr>
            </thead>
            <tbody>
              {THREAT_EVENTS.map(e => (
                <tr key={e.id} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 tabular type-body-sm whitespace-nowrap">{e.timestamp}</td>
                  <td className="py-2 px-3 font-medium">{e.asset}</td>
                  <td className="py-2 px-3">{e.eventType}</td>
                  <td className="py-2 px-3"><ToneStatus tone={threatSeverity[e.severity].tone} solid={threatSeverity[e.severity].solid}>{e.severity}</ToneStatus></td>
                  <td className="py-2 px-3"><ToneStatus tone={threatStatus[e.status].tone} solid={threatStatus[e.status].solid}>{e.status}</ToneStatus></td>
                  <td className="py-2 px-3 type-body-sm tabular whitespace-nowrap">{e.mitreTactic}</td>
                  <td className="py-2 px-3 type-body-sm">{e.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default ThreatMonitor;

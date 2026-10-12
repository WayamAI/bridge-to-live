import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Target, AlertTriangle, CheckCircle } from "lucide-react";

interface AlarmPoint {
  id: string;
  tag: string;
  parameter: string;
  currentSetpoint: string;
  proposedSetpoint: string;
  rationaleCode: string;
  rationale: string;
  alarmRate7d: number;
  status: "Reviewed" | "Pending" | "Approved" | "Suppressed";
  priority: number;
}

const ALARM_POINTS: AlarmPoint[] = [
  { id: "ap1", tag: "TT-A-041", parameter: "Temperature HIGH", currentSetpoint: "82°C", proposedSetpoint: "88°C", rationaleCode: "A1.2", rationale: "Normal operating envelope extends to 85°C per datasheet — setpoint too tight", alarmRate7d: 48, status: "Approved", priority: 3 },
  { id: "ap2", tag: "PT-A-042", parameter: "Pressure HIGH", currentSetpoint: "88 barg", proposedSetpoint: "92 barg", rationaleCode: "A1.3", rationale: "Discharge pressure routinely exceeds 88 during startup — transient nuisance", alarmRate7d: 34, status: "Pending", priority: 2 },
  { id: "ap3", tag: "FT-D-018", parameter: "Flow LOW", currentSetpoint: "2400 Nm³/h", proposedSetpoint: "2000 Nm³/h", rationaleCode: "A2.1", rationale: "Low flow during turndown operations is normal — not a fault condition", alarmRate7d: 22, status: "Pending", priority: 3 },
  { id: "ap4", tag: "COMP-A-001", parameter: "Discharge Temp HIGH", currentSetpoint: "135°C", proposedSetpoint: "135°C", rationaleCode: "B1.1", rationale: "Genuine safety alarm — maintain current setpoint", alarmRate7d: 18, status: "Reviewed", priority: 1 },
  { id: "ap5", tag: "HEX-C-003", parameter: "DP HIGH", currentSetpoint: "1.0 bar", proposedSetpoint: "1.2 bar", rationaleCode: "A1.2", rationale: "Fouling causes gradual DP rise — adjust to reduce nuisance", alarmRate7d: 14, status: "Approved", priority: 3 },
  { id: "ap6", tag: "PUMP-CW-003", parameter: "Vibration HIGH", currentSetpoint: "4.0 mm/s", proposedSetpoint: "4.5 mm/s", rationaleCode: "A1.4", rationale: "ISO 10816 allows 4.5 mm/s for this pump class", alarmRate7d: 8, status: "Pending", priority: 3 },
  { id: "ap7", tag: "MOT-E-018", parameter: "Current HIGH", currentSetpoint: "440A", proposedSetpoint: "460A", rationaleCode: "A1.2", rationale: "FLA is 480A — current setpoint 8% below nameplate", alarmRate7d: 12, status: "Pending", priority: 2 },
  { id: "ap8", tag: "V-F-007", parameter: "Level HIGH", currentSetpoint: "50%", proposedSetpoint: "Suppress", rationaleCode: "C1.1", rationale: "KO drum level alarm when no flow — suppress when unit offline", alarmRate7d: 6, status: "Suppressed", priority: 4 },
];

const SUMMARY_PIE = [
  { name: "Reviewed — Keep", value: 1842, color: "hsl(170, 80%, 45%)" },
  { name: "Setpoint Changed", value: 428, color: "hsl(235, 55%, 55%)" },
  { name: "Suppressed", value: 124, color: "hsl(35, 90%, 55%)" },
  { name: "Pending Review", value: 453, color: "hsl(215, 15%, 55%)" },
];

const STATUS_COLORS: Record<string, string> = {
  Reviewed: "bg-operational/10 text-operational",
  Pending: "bg-gap/10 text-gap",
  Approved: "bg-primary/10 text-primary",
  Suppressed: "bg-muted text-muted-foreground",
};

const AlarmRationalisation = () => {
  const total = SUMMARY_PIE.reduce((s, d) => s + d.value, 0);
  const reviewed = total - 453;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Alarm Rationalisation</h2>
      <p className="text-xs text-muted-foreground -mt-3">Systematic review of alarm setpoints per ISA-18.2 / IEC 62682 standards</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Alarm Points", value: total.toLocaleString() },
          { label: "Reviewed", value: `${reviewed.toLocaleString()} (${Math.round(reviewed / total * 100)}%)`, color: "text-operational" },
          { label: "Pending Review", value: "453", color: "text-gap" },
          { label: "Chattering Eliminated", value: "82", color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Rationalisation Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Alarm Rationalisation Register — High-Frequency Items</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full type-body-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Tag</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Parameter</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Current</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Proposed</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Code</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary min-w-[200px]">Rationale</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Rate (7d)</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary">P</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
                </tr>
              </thead>
              <tbody>
                {ALARM_POINTS.map(a => (
                  <tr key={a.id} className={`border-b border-hairline hover:bg-raised ${a.alarmRate7d > 20 ? "bg-destructive/5" : ""}`}>
                    <td className="py-2 px-3 tabular text-foreground font-medium whitespace-nowrap">{a.tag}</td>
                    <td className="py-2 px-3">{a.parameter}</td>
                    <td className="py-2 px-3 tabular whitespace-nowrap">{a.currentSetpoint}</td>
                    <td className="py-2 px-3 tabular font-bold whitespace-nowrap">{a.proposedSetpoint}</td>
                    <td className="py-2 px-3 tabular type-body-sm whitespace-nowrap">{a.rationaleCode}</td>
                    <td className="py-2 px-3 type-body-sm">{a.rationale}</td>
                    <td className="py-2 px-3 text-right tabular font-bold whitespace-nowrap">{a.alarmRate7d}</td>
                    <td className="py-2 px-3 text-center tabular whitespace-nowrap">{a.priority}</td>
                    <td className="py-2 px-3"><span className={`type-body-sm px-3 py-0.5 rounded-full font-medium ${STATUS_COLORS[a.status]}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Pie */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Rationalisation Summary</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={SUMMARY_PIE} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={2}>
                  {SUMMARY_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-3">
              {SUMMARY_PIE.map(d => (
                <div key={d.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /><span>{d.name}</span></div>
                  <span className="font-mono">{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlarmRationalisation;

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { toneChart, workflowTone } from "@/lib/status";
import PageHeader from "@/components/layout/PageHeader";
import { KpiGrid, KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { rationalisationStatus } from "@/lib/status";
import { formatNumber } from "@/lib/format";
import { kpi } from "@/lib/icons";
import { ChartBox } from "@/components/dashboard/chartKit";

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
  { name: "Reviewed — Keep", value: 1842, color: toneChart.success },
  { name: "Setpoint Changed", value: 428, color: toneChart.info },
  { name: "Suppressed", value: 124, color: toneChart.warning },
  { name: "Pending Review", value: 453, color: toneChart.neutral },
];

const AlarmRationalisation = () => {
  const total = SUMMARY_PIE.reduce((s, d) => s + d.value, 0);
  const reviewed = total - 453;

  return (
    <PageHeader>

      <KpiGrid>
        {[
          { label: "Total Alarm Points", icon: kpi.count, value: formatNumber(total) },
          { label: "Reviewed", icon: kpi.review, value: `${formatNumber(reviewed)} (${Math.round(reviewed / total * 100)}%)` },
          { label: "Pending Review", icon: kpi.pending, value: "453" },
          { label: "Chattering Eliminated", icon: kpi.chattering, value: "82" },
        ].map(s => (
          <KpiTile key={s.label} icon={s.icon} label={s.label} value={s.value} />
        ))}
      </KpiGrid>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Rationalisation Table */}
        <Panel title="Alarm Rationalisation Register · High-Frequency Items" padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full type-body-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Tag</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Parameter</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Current</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Proposed</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Code</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary min-w-[160px]">Rationale</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-right text-quaternary">Rate (7d)</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-center text-quaternary">P</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Status</th>
                </tr>
              </thead>
              <tbody>
                {ALARM_POINTS.map(a => (
                  <tr key={a.id} className="border-b border-hairline hover:bg-raised">
                    <td className="py-2 px-2 tabular text-foreground font-medium whitespace-nowrap">{a.tag}</td>
                    <td className="py-2 px-2">{a.parameter}</td>
                    <td className="py-2 px-2 tabular whitespace-nowrap">{a.currentSetpoint}</td>
                    <td className="py-2 px-2 tabular font-semibold whitespace-nowrap">{a.proposedSetpoint}</td>
                    <td className="py-2 px-2 tabular type-body-sm whitespace-nowrap">{a.rationaleCode}</td>
                    <td className="py-2 px-2 type-body-sm">{a.rationale}</td>
                    <td className="py-2 px-2 text-right tabular font-semibold whitespace-nowrap">{a.alarmRate7d}</td>
                    <td className="py-2 px-2 text-center tabular whitespace-nowrap">{a.priority}</td>
                    <td className="py-2 px-2"><ToneStatus tone={workflowTone(rationalisationStatus, a.status).tone}>{a.status}</ToneStatus></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Summary Pie */}
        <Panel title="Rationalisation Summary">
            <ChartBox height="standard" label="Rationalisation summary by status">
              <PieChart>
                <Pie isAnimationActive={false} data={SUMMARY_PIE} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={2}>
                  {SUMMARY_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
              </PieChart>
            </ChartBox>
            <div className="space-y-1.5 mt-3">
              {SUMMARY_PIE.map(d => (
                <div key={d.name} className="flex items-center justify-between type-caption">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /><span>{d.name}</span></div>
                  <span className="tabular">{formatNumber(d.value)}</span>
                </div>
              ))}
            </div>
        </Panel>
      </div>
    </PageHeader>
  );
};

export default AlarmRationalisation;

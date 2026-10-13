import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, ScatterChart, Scatter, ZAxis } from "recharts";
import { TrendingDown, TrendingUp, AlertTriangle, ArrowRight, Clock } from "lucide-react";
import type { Equipment } from "@/hooks/usePlantData";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";

const FAILURE_MODES = [
  { mode: "Bearing failure", count: 84, pct: 34, downtime: 624, cost: 312, mtbf: 11200, trend: "↑" },
  { mode: "Seal degradation", count: 54, pct: 22, downtime: 418, cost: 198, mtbf: 14800, trend: "→" },
  { mode: "Impeller fouling", count: 44, pct: 18, downtime: 302, cost: 142, mtbf: 16200, trend: "↓" },
  { mode: "Lube oil contamination", count: 30, pct: 12, downtime: 210, cost: 94, mtbf: 18400, trend: "↑" },
  { mode: "Coupling misalignment", count: 20, pct: 8, downtime: 168, cost: 62, mtbf: 22000, trend: "→" },
  { mode: "Other", count: 15, pct: 6, downtime: 120, cost: 48, mtbf: 28000, trend: "→" },
];

const WEIBULL_DATA = Array.from({ length: 50 }, (_, i) => {
  const hours = i * 500;
  const beta = 2.1, eta = 18000;
  const survival = Math.exp(-Math.pow(hours / eta, beta)) * 100;
  const upper = Math.min(100, survival + 5 + Math.random() * 3);
  const lower = Math.max(0, survival - 5 - Math.random() * 3);
  return { hours, survival: Math.round(survival * 10) / 10, upper: Math.round(upper * 10) / 10, lower: Math.round(lower * 10) / 10 };
});

const SCATTER_DATA = [
  { hours: 8200, date: "2024-04", mode: "Bearing failure", cost: 4.2, tag: "COMP-A-001" },
  { hours: 11400, date: "2024-06", mode: "Seal degradation", cost: 2.8, tag: "PUMP-CW-003" },
  { hours: 14800, date: "2024-09", mode: "Impeller fouling", cost: 3.1, tag: "COMP-B-001" },
  { hours: 6200, date: "2024-11", mode: "Lube oil contamination", cost: 1.4, tag: "TURB-G-001" },
  { hours: 18200, date: "2025-01", mode: "Bearing failure", cost: 5.8, tag: "HEX-C-003" },
  { hours: 9800, date: "2025-03", mode: "Coupling misalignment", cost: 2.2, tag: "MOT-E-018" },
  { hours: 12400, date: "2025-05", mode: "Bearing failure", cost: 3.9, tag: "COMP-A-002" },
  { hours: 15600, date: "2025-07", mode: "Seal degradation", cost: 4.5, tag: "PUMP-B-012" },
  { hours: 7400, date: "2025-09", mode: "Impeller fouling", cost: 1.8, tag: "AGC-B-004" },
  { hours: 16800, date: "2025-11", mode: "Bearing failure", cost: 6.2, tag: "COMP-A-001" },
  { hours: 10200, date: "2026-01", mode: "Lube oil contamination", cost: 2.4, tag: "TURB-G-002" },
  { hours: 13800, date: "2026-03", mode: "Seal degradation", cost: 3.6, tag: "FCV-D-022" },
];

const MODE_COLORS: Record<string, string> = {
  "Bearing failure": seriesColor(0),
  "Seal degradation": seriesColor(1),
  "Impeller fouling": seriesColor(5),
  "Lube oil contamination": seriesColor(4),
  "Coupling misalignment": seriesColor(2),
  "Other": seriesColor(3),
};

interface Props {
  equipment: Equipment[];
}

const FailureAnalysis = ({ equipment }: Props) => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const filteredScatter = selectedMode
    ? SCATTER_DATA.filter(d => d.mode === selectedMode)
    : SCATTER_DATA;

  const stats = [
    { label: "Total Failures (24 mo)", value: "247" },
    { label: "Unplanned Downtime", value: "1,842 hr" },
    { label: "Total Maint. Cost", value: "₹8.74 Cr" },
    { label: "Avg MTBF (Fleet)", value: "14,200 hr" },
    { label: "MTBF Trend", value: "↓ −8.3%", color: "text-gap" },
    { label: "Most Failure-Prone", value: "FCV-D-022", sub: "14 failures · 5.7% of fleet" },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold">Failure Analysis</h2>
      <p className="text-xs text-muted-foreground -mt-3">Statistical failure analysis across equipment classes — systemic issue identification</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-lg font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
            {s.sub && <p className="text-[9px] text-muted-foreground">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Failure Mode Pareto */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Failure Mode Pareto — All Equipment Classes</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={FAILURE_MODES} layout="vertical" margin={{ left: 120 }}>
                <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="mode" tick={axisTick} tickLine={false} axisLine={false} width={110} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Bar isAnimationActive={false} dataKey="count" fill={seriesColor(0)} radius={[0, 4, 4, 0]} cursor="pointer"
                  onClick={(d: any) => setSelectedMode(selectedMode === d.mode ? null : d.mode)} />
              </BarChart>
            </ResponsiveContainer>
            {/* Pareto Table */}
            <div className="mt-3 overflow-auto">
              <table className="w-full type-body-sm">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Failure Mode</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Count</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Downtime (hr)</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Cost (₹L)</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">MTBF (hr)</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {FAILURE_MODES.map(f => (
                    <tr key={f.mode} className="border-b border-hairline hover:bg-raised cursor-pointer"
                      onClick={() => setSelectedMode(selectedMode === f.mode ? null : f.mode)}>
                      <td className={`py-2 px-3 font-medium ${selectedMode === f.mode ? "text-foreground" : ""}`}>{f.mode}</td>
                      <td className="text-right py-2 px-3 tabular whitespace-nowrap">{f.count}</td>
                      <td className="text-right py-2 px-3 tabular whitespace-nowrap">{f.downtime}</td>
                      <td className="text-right py-2 px-3 tabular whitespace-nowrap">{f.cost}</td>
                      <td className="text-right py-2 px-3 tabular whitespace-nowrap">{f.mtbf.toLocaleString()}</td>
                      <td className={`text-center py-2 px-3 ${f.trend === "↑" ? "text-destructive" : f.trend === "↓" ? "text-operational" : "text-tertiary"}`}>{f.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Weibull Survival */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Weibull Survival Analysis — Compressor Fleet</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={WEIBULL_DATA}>
                <XAxis dataKey="hours" tick={axisTick} tickLine={false} axisLine={false} label={{ value: "Operating Hours", position: "insideBottom", offset: -5, fill: "var(--text-quaternary)", fontSize: 11 }} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} label={{ value: "Survival %", angle: -90, position: "insideLeft", fill: "var(--text-quaternary)", fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Area isAnimationActive={false} type="monotone" dataKey="upper" stroke="none" fill={seriesColor(0)} fillOpacity={0.1} />
                <Area isAnimationActive={false} type="monotone" dataKey="lower" stroke="none" fill="var(--surface-container)" fillOpacity={1} />
                <Line isAnimationActive={false} type="monotone" dataKey="survival" stroke={seriesColor(0)} strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-2.5">
                <p className="text-[9px] text-muted-foreground">Shape Parameter (β)</p>
                <p className="text-sm font-bold font-mono">2.1</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Wear-out failure pattern — failures accelerate with age</p>
              </div>
              <div className="rounded-lg border border-border p-2.5">
                <p className="text-[9px] text-muted-foreground">Scale Parameter (η)</p>
                <p className="text-sm font-bold font-mono">18,000 hr</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">63.2% of units fail by this point</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Failure Event Scatter */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Failure Event Timeline — Operating Hours at Failure</h3>
          {selectedMode && (
            <button onClick={() => setSelectedMode(null)} className="text-[10px] text-primary hover:underline">Clear filter: {selectedMode}</button>
          )}
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ left: 20 }}>
              <XAxis dataKey="hours" name="Operating Hours" tick={axisTick} tickLine={false} axisLine={false} label={{ value: "Operating Hours at Failure", position: "insideBottom", offset: -5, fill: "var(--text-quaternary)", fontSize: 11 }} />
              <YAxis dataKey="date" name="Date" tick={axisTick} tickLine={false} axisLine={false} />
              <ZAxis dataKey="cost" range={[40, 400]} name="Repair Cost (₹L)" />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle}
                formatter={(val: any, name: string) => [name === "Repair Cost (₹L)" ? `₹${val}L` : val, name]} />
              <Scatter isAnimationActive={false} data={filteredScatter} fill={seriesColor(0)} />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3">
            {Object.entries(MODE_COLORS).map(([mode, color]) => (
              <button key={mode} onClick={() => setSelectedMode(selectedMode === mode ? null : mode)}
                className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded border ${selectedMode === mode ? "border-primary bg-primary/10" : "border-border"}`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailureAnalysis;

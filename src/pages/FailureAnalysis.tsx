import { useState, useMemo } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Chip, KpiGrid, KpiTile, Panel, Unit } from "@/components/ui/primitives";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, ComposedChart, ScatterChart, Scatter, ZAxis, Cell } from "recharts";
import type { Equipment } from "@/hooks/usePlantData";
import { AXIS_TITLE_HEIGHT, axisTick, axisTitle, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { formatMonthYear, formatNumber, yearMonthToTime, formatRupees } from "@/lib/format";
import { activatable, activatableFocus } from "@/lib/a11y";
import { createRng } from "@/lib/seeded";
import { kpi } from "@/lib/icons";
import { ChartBox } from "@/components/dashboard/chartKit";
import { useCategoryAxis } from "@/hooks/useCategoryAxis";

const FAILURE_MODES = [
  { mode: "Bearing failure", count: 84, pct: 34, downtime: 624, cost: 312, mtbf: 11200, trend: "↑" },
  { mode: "Seal degradation", count: 54, pct: 22, downtime: 418, cost: 198, mtbf: 14800, trend: "→" },
  { mode: "Impeller fouling", count: 44, pct: 18, downtime: 302, cost: 142, mtbf: 16200, trend: "↓" },
  { mode: "Lube oil contamination", count: 30, pct: 12, downtime: 210, cost: 94, mtbf: 18400, trend: "↑" },
  { mode: "Coupling misalignment", count: 20, pct: 8, downtime: 168, cost: 62, mtbf: 22000, trend: "→" },
  { mode: "Other", count: 15, pct: 6, downtime: 120, cost: 48, mtbf: 28000, trend: "→" },
];

const bandRnd = createRng(1500);

const WEIBULL_DATA = Array.from({ length: 50 }, (_, i) => {
  const hours = i * 500;
  const beta = 2.1, eta = 18000;
  const survival = Math.exp(-Math.pow(hours / eta, beta)) * 100;
  const upper = Math.min(100, survival + 5 + bandRnd() * 3);
  const lower = Math.max(0, survival - 5 - bandRnd() * 3);
  return { hours, survival: Math.round(survival * 10) / 10, band: [Math.round(lower * 10) / 10, Math.round(upper * 10) / 10] as [number, number] };
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

const SCATTER_POINTS = SCATTER_DATA.map(d => ({ ...d, t: yearMonthToTime(d.date) }));

const MODE_COLORS: Record<string, string> = {
  "Bearing failure": seriesColor(0),
  "Seal degradation": seriesColor(1),
  "Impeller fouling": seriesColor(5),
  "Lube oil contamination": seriesColor(3),
  "Coupling misalignment": seriesColor(2),
  "Other": seriesColor(4),
};
interface Props {
  equipment: Equipment[];
}

const FailureAnalysis = ({ equipment }: Props) => {
  const categoryAxis = useCategoryAxis();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const filteredScatter = selectedMode
    ? SCATTER_POINTS.filter(d => d.mode === selectedMode)
    : SCATTER_POINTS;

  return (
    <PageHeader>
      {/* Quick stats */}
      <KpiGrid>
        <KpiTile icon={kpi.failures} label="Total failures (24 months)" value="247" />
        <KpiTile icon={kpi.downtime} label="Unplanned downtime" value="1,842" unit="hr" />
        <KpiTile icon={kpi.cost} label="Total maintenance cost" value={formatRupees(874)} />
        <KpiTile icon={kpi.mtbf} label="Average MTBF (fleet)" value="14,200" unit="hr" />
        <KpiTile icon={kpi.trend} label="MTBF trend" value="−8.3" unit="%" valueClassName="text-warning" />
        <KpiTile icon={kpi.mostFailing} label="Most failure-prone" value="FCV-D-022" hint="14 failures · 5.7% of fleet" valueClassName="type-display-lg" />
      </KpiGrid>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Failure Mode Pareto · All Equipment Classes">
          <ChartBox height="tall" label="Failure count by failure mode">
            <BarChart data={FAILURE_MODES} layout="vertical" margin={{ left: 0, right: 16, bottom: 4 }}>
              <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} tickMargin={8} height={AXIS_TITLE_HEIGHT} label={axisTitle("Failures (24 months)")} />
              <YAxis type="category" dataKey="mode" tickLine={false} axisLine={false} interval={0} {...categoryAxis} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} formatter={(v: number) => [v, "Failures"]} />
              <Bar isAnimationActive={false} dataKey="count" fill={seriesColor(0)} radius={[0, 4, 4, 0]} cursor="pointer"
                onClick={(d: { mode: string }) => setSelectedMode(selectedMode === d.mode ? null : d.mode)} />
            </BarChart>
          </ChartBox>
          {/* Pareto table */}
          <div className="mt-3 overflow-auto">
            <table className="w-full type-body-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Failure mode</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Count</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Downtime (hr)</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Cost (₹L)</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">MTBF (hr)</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary">Trend</th>
                </tr>
              </thead>
              <tbody>
                {FAILURE_MODES.map(f => (
                  <tr key={f.mode} className={`cursor-pointer border-b border-hairline hover:bg-raised ${activatableFocus} ${selectedMode === f.mode ? "bg-raised" : ""}`}
                    {...activatable(() => setSelectedMode(selectedMode === f.mode ? null : f.mode))}>
                    <td className={`py-2 px-3 font-medium ${selectedMode === f.mode ? "text-foreground" : ""}`}>{f.mode}</td>
                    <td className="text-right py-2 px-3 tabular whitespace-nowrap">{f.count}</td>
                    <td className="text-right py-2 px-3 tabular whitespace-nowrap">{f.downtime}</td>
                    <td className="text-right py-2 px-3 tabular whitespace-nowrap">{f.cost}</td>
                    <td className="text-right py-2 px-3 tabular whitespace-nowrap">{formatNumber(f.mtbf)}</td>
                    <td className={`text-center py-2 px-3 ${f.trend === "↑" ? "text-error" : f.trend === "↓" ? "text-success" : "text-tertiary"}`}>{f.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Weibull Survival Analysis · Compressor Fleet">
          <div className="type-caption mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-quaternary">
            <span className="flex items-center gap-1"><span className="inline-block h-0.5 w-3 bg-series-1" /> Survival</span>
            <span className="flex items-center gap-1"><span className="inline-block size-2 rounded-sm bg-series-1 opacity-20" /> Confidence band</span>
          </div>
          <ChartBox height="tall" label="Weibull survival curve with confidence band">
            <ComposedChart data={WEIBULL_DATA} margin={{ left: 6, right: 28, bottom: 4 }}>
              <XAxis tickMargin={8} height={AXIS_TITLE_HEIGHT} dataKey="hours" type="number" domain={[0, "dataMax"]} tickCount={6} tickFormatter={(v: number) => formatNumber(v)} tick={axisTick} tickLine={false} axisLine={false} label={axisTitle("Operating hours")} />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={axisTick} tickLine={false} axisLine={false} label={axisTitle("Survival (%)", -90)} width={40} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} labelFormatter={(v: number) => `${formatNumber(v)} hr`} formatter={(val: number | number[], name: string) => [Array.isArray(val) ? `${val[0]}-${val[1]}%` : `${val}%`, name === "band" ? "Confidence band" : "Survival"]} />
              <Area isAnimationActive={false} type="monotone" dataKey="band" stroke="none" fill={seriesColor(0)} fillOpacity={0.15} />
              <Line isAnimationActive={false} type="monotone" dataKey="survival" stroke={seriesColor(0)} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ChartBox>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-hairline bg-raised p-3">
              <p className="type-eyebrow text-quaternary">Shape parameter (β)</p>
              <p className="type-display-lg tabular mt-1 text-foreground">2.1</p>
              <p className="type-caption mt-0.5 text-quaternary">Wear-out failure pattern: failures accelerate with age</p>
            </div>
            <div className="rounded-lg border border-hairline bg-raised p-3">
              <p className="type-eyebrow text-quaternary">Scale parameter (η)</p>
              <p className="type-display-lg tabular mt-1 text-foreground">18,000<Unit>hr</Unit></p>
              <p className="type-caption mt-0.5 text-quaternary">63.2% of units fail by this point</p>
            </div>
          </div>
        </Panel>
      </div>

      {/* Failure event scatter */}
      <Panel
        title="Failure Event Timeline · Operating Hours at Failure"
        action={
          selectedMode && (
            <button
              onClick={() => setSelectedMode(null)}
              className="type-caption rounded-full text-quaternary outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-active"
            >
              Clear filter: {selectedMode}
            </button>
          )
        }
      >
        <ChartBox height="standard" label="Operating hours at failure over time">
          <ScatterChart margin={{ top: 12, left: 8, right: 24, bottom: 4 }}>
            <XAxis tickMargin={8} height={AXIS_TITLE_HEIGHT} dataKey="hours" name="Operating hours" type="number" domain={[0, "dataMax"]} tickCount={7} tickFormatter={(v: number) => formatNumber(v)} tick={axisTick} tickLine={false} axisLine={false} label={axisTitle("Operating hours at failure")} />
            <YAxis dataKey="t" name="Date" type="number" domain={["dataMin - 2592000000", "dataMax + 2592000000"]} tickCount={5} tickFormatter={(v: number) => formatMonthYear(v)} tick={axisTick} tickLine={false} axisLine={false} width={56} />
            <ZAxis dataKey="cost" range={[40, 400]} name="Repair cost (₹L)" />
            <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} cursor={{ strokeDasharray: "3 3" }}
              formatter={(val: number, name: string) => [name === "Repair cost (₹L)" ? formatRupees(val) : name === "Date" ? formatMonthYear(val) : formatNumber(val), name]} />
            <Scatter isAnimationActive={false} data={filteredScatter} fillOpacity={0.85}>
              {filteredScatter.map(d => <Cell key={`${d.tag}-${d.date}`} fill={MODE_COLORS[d.mode] ?? seriesColor(4)} />)}
            </Scatter>
          </ScatterChart>
        </ChartBox>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(MODE_COLORS).map(([mode, color]) => (
            <Chip key={mode} active={selectedMode === mode} onClick={() => setSelectedMode(selectedMode === mode ? null : mode)}>
              <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
              {mode}
            </Chip>
          ))}
        </div>
      </Panel>
    </PageHeader>
  );
};

export default FailureAnalysis;

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { toneChart } from "@/lib/status";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { completenessState } from "@/lib/status";
import { formatNumber } from "@/lib/format";

const COMPLETENESS_DATA = [
  { category: "Equipment tags", total: 2847, complete: 2847, pct: 100, color: toneChart.success },
  { category: "Sensor mappings", total: 42400, complete: 38200, pct: 90.1, color: toneChart.success },
  { category: "P&ID cross-refs", total: 12440, complete: 11892, pct: 95.6, color: toneChart.success },
  { category: "Alarm setpoints", total: 2847, complete: 2420, pct: 85.0, color: toneChart.warning },
  { category: "Equipment datasheets", total: 2847, complete: 2680, pct: 94.1, color: toneChart.success },
  { category: "Maintenance history", total: 2847, complete: 2104, pct: 73.9, color: toneChart.warning },
  { category: "Spare parts catalog", total: 2847, complete: 2847, pct: 100, color: toneChart.success },
  { category: "Operating procedures", total: 480, complete: 312, pct: 65.0, color: toneChart.error },
  { category: "Safety documentation", total: 1200, complete: 1140, pct: 95.0, color: toneChart.success },
  { category: "3D model coordinates", total: 2847, complete: 2847, pct: 100, color: toneChart.success },
];

const DataCompleteness = () => {
  const overall = Math.round(COMPLETENESS_DATA.reduce((s, d) => s + d.pct, 0) / COMPLETENESS_DATA.length * 10) / 10;
  const atRisk = COMPLETENESS_DATA.filter(d => d.pct < 80).length;

  return (
    <PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Overall Completeness", value: `${overall}%`, color: overall >= 90 ? "" : "text-warning" },
          { label: "Categories Tracked", value: COMPLETENESS_DATA.length.toString() },
          { label: "At 100%", value: COMPLETENESS_DATA.filter(d => d.pct === 100).length.toString() },
          { label: "Below 80%", value: atRisk.toString(), color: atRisk > 0 ? "text-error" : "" },
        ].map(s => (
          <KpiTile key={s.label} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      <Panel title="Completeness by Category">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={COMPLETENESS_DATA} layout="vertical" margin={{ left: 150 }}>
              <XAxis type="number" domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="category" tick={axisTick} tickLine={false} axisLine={false} width={140} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} formatter={(v: number) => `${v}%`} />
              <Bar isAnimationActive={false} dataKey="pct" radius={[0, 4, 4, 0]}>
                {COMPLETENESS_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
      </Panel>

      <Panel title="Detailed Breakdown" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Category</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Total Required</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Complete</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Remaining</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Completeness</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPLETENESS_DATA.map(d => (
                <tr key={d.category} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 font-medium">{d.category}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{formatNumber(d.total)}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{formatNumber(d.complete)}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{formatNumber(d.total - d.complete)}</td>
                  <td className="py-2 px-3 text-right tabular font-semibold whitespace-nowrap">
                    <span className={d.pct >= 95 ? "" : d.pct >= 80 ? "text-warning" : "text-error"}>{d.pct}%</span>
                  </td>
                  <td className="py-2 px-3">
                    <ToneStatus tone={completenessState(d.pct).tone} solid={completenessState(d.pct).solid}>{completenessState(d.pct).label}</ToneStatus>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default DataCompleteness;

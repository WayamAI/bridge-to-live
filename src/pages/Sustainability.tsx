import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, PieChart, Pie, Cell } from "recharts";
import ChartLegend from "@/components/dashboard/ChartLegend";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import PageHeader from "@/components/layout/PageHeader";
import { Panel , KpiTile } from "@/components/ui/primitives";
import { kpi } from "@/lib/icons";

const MONTHLY_EMISSIONS = [
  { month: "Oct '25", scope1: 4200, scope2: 2800, flaring: 840 },
  { month: "Nov '25", scope1: 4100, scope2: 2700, flaring: 920 },
  { month: "Dec '25", scope1: 4400, scope2: 2900, flaring: 780 },
  { month: "Jan '26", scope1: 4050, scope2: 2650, flaring: 680 },
  { month: "Feb '26", scope1: 3900, scope2: 2600, flaring: 720 },
  { month: "Mar '26", scope1: 3800, scope2: 2500, flaring: 640 },
];

const BY_SOURCE = [
  { name: "Gas Turbine", value: 42, color: seriesColor(0) },
  { name: "Flaring", value: 18, color: seriesColor(1) },
  { name: "Grid Electricity", value: 24, color: seriesColor(5) },
  { name: "Process Venting", value: 8, color: seriesColor(4) },
  { name: "Fugitive", value: 5, color: seriesColor(2) },
  { name: "Other", value: 3, color: seriesColor(3) },
];

const WATER_DATA = [
  { month: "Oct", consumption: 4800, recycled: 1200, target: 4500 },
  { month: "Nov", consumption: 4600, recycled: 1300, target: 4500 },
  { month: "Dec", consumption: 5100, recycled: 1100, target: 4500 },
  { month: "Jan", consumption: 4400, recycled: 1400, target: 4500 },
  { month: "Feb", consumption: 4200, recycled: 1500, target: 4500 },
  { month: "Mar", consumption: 4100, recycled: 1600, target: 4500 },
];

const Sustainability = () => {
  const ytdEmissions = MONTHLY_EMISSIONS.reduce((s, m) => s + m.scope1 + m.scope2 + m.flaring, 0);
  const target = 48000;
  const onTrack = ytdEmissions < target;

  return (
    <PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "YTD CO₂e Emissions", icon: kpi.emissions, value: `${(ytdEmissions / 1000).toFixed(1)}k T`, color: onTrack ? "" : "text-warning" },
          { label: "Annual Target", icon: kpi.target, value: `${(target / 1000).toFixed(0)}k T` },
          { label: "Flaring Reduction", icon: kpi.gas, value: "−24%" },
          { label: "Water Recycling Rate", icon: kpi.water, value: "32%" },
        ].map(s => (
          <KpiTile key={s.label} icon={s.icon} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Emissions */}
        <Panel title="Monthly GHG Emissions (T CO₂e)" className="lg:col-span-2">
            <ChartLegend items={[
              { label: "Scope 1 · Direct", color: seriesColor(0) },
              { label: "Scope 2 · Grid", color: seriesColor(1) },
              { label: "Flaring", color: seriesColor(5) },
            ]} />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MONTHLY_EMISSIONS}>
                <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Bar isAnimationActive={false} dataKey="scope1" stackId="a" fill={seriesColor(0)} name="Scope 1 · Direct" />
                <Bar isAnimationActive={false} dataKey="scope2" stackId="a" fill={seriesColor(1)} name="Scope 2 · Grid" />
                <Bar isAnimationActive={false} dataKey="flaring" stackId="a" fill={seriesColor(5)} name="Flaring" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        </Panel>

        {/* By Source */}
        <Panel title="Emissions by Source (%)">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie isAnimationActive={false} data={BY_SOURCE} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value" paddingAngle={2}>
                  {BY_SOURCE.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {BY_SOURCE.map(d => (
                <div key={d.name} className="flex items-center justify-between type-caption">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /><span>{d.name}</span></div>
                  <span className="tabular">{d.value}%</span>
                </div>
              ))}
            </div>
        </Panel>
      </div>

      {/* Water Usage */}
      <Panel title="Water Consumption & Recycling (m³/month)">
          <ChartLegend items={[
            { label: "Total consumption", color: seriesColor(0) },
            { label: "Recycled", color: seriesColor(1) },
            { label: "Target", color: seriesColor(4), kind: "dashed" },
          ]} />
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={WATER_DATA}>
              <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
              <Bar isAnimationActive={false} dataKey="consumption" fill={seriesColor(0)} name="Total Consumption" />
              <Bar isAnimationActive={false} dataKey="recycled" fill={seriesColor(1)} name="Recycled" radius={[4, 4, 0, 0]} />
              <Line isAnimationActive={false} type="monotone" dataKey="target" stroke={seriesColor(4)} strokeDasharray="5 5" name="Target" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
      </Panel>
    </PageHeader>
  );
};

export default Sustainability;

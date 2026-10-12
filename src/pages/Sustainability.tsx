import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Leaf, TrendingDown, AlertTriangle, Droplets } from "lucide-react";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";

const MONTHLY_EMISSIONS = [
  { month: "Oct '25", scope1: 4200, scope2: 2800, flaring: 840 },
  { month: "Nov '25", scope1: 4100, scope2: 2700, flaring: 920 },
  { month: "Dec '25", scope1: 4400, scope2: 2900, flaring: 780 },
  { month: "Jan '26", scope1: 4050, scope2: 2650, flaring: 680 },
  { month: "Feb '26", scope1: 3900, scope2: 2600, flaring: 720 },
  { month: "Mar '26", scope1: 3800, scope2: 2500, flaring: 640 },
];

const BY_SOURCE = [
  { name: "Gas Turbine", value: 42, color: seriesColor(1) },
  { name: "Flaring", value: 18, color: seriesColor(3) },
  { name: "Grid Electricity", value: 24, color: seriesColor(0) },
  { name: "Process Venting", value: 8, color: seriesColor(2) },
  { name: "Fugitive", value: 5, color: seriesColor(5) },
  { name: "Other", value: 3, color: seriesColor(4) },
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
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold flex items-center gap-2"><Leaf className="w-5 h-5 text-operational" /> Sustainability & Emissions</h2>
      <p className="text-xs text-muted-foreground -mt-3">Environmental performance tracking — carbon emissions, water usage, waste management</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "YTD CO₂e Emissions", value: `${(ytdEmissions / 1000).toFixed(1)}k T`, color: onTrack ? "text-operational" : "text-gap" },
          { label: "Annual Target", value: `${(target / 1000).toFixed(0)}k T`, color: "text-muted-foreground" },
          { label: "Flaring Reduction", value: "−24%", color: "text-operational" },
          { label: "Water Recycling Rate", value: "32%", color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Emissions */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Monthly GHG Emissions (T CO₂e)</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MONTHLY_EMISSIONS}>
                <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Bar isAnimationActive={false} dataKey="scope1" stackId="a" fill={seriesColor(1)} name="Scope 1 — Direct" />
                <Bar isAnimationActive={false} dataKey="scope2" stackId="a" fill={seriesColor(0)} name="Scope 2 — Grid" />
                <Bar isAnimationActive={false} dataKey="flaring" stackId="a" fill={seriesColor(3)} name="Flaring" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Source */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Emissions by Source (%)</h3>
          </div>
          <div className="p-4">
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
                <div key={d.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /><span>{d.name}</span></div>
                  <span className="font-mono">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Water Usage */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Droplets className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-semibold">Water Consumption & Recycling (m³/month)</h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WATER_DATA}>
              <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
              <Bar isAnimationActive={false} dataKey="consumption" fill={seriesColor(0)} name="Total Consumption" />
              <Bar isAnimationActive={false} dataKey="recycled" fill={seriesColor(1)} name="Recycled" radius={[4, 4, 0, 0]} />
              <Line isAnimationActive={false} type="monotone" dataKey="target" stroke={seriesColor(3)} strokeDasharray="5 5" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;

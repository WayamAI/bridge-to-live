import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { toneChart } from "@/lib/status";

const MONTHLY_COST = [
  { month: "Oct '25", planned: 42, predictive: 28, corrective: 18, emergency: 8 },
  { month: "Nov '25", planned: 38, predictive: 32, corrective: 22, emergency: 4 },
  { month: "Dec '25", planned: 45, predictive: 24, corrective: 14, emergency: 12 },
  { month: "Jan '26", planned: 40, predictive: 35, corrective: 16, emergency: 6 },
  { month: "Feb '26", planned: 44, predictive: 30, corrective: 20, emergency: 10 },
  { month: "Mar '26", planned: 48, predictive: 38, corrective: 12, emergency: 2 },
];

const BY_UNIT = [
  { name: "Compression A", value: 284, color: seriesColor(1) },
  { name: "Compression B", value: 196, color: seriesColor(0) },
  { name: "Cooling Water", value: 142, color: seriesColor(2) },
  { name: "Power Gen", value: 118, color: seriesColor(3) },
  { name: "Feed Gas", value: 94, color: seriesColor(5) },
  { name: "Others", value: 142, color: seriesColor(4) },
];

const PLANNED_VS_REACTIVE = [
  { month: "Oct", planned: 72, reactive: 28 },
  { month: "Nov", planned: 68, reactive: 32 },
  { month: "Dec", planned: 64, reactive: 36 },
  { month: "Jan", planned: 74, reactive: 26 },
  { month: "Feb", planned: 70, reactive: 30 },
  { month: "Mar", planned: 82, reactive: 18 },
];

const MaintenanceCost = () => {
  const totalYTD = 976;
  const budgetYTD = 1080;
  const variance = ((budgetYTD - totalYTD) / budgetYTD * 100).toFixed(1);

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold">Maintenance Cost Tracker</h2>
      <p className="text-xs text-muted-foreground -mt-3">Budget tracking and cost allocation across maintenance activities</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "YTD Spend", value: `₹${(totalYTD / 100).toFixed(2)} Cr`, color: "text-foreground" },
          { label: "YTD Budget", value: `₹${(budgetYTD / 100).toFixed(2)} Cr`, color: "text-muted-foreground" },
          { label: "Variance", value: `${variance}% under`, color: "text-operational" },
          { label: "Planned:Reactive Ratio", value: "82:18", color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Stacked Bar */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Monthly Maintenance Cost Breakdown (₹L)</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MONTHLY_COST}>
                <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Bar isAnimationActive={false} dataKey="planned" stackId="a" fill={toneChart.success} name="Planned PM" />
                <Bar isAnimationActive={false} dataKey="predictive" stackId="a" fill={toneChart.info} name="Predictive" />
                <Bar isAnimationActive={false} dataKey="corrective" stackId="a" fill={toneChart.warning} name="Corrective" />
                <Bar isAnimationActive={false} dataKey="emergency" stackId="a" fill={toneChart.error} name="Emergency" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Process Unit */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Cost by Process Unit (₹L)</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie isAnimationActive={false} data={BY_UNIT} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={2}>
                  {BY_UNIT.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {BY_UNIT.map(d => (
                <div key={d.name} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-mono">₹{d.value}L</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Planned vs Reactive */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Planned vs. Reactive Maintenance Ratio (%)</h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={PLANNED_VS_REACTIVE}>
              <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
              <Bar isAnimationActive={false} dataKey="planned" stackId="a" fill={toneChart.success} name="Planned %" />
              <Bar isAnimationActive={false} dataKey="reactive" stackId="a" fill={toneChart.error} name="Reactive %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCost;

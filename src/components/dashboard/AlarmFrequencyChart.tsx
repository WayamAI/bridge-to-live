import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { toneChart } from "@/lib/status";

const AlarmFrequencyChart = () => {
  const data = useMemo(() => {
    const points = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      points.push({
        date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        Critical: Math.floor(Math.random() * 8 + 2),
        Major: Math.floor(Math.random() * 15 + 5),
        Minor: Math.floor(Math.random() * 30 + 10),
      });
    }
    return points;
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Alarm Frequency — 30 Days</h3>
        <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-series-4 inline-block" /> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-series-3 inline-block" /> Major</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-series-1 inline-block" /> Minor</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <XAxis dataKey="date" tick={axisTick} tickLine={false} axisLine={false} interval={6} />
          <YAxis tick={axisTick} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={chartTooltipLabelStyle}
          />
          <Bar isAnimationActive={false} dataKey="Critical" stackId="a" fill={toneChart.error} radius={[0, 0, 0, 0]} />
          <Bar isAnimationActive={false} dataKey="Major" stackId="a" fill={toneChart.warning} radius={[0, 0, 0, 0]} />
          <Bar isAnimationActive={false} dataKey="Minor" stackId="a" fill={toneChart.info} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlarmFrequencyChart;

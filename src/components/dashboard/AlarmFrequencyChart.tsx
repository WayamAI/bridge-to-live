import { useMemo } from "react";
import { Panel } from "@/components/ui/primitives";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { toneChart } from "@/lib/status";
import { formatDate } from "@/lib/format";
import { createRng } from "@/lib/seeded";

const AlarmFrequencyChart = () => {
  const data = useMemo(() => {
    const points = [];
    const rnd = createRng(2901);
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000);
      points.push({
        date: formatDate(date),
        Critical: Math.floor(rnd() * 8 + 2),
        Major: Math.floor(rnd() * 15 + 5),
        Minor: Math.floor(rnd() * 30 + 10),
      });
    }
    return points;
  }, []);

  return (
    <Panel
      title="Alarm Frequency · 30 Days"
    >
      <div className="type-caption mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-quaternary">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-series-4 inline-block" /> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-series-3 inline-block" /> Major</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-series-1 inline-block" /> Minor</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 24, left: -15, bottom: 0 }}>
          <XAxis dataKey="date" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={28} />
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
    </Panel>
  );
};

export default AlarmFrequencyChart;

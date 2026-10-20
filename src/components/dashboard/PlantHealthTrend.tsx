import { useMemo } from "react";
import { Panel } from "@/components/ui/primitives";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { formatDate } from "@/lib/format";
import { createRng } from "@/lib/seeded";

const PlantHealthTrend = () => {
  const data = useMemo(() => {
    const points = [];
    const rnd = createRng(9001);
    let health = 91;
    const now = Date.now();
    for (let i = 90; i >= 0; i--) {
      health += (rnd() - 0.52) * 1.2;
      health = Math.max(78, Math.min(96, health));
      const date = new Date(now - i * 86400000);
      points.push({
        date: formatDate(date),
        health: Math.round(health * 10) / 10,
        isForecast: i < 30,
      });
    }
    // Add maintenance markers
    points[15].maintenance = true;
    points[42].maintenance = true;
    points[68].maintenance = true;
    return points;
  }, []);

  return (
    <Panel
      title="Plant Health Trend · 90 Days"
    >
      <div className="type-caption mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-quaternary">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-series-1 inline-block" /> Health Score</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-series-1 opacity-30 inline-block" /> Forecast</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t border-dashed border-quaternary inline-block" /> PM Events</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 5, right: 30, left: -15, bottom: 0 }}>
          <XAxis dataKey="date" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={28} />
          <YAxis domain={[75, 100]} tick={axisTick} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={chartTooltipLabelStyle}
          />
          <ReferenceLine y={90} stroke={seriesColor(4)} strokeDasharray="5 5" strokeWidth={1} label={{ value: "Target 90%", position: "right", fontSize: 9, fill: "var(--text-quaternary)" }} />
          <Line isAnimationActive={false} type="monotone" dataKey="health" stroke={seriesColor(0)} strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Panel>
  );
};

export default PlantHealthTrend;

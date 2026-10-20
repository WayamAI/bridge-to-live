import { useMemo } from "react";
import { Panel } from "@/components/ui/primitives";
import { Line, XAxis, YAxis, Tooltip, ReferenceLine, ComposedChart } from "recharts";
import ChartLegend from "@/components/dashboard/ChartLegend";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor, timeAxisProps } from "@/components/dashboard/chartTheme";
import { formatDate } from "@/lib/format";
import { createRng } from "@/lib/seeded";
import { panelIcon } from "@/lib/icons";
import { ChartBox } from "@/components/dashboard/chartKit";
import { formatIsoDayMonth } from "@/lib/format";

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
      icon={panelIcon.healthTrend}
    >
      <ChartLegend items={[
        { label: "Health score", color: seriesColor(0), kind: "line" },
        { label: "Target 90%", color: seriesColor(4), kind: "dashed" },
        { label: "PM events", color: "var(--text-quaternary)", kind: "dashed" },
      ]} />
      <ChartBox height="standard" label="Plant health score, last 90 days">
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
          <XAxis tickMargin={8} dataKey="date" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={formatIsoDayMonth} {...timeAxisProps} />
          <YAxis domain={[75, 100]} ticks={[75, 80, 85, 90, 95, 100]} tickFormatter={(v: number) => `${v}%`} tick={axisTick} tickLine={false} axisLine={false} width={40} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            labelStyle={chartTooltipLabelStyle}
            formatter={(v: number) => [`${v}%`, "Health score"]}
          />
          <ReferenceLine y={90} stroke={seriesColor(4)} strokeDasharray="5 5" strokeWidth={1} />
          {data.filter(d => d.maintenance).map(d => (
            <ReferenceLine key={d.date} x={d.date} stroke="var(--text-quaternary)" strokeDasharray="2 3" strokeWidth={1} />
          ))}
          <Line isAnimationActive={false} type="monotone" dataKey="health" stroke={seriesColor(0)} strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ChartBox>
    </Panel>
  );
};

export default PlantHealthTrend;

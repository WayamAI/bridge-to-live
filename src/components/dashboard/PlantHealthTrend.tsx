import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";

const PlantHealthTrend = () => {
  const data = useMemo(() => {
    const points = [];
    let health = 91;
    const now = Date.now();
    for (let i = 90; i >= 0; i--) {
      health += (Math.random() - 0.52) * 1.2;
      health = Math.max(78, Math.min(96, health));
      const date = new Date(now - i * 86400000);
      points.push({
        date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
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
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Plant Health Trend — 90 Days</h3>
        <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block" /> Health Score</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary/30 inline-block" /> Forecast</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t border-dashed border-muted-foreground inline-block" /> PM Events</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)" }} tickLine={false} interval={14} />
          <YAxis domain={[75, 100]} tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "8px", fontSize: "11px" }}
            labelStyle={{ color: "hsl(210, 20%, 92%)" }}
          />
          <ReferenceLine y={90} stroke="hsl(35, 90%, 55%)" strokeDasharray="5 5" strokeWidth={1} label={{ value: "Target 90%", position: "right", fontSize: 9, fill: "hsl(35, 90%, 55%)" }} />
          <Line type="monotone" dataKey="health" stroke="hsl(170, 80%, 45%)" strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlantHealthTrend;

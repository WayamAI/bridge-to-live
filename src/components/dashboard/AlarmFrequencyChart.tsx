import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-destructive inline-block" /> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gap inline-block" /> Major</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-engineering inline-block" /> Minor</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)" }} tickLine={false} interval={6} />
          <YAxis tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: "8px", fontSize: "11px" }}
            labelStyle={{ color: "hsl(210, 20%, 92%)" }}
          />
          <Bar dataKey="Critical" stackId="a" fill="hsl(0, 72%, 51%)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Major" stackId="a" fill="hsl(35, 90%, 55%)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Minor" stackId="a" fill="hsl(235, 55%, 55%)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlarmFrequencyChart;

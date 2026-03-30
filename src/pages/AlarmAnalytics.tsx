import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import type { Alert } from "@/hooks/usePlantData";

const HOURLY_ALARMS = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  critical: Math.floor(Math.random() * 4),
  warning: Math.floor(Math.random() * 8 + 2),
  info: Math.floor(Math.random() * 6 + 1),
}));

const DAILY_TREND = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 29 + i);
  return {
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    total: Math.floor(Math.random() * 40 + 60),
    ackTime: Math.round((Math.random() * 20 + 5) * 10) / 10,
  };
});

const CHATTERING = [
  { tag: "TT-A-041", parameter: "Temperature", count: 48, avgDuration: "12 sec", status: "Chattering" },
  { tag: "PT-A-042", parameter: "Pressure", count: 34, avgDuration: "8 sec", status: "Chattering" },
  { tag: "FT-D-018", parameter: "Flow Rate", count: 22, avgDuration: "28 sec", status: "Fleeting" },
  { tag: "COMP-A-001", parameter: "Discharge Temp", count: 18, avgDuration: "47 min", status: "Stale" },
  { tag: "HEX-C-003", parameter: "Fouling Factor", count: 14, avgDuration: "1 hr 20 min", status: "Stale" },
  { tag: "MOT-E-018", parameter: "Current", count: 12, avgDuration: "6 hr", status: "Standing" },
  { tag: "SUB-E-001", parameter: "Power Factor", count: 10, avgDuration: "3.2 hr", status: "Standing" },
  { tag: "AGC-B-004", parameter: "Fan Vibration", count: 8, avgDuration: "1 day", status: "Standing" },
  { tag: "FCV-D-022", parameter: "Positioner", count: 6, avgDuration: "2 hr", status: "Repeating" },
  { tag: "PUMP-CW-003", parameter: "Efficiency", count: 4, avgDuration: "4 hr", status: "Repeating" },
];

const STATUS_COLORS: Record<string, string> = {
  Chattering: "bg-destructive/10 text-destructive",
  Fleeting: "bg-gap/10 text-gap",
  Stale: "bg-gap/10 text-gap",
  Standing: "bg-secondary/10 text-secondary",
  Repeating: "bg-muted text-muted-foreground",
};

interface Props {
  alerts: Alert[];
}

const AlarmAnalytics = ({ alerts }: Props) => {
  const totalToday = HOURLY_ALARMS.reduce((s, h) => s + h.critical + h.warning + h.info, 0);
  const avgRate = (totalToday / 24).toFixed(1);
  const avgAckTime = "8.4 min";
  const highAlarmPct = "12.4%";

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h1 className="text-lg font-bold">Alarm History & Analytics</h1>
      <p className="text-xs text-muted-foreground -mt-3">Historical alarm performance analysis and chattering alarm identification</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Alarms Today", value: totalToday.toString() },
          { label: "Avg Alarm Rate", value: `${avgRate}/hr` },
          { label: "Avg Ack Time", value: avgAckTime },
          { label: "Time in High-Alarm State", value: highAlarmPct, color: "text-gap" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alarms by Hour */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Alarms by Hour — Today</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={HOURLY_ALARMS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 9 }} interval={2} />
                <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="critical" stackId="a" fill="hsl(0, 72%, 51%)" name="Critical" />
                <Bar dataKey="warning" stackId="a" fill="hsl(35, 90%, 55%)" name="Warning" />
                <Bar dataKey="info" stackId="a" fill="hsl(235, 55%, 55%)" name="Info" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 30-Day Trend */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">30-Day Alarm Trend + Avg Acknowledgment Time</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={DAILY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="date" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 9 }} interval={4} />
                <YAxis yAxisId="left" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 11 }} />
                <Line yAxisId="left" type="monotone" dataKey="total" stroke="hsl(170, 80%, 45%)" strokeWidth={2} dot={false} name="Total Alarms" />
                <Line yAxisId="right" type="monotone" dataKey="ackTime" stroke="hsl(35, 90%, 55%)" strokeWidth={2} dot={false} name="Avg Ack Time (min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Chattering Alarms */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Top 10 Most Frequent Alarms — This Week</h3>
          <p className="text-[9px] text-muted-foreground mt-0.5">Alarms with &gt;10 activations/24hr flagged as chattering</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-center py-2 px-2 font-medium w-8">#</th>
                <th className="text-left py-2 px-3 font-medium">Tag</th>
                <th className="text-left py-2 px-3 font-medium">Parameter</th>
                <th className="text-right py-2 px-3 font-medium">Activations (7d)</th>
                <th className="text-left py-2 px-3 font-medium">Avg Duration</th>
                <th className="text-left py-2 px-3 font-medium">Classification</th>
              </tr>
            </thead>
            <tbody>
              {CHATTERING.map((a, i) => (
                <tr key={a.tag} className={`border-b border-border/50 hover:bg-muted/20 ${a.count > 20 ? "bg-destructive/5" : ""}`}>
                  <td className="text-center py-2 px-2 font-mono">{i + 1}</td>
                  <td className="py-2 px-3 font-mono text-primary font-medium">{a.tag}</td>
                  <td className="py-2 px-3">{a.parameter}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">{a.count}</td>
                  <td className="py-2 px-3 font-mono">{a.avgDuration}</td>
                  <td className="py-2 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[a.status]}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlarmAnalytics;

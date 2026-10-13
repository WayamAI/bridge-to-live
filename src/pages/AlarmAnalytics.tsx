import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import type { Alert } from "@/hooks/usePlantData";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { toneChart } from "@/lib/status";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { chatteringStatus } from "@/lib/status";
import { formatDate } from "@/lib/format";

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
    date: formatDate(d),
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

interface Props {
  alerts: Alert[];
}

const AlarmAnalytics = ({ alerts }: Props) => {
  const totalToday = HOURLY_ALARMS.reduce((s, h) => s + h.critical + h.warning + h.info, 0);
  const avgRate = (totalToday / 24).toFixed(1);
  const avgAckTime = "8.4 min";
  const highAlarmPct = "12.4%";

  return (
    <PageHeader title="Alarm History & Analytics" subtitle="Historical alarm performance analysis and chattering alarm identification">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Alarms Today", value: totalToday.toString() },
          { label: "Avg Alarm Rate", value: `${avgRate}/hr` },
          { label: "Avg Ack Time", value: avgAckTime },
          { label: "Time in High-Alarm State", value: highAlarmPct },
        ].map(s => (
          <KpiTile key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alarms by Hour */}
        <Panel title="Alarms by Hour · Today">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={HOURLY_ALARMS}>
                <XAxis dataKey="hour" tick={axisTick} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Bar isAnimationActive={false} dataKey="critical" stackId="a" fill={toneChart.error} name="Critical" />
                <Bar isAnimationActive={false} dataKey="warning" stackId="a" fill={toneChart.warning} name="Warning" />
                <Bar isAnimationActive={false} dataKey="info" stackId="a" fill={toneChart.info} name="Info" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
        </Panel>

        {/* 30-Day Trend */}
        <Panel title="30-Day Alarm Trend + Avg Acknowledgment Time">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={DAILY_TREND}>
                <XAxis dataKey="date" tick={axisTick} tickLine={false} axisLine={false} interval={4} />
                <YAxis yAxisId="left" tick={axisTick} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={axisTick} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Line isAnimationActive={false} yAxisId="left" type="monotone" dataKey="total" stroke={seriesColor(0)} strokeWidth={2} dot={false} name="Total Alarms" />
                <Line isAnimationActive={false} yAxisId="right" type="monotone" dataKey="ackTime" stroke={seriesColor(1)} strokeWidth={2} dot={false} name="Avg Ack Time (min)" />
              </LineChart>
            </ResponsiveContainer>
        </Panel>
      </div>

      {/* Top Chattering Alarms */}
      <Panel title="Top 10 Most Frequent Alarms · This Week" padded={false}>
        <p className="type-caption px-4 py-3 text-quaternary">Alarms with &gt;10 activations/24hr flagged as chattering</p>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary w-8">#</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Tag</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Parameter</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Activations (7d)</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Avg Duration</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Classification</th>
              </tr>
            </thead>
            <tbody>
              {CHATTERING.map((a, i) => (
                <tr key={a.tag} className="border-b border-hairline hover:bg-raised">
                  <td className="text-center py-2 px-3 tabular whitespace-nowrap">{i + 1}</td>
                  <td className="py-2 px-3 tabular text-foreground font-medium whitespace-nowrap">{a.tag}</td>
                  <td className="py-2 px-3">{a.parameter}</td>
                  <td className="py-2 px-3 text-right tabular font-semibold whitespace-nowrap">{a.count}</td>
                  <td className="py-2 px-3 tabular whitespace-nowrap">{a.avgDuration}</td>
                  <td className="py-2 px-3"><ToneStatus tone={chatteringStatus[a.status].tone} solid={chatteringStatus[a.status].solid}>{a.status}</ToneStatus></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default AlarmAnalytics;

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import type { Alert } from "@/hooks/usePlantData";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor, timeAxisProps } from "@/components/dashboard/chartTheme";
import { toneChart, workflowTone } from "@/lib/status";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { chatteringStatus } from "@/lib/status";
import { formatDate, formatIsoDayMonth } from "@/lib/format";
import { createRng } from "@/lib/seeded";
import { kpi } from "@/lib/icons";
import { ChartBox } from "@/components/dashboard/chartKit";
import ChartLegend from "@/components/dashboard/ChartLegend";

const rnd = createRng(2402);

const HOURLY_ALARMS = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  critical: Math.floor(rnd() * 4),
  warning: Math.floor(rnd() * 8 + 2),
  info: Math.floor(rnd() * 6 + 1),
}));

const DAILY_TREND = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 29 + i);
  return {
    date: formatDate(d),
    total: Math.floor(rnd() * 40 + 60),
    ackTime: Math.round((rnd() * 20 + 5) * 10) / 10,
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
    <PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Alarms Today", icon: kpi.count, value: totalToday.toString() },
          { label: "Avg Alarm Rate", icon: kpi.alarmRate, value: `${avgRate}/hr` },
          { label: "Avg Ack Time", icon: kpi.duration, value: avgAckTime },
          { label: "Time in High-Alarm State", icon: kpi.alarmState, value: highAlarmPct },
        ].map(s => (
          <KpiTile key={s.label} icon={s.icon} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alarms by Hour */}
        <Panel title="Alarms by Hour · Today">
            <ChartLegend items={[
              { label: "Critical", color: toneChart.error },
              { label: "Warning", color: toneChart.warning },
              { label: "Info", color: toneChart.info },
            ]} />
            <ChartBox height="standard" label="Alarms per hour today by severity">
              <BarChart data={HOURLY_ALARMS}>
                <XAxis tickMargin={8} dataKey="hour" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                <YAxis tick={axisTick} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Bar isAnimationActive={false} dataKey="critical" stackId="a" fill={toneChart.error} name="Critical" />
                <Bar isAnimationActive={false} dataKey="warning" stackId="a" fill={toneChart.warning} name="Warning" />
                <Bar isAnimationActive={false} dataKey="info" stackId="a" fill={toneChart.info} name="Info" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartBox>
        </Panel>

        {/* 30-Day Trend */}
        <Panel title="30-Day Alarm Trend + Avg Acknowledgment Time">
            <ChartLegend items={[
              { label: "Total alarms (left)", color: seriesColor(0), kind: "line" },
              { label: "Avg ack time, minutes (right)", color: seriesColor(1), kind: "line" },
            ]} />
            <ChartBox height="standard" label="Alarms per day and average acknowledgement time, last 30 days">
              <LineChart data={DAILY_TREND} margin={{ right: 20, left: 0 }}>
                <XAxis tickMargin={8} dataKey="date" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={formatIsoDayMonth} {...timeAxisProps} />
                <YAxis yAxisId="left" tick={axisTick} tickLine={false} axisLine={false} width={40} />
                <YAxis yAxisId="right" orientation="right" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}m`} width={40} />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                <Line isAnimationActive={false} yAxisId="left" type="monotone" dataKey="total" stroke={seriesColor(0)} strokeWidth={2} dot={false} name="Total Alarms" />
                <Line isAnimationActive={false} yAxisId="right" type="monotone" dataKey="ackTime" stroke={seriesColor(1)} strokeWidth={2} dot={false} name="Avg Ack Time (min)" />
              </LineChart>
            </ChartBox>
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
                  <td className="py-2 px-3"><ToneStatus tone={workflowTone(chatteringStatus, a.status).tone} solid={workflowTone(chatteringStatus, a.status).solid}>{a.status}</ToneStatus></td>
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

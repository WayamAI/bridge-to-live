import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Line, Cell } from "recharts";
import { AlertTriangle, Clock } from "lucide-react";
import type { Equipment } from "@/hooks/usePlantData";

interface Props {
  equipment: Equipment[];
}

const RemainingUsefulLife = ({ equipment }: Props) => {
  const distribution = useMemo(() => {
    const bins = [
      { range: "0–500 hr", min: 0, max: 500 / 24, count: 0, color: "hsl(0, 72%, 51%)" },
      { range: "500–1k hr", min: 500 / 24, max: 1000 / 24, count: 0, color: "hsl(0, 72%, 51%)" },
      { range: "1k–2k hr", min: 1000 / 24, max: 2000 / 24, count: 0, color: "hsl(35, 90%, 55%)" },
      { range: "2k–3k hr", min: 2000 / 24, max: 3000 / 24, count: 0, color: "hsl(35, 90%, 55%)" },
      { range: "3k–5k hr", min: 3000 / 24, max: 5000 / 24, count: 0, color: "hsl(170, 80%, 45%)" },
      { range: "5k+ hr", min: 5000 / 24, max: 99999, count: 0, color: "hsl(170, 80%, 45%)" },
    ];
    equipment.forEach(e => {
      if (e.rulDays !== null) {
        const bin = bins.find(b => e.rulDays! >= b.min && e.rulDays! < b.max);
        if (bin) bin.count++;
      }
    });
    return bins;
  }, [equipment]);

  const criticalEquip = useMemo(() =>
    equipment.filter(e => e.rulDays !== null && e.rulDays < 90)
      .sort((a, b) => (a.rulDays ?? 0) - (b.rulDays ?? 0)),
    [equipment]
  );

  const fleetAge = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const month = new Date(2025, 4 + i, 1);
      return {
        month: month.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
        young: Math.round(18 - i * 0.3 + Math.random() * 2),
        mid: Math.round(14 + i * 0.2 + Math.random()),
        old: Math.round(8 + i * 0.4 + Math.random()),
        failures: Math.round(2 + i * 0.3 + Math.random() * 2),
      };
    }), []
  );

  const getFailureProb = (rul: number) => rul < 15 ? 92 : rul < 30 ? 74 : rul < 60 ? 48 : 22;
  const getDominantMode = (cls: string) => {
    const map: Record<string, string> = { COMP: "Bearing failure", PUMP: "Seal degradation", HEX: "Fouling", FCV: "Positioner fault", MOT: "Winding insulation", TURB: "Blade erosion" };
    return map[cls] || "General wear";
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold">Remaining Useful Life (RUL)</h2>
      <p className="text-xs text-muted-foreground -mt-3">Predicted remaining operating life across the equipment fleet</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* RUL Distribution */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">RUL Distribution — Equipment Fleet</h3>
            <p className="text-[9px] text-muted-foreground mt-0.5">Dashed line = standard PM interval (3,000 hr)</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="range" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {distribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Critical (0–1k hr)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Watch (1k–3k hr)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Healthy (3k+ hr)</span>
            </div>
          </div>
        </div>

        {/* Fleet Age Profile */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Fleet Age Profile — Monthly Trend</h3>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={fleetAge}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="young" stackId="1" fill="hsl(170, 80%, 45%)" fillOpacity={0.6} stroke="hsl(170, 80%, 45%)" name="<5k hr" />
                <Area type="monotone" dataKey="mid" stackId="1" fill="hsl(35, 90%, 55%)" fillOpacity={0.6} stroke="hsl(35, 90%, 55%)" name="5k–15k hr" />
                <Area type="monotone" dataKey="old" stackId="1" fill="hsl(0, 72%, 51%)" fillOpacity={0.6} stroke="hsl(0, 72%, 51%)" name=">15k hr" />
                <Line type="monotone" dataKey="failures" stroke="hsl(210, 20%, 92%)" strokeWidth={2} dot={{ r: 3 }} name="Monthly Failures" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Equipment Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <h3 className="text-sm font-semibold">Critical Equipment — Predicted End-of-Life within 90 Days</h3>
          <span className="ml-auto text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">{criticalEquip.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Tag</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Class</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Process Unit</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Operating Hours</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">RUL (days)</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Failure Prob. (90d)</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Dominant Failure Mode</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {criticalEquip.map(e => (
                <tr key={e.id} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 tabular font-medium text-foreground whitespace-nowrap">{e.tag}</td>
                  <td className="py-2 px-3">{e.classLabel}</td>
                  <td className="py-2 px-3">{e.processUnit}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{e.runtimeHours.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">
                    <span className={e.rulDays! < 30 ? "text-destructive font-bold" : "text-gap"}>{e.rulDays}</span>
                  </td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">
                    <span className={getFailureProb(e.rulDays!) > 70 ? "text-destructive" : "text-gap"}>{getFailureProb(e.rulDays!)}%</span>
                  </td>
                  <td className="py-2 px-3">{getDominantMode(e.equipmentClass)}</td>
                  <td className="py-2 px-3">
                    <span className="type-body-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {e.rulDays! < 20 ? "Schedule immediate replacement" : "Increase monitoring frequency"}
                    </span>
                  </td>
                </tr>
              ))}
              {criticalEquip.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center">No equipment predicted to reach end-of-life within 90 days</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RemainingUsefulLife;

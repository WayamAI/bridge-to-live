import { FileCheck, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COMPLETENESS_DATA = [
  { category: "Equipment tags", total: 2847, complete: 2847, pct: 100, color: "hsl(170, 80%, 45%)" },
  { category: "Sensor mappings", total: 42400, complete: 38200, pct: 90.1, color: "hsl(170, 80%, 45%)" },
  { category: "P&ID cross-refs", total: 12440, complete: 11892, pct: 95.6, color: "hsl(170, 80%, 45%)" },
  { category: "Alarm setpoints", total: 2847, complete: 2420, pct: 85.0, color: "hsl(35, 90%, 55%)" },
  { category: "Equipment datasheets", total: 2847, complete: 2680, pct: 94.1, color: "hsl(170, 80%, 45%)" },
  { category: "Maintenance history", total: 2847, complete: 2104, pct: 73.9, color: "hsl(35, 90%, 55%)" },
  { category: "Spare parts catalog", total: 2847, complete: 2847, pct: 100, color: "hsl(170, 80%, 45%)" },
  { category: "Operating procedures", total: 480, complete: 312, pct: 65.0, color: "hsl(0, 72%, 51%)" },
  { category: "Safety documentation", total: 1200, complete: 1140, pct: 95.0, color: "hsl(170, 80%, 45%)" },
  { category: "3D model coordinates", total: 2847, complete: 2847, pct: 100, color: "hsl(170, 80%, 45%)" },
];

const DataCompleteness = () => {
  const overall = Math.round(COMPLETENESS_DATA.reduce((s, d) => s + d.pct, 0) / COMPLETENESS_DATA.length * 10) / 10;
  const atRisk = COMPLETENESS_DATA.filter(d => d.pct < 80).length;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold flex items-center gap-2"><FileCheck className="w-5 h-5 text-primary" /> Data Completeness Monitor</h2>
      <p className="text-xs text-muted-foreground -mt-3">Tracking data completeness across all engineering and operational data categories</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Overall Completeness", value: `${overall}%`, color: overall >= 90 ? "text-operational" : "text-gap" },
          { label: "Categories Tracked", value: COMPLETENESS_DATA.length.toString() },
          { label: "At 100%", value: COMPLETENESS_DATA.filter(d => d.pct === 100).length.toString(), color: "text-operational" },
          { label: "Below 80%", value: atRisk.toString(), color: atRisk > 0 ? "text-destructive" : "text-operational" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Completeness by Category</h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={COMPLETENESS_DATA} layout="vertical" margin={{ left: 150 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
              <YAxis type="category" dataKey="category" tick={{ fill: "hsl(210, 20%, 92%)", fontSize: 10 }} width={140} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {COMPLETENESS_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Detailed Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Category</th>
                <th className="text-right py-2 px-3 font-medium">Total Required</th>
                <th className="text-right py-2 px-3 font-medium">Complete</th>
                <th className="text-right py-2 px-3 font-medium">Remaining</th>
                <th className="text-right py-2 px-3 font-medium">Completeness</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {COMPLETENESS_DATA.map(d => (
                <tr key={d.category} className={`border-b border-border/50 hover:bg-muted/20 ${d.pct < 80 ? "bg-destructive/5" : ""}`}>
                  <td className="py-2 px-3 font-medium">{d.category}</td>
                  <td className="py-2 px-3 text-right font-mono">{d.total.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-mono">{d.complete.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-mono">{(d.total - d.complete).toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    <span className={d.pct >= 95 ? "text-operational" : d.pct >= 80 ? "text-gap" : "text-destructive"}>{d.pct}%</span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${d.pct === 100 ? "bg-operational/10 text-operational" : d.pct >= 80 ? "bg-gap/10 text-gap" : "bg-destructive/10 text-destructive"}`}>
                      {d.pct === 100 ? "Complete" : d.pct >= 80 ? "On Track" : "At Risk"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataCompleteness;

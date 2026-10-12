import { useState } from "react";
import { Zap, TrendingDown, ArrowRight, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

interface Opportunity {
  id: string;
  opportunity: string;
  category: string;
  system: string;
  action: string;
  annualSaving: number;
  complexity: "Low" | "Medium" | "High";
  payback: string;
  status: "Identified" | "Under Review" | "Approved" | "Implemented";
  baselineKwh: number;
  projectedKwh: number;
}

const OPPORTUNITIES: Opportunity[] = [
  { id: "o1", opportunity: "Shift Compression Train B startup to off-peak tariff window (02:00–05:00)", category: "Load shifting", system: "Compression Train B", action: "Schedule change", annualSaving: 42, complexity: "Low", payback: "Immediate", status: "Approved", baselineKwh: 84200, projectedKwh: 74600 },
  { id: "o2", opportunity: "AGC fan speed optimisation via VFD control", category: "Equipment efficiency", system: "Compression Train B", action: "VFD installation", annualSaving: 118, complexity: "Medium", payback: "8 months", status: "Under Review", baselineKwh: 28400, projectedKwh: 19800 },
  { id: "o3", opportunity: "Compressed air pressure setpoint reduction 8.5 bar → 7.8 bar", category: "Scheduling", system: "Instrument Air", action: "Setpoint change", annualSaving: 28, complexity: "Low", payback: "Immediate", status: "Implemented", baselineKwh: 18200, projectedKwh: 15400 },
  { id: "o4", opportunity: "Waste heat recovery from COMP-A discharge to preheat feed stream", category: "Equipment efficiency", system: "Compression Train A", action: "WHRU installation", annualSaving: 234, complexity: "High", payback: "14 months", status: "Identified", baselineKwh: 96000, projectedKwh: 62400 },
  { id: "o5", opportunity: "Cooling water pump sequencing — run 2 of 3 during low-demand periods", category: "Load shifting", system: "Cooling Water", action: "PLC logic change", annualSaving: 18, complexity: "Low", payback: "Immediate", status: "Approved", baselineKwh: 42800, projectedKwh: 38200 },
  { id: "o6", opportunity: "Compressed air leak detection and repair program", category: "Leak/loss reduction", system: "Instrument Air", action: "Leak survey + repair", annualSaving: 22, complexity: "Low", payback: "2 months", status: "Under Review", baselineKwh: 18200, projectedKwh: 14800 },
];

const COMPLEXITY_COLORS: Record<string, string> = {
  Low: "bg-operational/10 text-operational",
  Medium: "bg-gap/10 text-gap",
  High: "bg-destructive/10 text-destructive",
};

const STATUS_COLORS: Record<string, string> = {
  Identified: "bg-muted text-muted-foreground",
  "Under Review": "bg-gap/10 text-gap",
  Approved: "bg-primary/10 text-primary",
  Implemented: "bg-operational/10 text-operational",
};

const LoadOptimisation = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const totalSaving = OPPORTUNITIES.reduce((s, o) => s + o.annualSaving, 0);
  const selectedSaving = OPPORTUNITIES.filter(o => selected.has(o.id)).reduce((s, o) => s + o.annualSaving, 0);

  const projectionData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2026, 3 + i).toLocaleDateString("en-IN", { month: "short" }),
    baseline: Math.round(4200 + Math.random() * 200),
    projected: Math.round(4200 - (selectedSaving / 12) * 10 + Math.random() * 200),
  }));

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold">Load Optimisation</h2>
      <p className="text-xs text-muted-foreground -mt-3">Energy cost reduction opportunities ranked by annual value</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Identified Savings", value: `₹${(totalSaving / 100).toFixed(2)} Cr/yr` },
          { label: "Selected Scenario Savings", value: `₹${selectedSaving}L/yr`, color: selectedSaving > 0 ? "text-primary" : "text-muted-foreground" },
          { label: "Opportunities Identified", value: OPPORTUNITIES.length.toString() },
          { label: "Implemented", value: OPPORTUNITIES.filter(o => o.status === "Implemented").length.toString(), color: "text-operational" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
        {/* Opportunities Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Optimisation Opportunities — Select to model combined impact</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full type-body-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary w-8"></th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary min-w-[200px]">Opportunity</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Category</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">System</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Annual Saving</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Complexity</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Payback</th>
                  <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
                </tr>
              </thead>
              <tbody>
                {OPPORTUNITIES.map(o => (
                  <tr key={o.id} className={`border-b border-hairline hover:bg-raised cursor-pointer ${selected.has(o.id) ? "bg-raised" : ""}`} onClick={() => toggle(o.id)}>
                    <td className="py-2 px-3 text-center">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.has(o.id) ? "bg-primary border-primary" : "border-border"}`}>
                        {selected.has(o.id) && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                    </td>
                    <td className="py-2 px-3">{o.opportunity}</td>
                    <td className="py-2 px-3 type-body-sm">{o.category}</td>
                    <td className="py-2 px-3 type-body-sm">{o.system}</td>
                    <td className="py-2 px-3 text-right tabular text-operational font-bold whitespace-nowrap">₹{o.annualSaving}L</td>
                    <td className="py-2 px-3"><span className={`type-body-sm px-3 py-0.5 rounded-full ${COMPLEXITY_COLORS[o.complexity]}`}>{o.complexity}</span></td>
                    <td className="py-2 px-3 type-body-sm">{o.payback}</td>
                    <td className="py-2 px-3"><span className={`type-body-sm px-3 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scenario Impact */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Scenario Impact</h3>
          </div>
          <div className="p-4 space-y-3">
            {selected.size === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">Select opportunities to model combined savings</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-2.5">
                    <p className="text-[9px] text-muted-foreground">Current (₹/day)</p>
                    <p className="text-sm font-bold font-mono">₹{Math.round(totalSaving / 365 * 100 + 8400).toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
                    <p className="text-[9px] text-muted-foreground">After Changes (₹/day)</p>
                    <p className="text-sm font-bold font-mono text-primary">₹{Math.round((totalSaving - selectedSaving) / 365 * 100 + 8400).toLocaleString()}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-operational/30 bg-operational/5 p-3 text-center">
                  <p className="text-[9px] text-muted-foreground">12-Month Net Savings</p>
                  <p className="text-xl font-bold font-mono text-operational">₹{selectedSaving}L</p>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 9 }} />
                    <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="baseline" stroke="hsl(215, 15%, 55%)" fill="hsl(215, 15%, 55%)" fillOpacity={0.1} name="Baseline (₹/day)" />
                    <Area type="monotone" dataKey="projected" stroke="hsl(170, 80%, 45%)" fill="hsl(170, 80%, 45%)" fillOpacity={0.2} name="Projected (₹/day)" />
                  </AreaChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadOptimisation;

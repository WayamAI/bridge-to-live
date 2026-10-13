import { seriesColor } from "@/components/dashboard/chartTheme";
import type { EnergyMetric } from "@/hooks/usePlantData";
import SensorSparkline from "@/components/twin/SensorSparkline";
import { Zap, TrendingDown } from "lucide-react";

interface EnergyPageProps {
  energyMetrics: EnergyMetric[];
}

const optimisationOpps = [
  { opportunity: "Shift Compression Train B startup to off-peak tariff window (02:00–05:00)", category: "Load shifting", system: "Compression B", saving: "₹42L/yr", complexity: "Low", payback: "Immediate" },
  { opportunity: "AGC fan speed optimisation via VFD control", category: "Equipment efficiency", system: "Air Coolers", saving: "₹1.18 Cr/yr", complexity: "Medium", payback: "8 months" },
  { opportunity: "Compressed air pressure setpoint reduction 8.5 bar → 7.8 bar", category: "Leak/loss reduction", system: "Instrument Air", saving: "₹28L/yr", complexity: "Low", payback: "Immediate" },
  { opportunity: "Waste heat recovery from COMP-A discharge to preheat feed stream", category: "Equipment efficiency", system: "Compression A / Feed", saving: "₹2.34 Cr/yr", complexity: "High", payback: "14 months" },
  { opportunity: "Cooling water pump speed optimisation based on ambient temperature", category: "Scheduling", system: "Cooling Water", saving: "₹18L/yr", complexity: "Low", payback: "2 months" },
];

const EnergyPage = ({ energyMetrics }: EnergyPageProps) => {
  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {energyMetrics.map((m) => {
          const deviation = ((m.value - m.setpoint) / m.setpoint * 100).toFixed(1);
          const isOver = m.value > m.setpoint;
          return (
            <div key={m.label} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-[9px] text-muted-foreground font-medium">{m.label}</span>
              </div>
              <p className="text-lg font-bold font-mono text-foreground">
                {m.value.toLocaleString()} <span className="text-xs text-muted-foreground">{m.unit}</span>
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] text-muted-foreground">Setpoint: {m.setpoint.toLocaleString()}</span>
                <span className={`text-[9px] font-mono ${isOver ? "text-destructive" : "text-operational"}`}>
                  {isOver ? "+" : ""}{deviation}%
                </span>
              </div>
              <div className="mt-2 h-6">
                <svg viewBox="0 0 200 24" className="w-full h-full" preserveAspectRatio="none">
                  <polyline
                    points={m.trend.map((v, i) => `${(i / (m.trend.length - 1)) * 200},${24 - ((v - m.setpoint * 0.9) / (m.setpoint * 0.2)) * 24}`).join(" ")}
                    fill="none"
                    stroke={seriesColor(0)}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Anomaly Panel */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Energy Anomalies — AI Detected</h3>
        <div className="space-y-2">
          {[
            { msg: "COMP-B motor drawing 12% excess current vs. similar load profile — possible bearing degradation", cost: "₹1.8L/day", tag: "COMP-B-001" },
            { msg: "Cooling water pump PUMP-CW-003 efficiency down 8% — fouling suspected", cost: "₹0.9L/day", tag: "PUMP-CW-003" },
            { msg: "Compressed air leak detected — 340 Nm³/hr above baseline", cost: "₹2.1L/day", tag: "COMP-IA-001" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-gap/20 bg-gap/5 p-3">
              <TrendingDown className="w-4 h-4 text-gap mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] text-foreground">{a.msg}</p>
                <p className="text-[10px] font-mono text-gap mt-0.5">{a.cost} estimated impact</p>
              </div>
              <span className="text-[10px] font-mono text-primary">{a.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimisation Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Optimisation Opportunities — Ranked by Annual Value</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">#</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Opportunity</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Category</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">System</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Annual Saving</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Complexity</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Payback</th>
              </tr>
            </thead>
            <tbody>
              {optimisationOpps.map((opp, i) => (
                <tr key={i} className="border-b border-hairline last:border-0 hover:bg-raised">
                  <td className="px-3 py-2 tabular text-tertiary whitespace-nowrap">{i + 1}</td>
                  <td className="px-3 py-2 max-w-[350px]">{opp.opportunity}</td>
                  <td className="px-3 py-2 text-tertiary">{opp.category}</td>
                  <td className="px-3 py-2 text-tertiary">{opp.system}</td>
                  <td className="px-3 py-2 text-right tabular font-medium text-operational whitespace-nowrap">{opp.saving}</td>
                  <td className="px-3 py-2">
                    <span className={`type-body-sm px-2 py-0.5 rounded-full border ${
                      opp.complexity === "Low" ? "border-operational/30 text-operational bg-operational/10" :
                      opp.complexity === "Medium" ? "border-gap/30 text-gap bg-gap/10" :
                      "border-destructive/30 text-destructive bg-destructive/10"
                    }`}>
                      {opp.complexity}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-tertiary">{opp.payback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnergyPage;

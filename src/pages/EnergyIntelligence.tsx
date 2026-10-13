import { seriesColor } from "@/components/dashboard/chartTheme";
import type { EnergyMetric } from "@/hooks/usePlantData";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, StatusDot, ToneStatus } from "@/components/ui/primitives";
import { complexityTone } from "@/lib/status";

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
    <PageHeader
      title="Energy Consumption"
      subtitle="Utility consumption against setpoints, AI-detected anomalies and optimisation opportunities"
    >
      {/* Metric tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-6">
        {energyMetrics.map((m) => {
          const deviation = ((m.value - m.setpoint) / m.setpoint * 100).toFixed(1);
          const isOver = m.value > m.setpoint;
          return (
            <KpiTile
              key={m.label}
              label={m.label}
              value={m.value.toLocaleString()}
              unit={m.unit}
              delta={`${isOver ? "+" : ""}${deviation}%`}
              tone={isOver ? "error" : "neutral"}
              hint={`Setpoint: ${m.setpoint.toLocaleString()}`}
            >
              <div className="mt-1 h-6">
                <svg viewBox="0 0 200 24" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
                  <polyline
                    points={m.trend.map((v, i) => `${(i / (m.trend.length - 1)) * 200},${24 - ((v - m.setpoint * 0.9) / (m.setpoint * 0.2)) * 24}`).join(" ")}
                    fill="none"
                    stroke={seriesColor(0)}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </KpiTile>
          );
        })}
      </div>

      {/* Anomalies */}
      <Panel title="Energy Anomalies · AI Detected">
        <div className="space-y-2">
          {[
            { msg: "COMP-B motor drawing 12% excess current vs. similar load profile — possible bearing degradation", cost: "₹1.8L/day", tag: "COMP-B-001" },
            { msg: "Cooling water pump PUMP-CW-003 efficiency down 8% — fouling suspected", cost: "₹0.9L/day", tag: "PUMP-CW-003" },
            { msg: "Compressed air leak detected — 340 Nm³/hr above baseline", cost: "₹2.1L/day", tag: "COMP-IA-001" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-hairline bg-raised p-3">
              <StatusDot tone="warning" className="mt-1.5" />
              <div className="flex-1">
                <p className="type-body-sm text-foreground">{a.msg}</p>
                <p className="type-caption tabular mt-0.5 text-warning">{a.cost} estimated impact</p>
              </div>
              <span className="type-label-sm tabular text-foreground">{a.tag}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Optimisation table */}
      <Panel title="Optimisation Opportunities · Ranked by Annual Value" padded={false}>
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
                  <td className="px-3 py-2 text-right tabular font-medium text-foreground whitespace-nowrap">{opp.saving}</td>
                  <td className="px-3 py-2">
                    <ToneStatus tone={complexityTone[opp.complexity]}>{opp.complexity}</ToneStatus>
                  </td>
                  <td className="px-3 py-2 text-tertiary">{opp.payback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default EnergyPage;

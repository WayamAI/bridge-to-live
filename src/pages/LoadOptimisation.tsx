import { useState } from "react";
import { icons } from "@/lib/icons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState, KpiTile, Panel, ToneStatus, Unit } from "@/components/ui/primitives";
import { complexityTone, opportunityStatus, workflowTone, toneOf } from "@/lib/status";
import { formatNumber, formatMonthName } from "@/lib/format";
import { activatable, activatableFocus } from "@/lib/a11y";
import { createRng } from "@/lib/seeded";

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

// Fixed month-to-month noise for the projection chart, so toggling an opportunity does not redraw the whole line.
const projectionRnd = createRng(1201);
const PROJECTION_NOISE = Array.from({ length: 12 }, () => ({ baseline: projectionRnd() * 200, projected: projectionRnd() * 200 }));

const LoadOptimisation = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const totalSaving = OPPORTUNITIES.reduce((s, o) => s + o.annualSaving, 0);
  const selectedSaving = OPPORTUNITIES.filter(o => selected.has(o.id)).reduce((s, o) => s + o.annualSaving, 0);

  const projectionData = Array.from({ length: 12 }, (_, i) => ({
    month: formatMonthName(new Date(2026, 3 + i)),
    baseline: Math.round(4200 + PROJECTION_NOISE[i].baseline),
    projected: Math.round(4200 - (selectedSaving / 12) * 10 + PROJECTION_NOISE[i].projected),
  }));

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  return (
    <PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Identified Savings", value: `₹${(totalSaving / 100).toFixed(2)} Cr/yr` },
          { label: "Selected Scenario Savings", value: `₹${selectedSaving}L/yr` },
          { label: "Opportunities Identified", value: OPPORTUNITIES.length.toString() },
          { label: "Implemented", value: OPPORTUNITIES.filter(o => o.status === "Implemented").length.toString() },
        ].map(s => (
          <KpiTile key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
        {/* Opportunities Table */}
        <Panel
          title="Optimisation Opportunities"
          padded={false}
          action={<span className="type-caption text-quaternary">Select to model combined impact</span>}
        >
          <div className="overflow-x-auto">
            <table className="w-full type-body-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary w-8"></th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary min-w-[160px]">Opportunity</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Category</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">System</th>
                  <th className="type-eyebrow px-2 py-2 text-right text-quaternary">Annual Saving</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Complexity</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Payback</th>
                  <th className="type-eyebrow whitespace-nowrap px-2 py-2 text-left text-quaternary">Status</th>
                </tr>
              </thead>
              <tbody>
                {OPPORTUNITIES.map(o => (
                  <tr key={o.id} className={`border-b border-hairline hover:bg-raised cursor-pointer ${activatableFocus} ${selected.has(o.id) ? "bg-raised" : ""}`} {...activatable(() => toggle(o.id))}>
                    <td className="py-2 px-2 text-center">
                      <div
                        role="checkbox"
                        aria-checked={selected.has(o.id)}
                        aria-label={`Select ${o.opportunity}`}
                        className={`mx-auto flex size-4 items-center justify-center rounded-[4px] border ${selected.has(o.id) ? "border-transparent bg-action-primary text-on-color" : "border-strong bg-action"}`}
                      >
                        {selected.has(o.id) && <icons.selected className="size-2.5" strokeWidth={3} aria-hidden />}
                      </div>
                    </td>
                    <td className="py-2 px-2">{o.opportunity}</td>
                    <td className="py-2 px-2 type-body-sm">{o.category}</td>
                    <td className="py-2 px-2 type-body-sm">{o.system}</td>
                    <td className="py-2 px-2 text-right tabular text-success font-semibold whitespace-nowrap">₹{o.annualSaving}L</td>
                    <td className="py-2 px-2"><ToneStatus tone={toneOf(complexityTone, o.complexity)}>{o.complexity}</ToneStatus></td>
                    <td className="py-2 px-2 type-body-sm">{o.payback}</td>
                    <td className="py-2 px-2"><ToneStatus tone={workflowTone(opportunityStatus, o.status).tone}>{o.status}</ToneStatus></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Scenario Impact */}
        <Panel title="Scenario Impact" padded={false}>
          <div className="p-4 space-y-3">
            {selected.size === 0 ? (
              <EmptyState title="Select opportunities to model combined savings" />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-hairline bg-raised p-3">
                    <p className="type-eyebrow text-quaternary">Current (₹/day)</p>
                    <p className="type-display-lg tabular mt-1 text-foreground"><Unit className="ml-0 mr-0.5">₹</Unit>{formatNumber(Math.round(totalSaving / 365 * 100 + 8400))}</p>
                  </div>
                  <div className="rounded-lg border border-strong bg-raised p-3">
                    <p className="type-eyebrow text-quaternary">After Changes (₹/day)</p>
                    <p className="type-display-lg tabular mt-1 text-foreground"><Unit className="ml-0 mr-0.5">₹</Unit>{formatNumber(Math.round((totalSaving - selectedSaving) / 365 * 100 + 8400))}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-hairline bg-raised p-3 text-center">
                  <p className="type-eyebrow text-quaternary">12-Month Net Savings</p>
                  <p className="type-display-xl tabular mt-1 text-foreground"><Unit className="ml-0 mr-0.5">₹</Unit>{selectedSaving}<Unit>L</Unit></p>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={projectionData}>
                    <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
                    <YAxis tick={axisTick} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
                    <Area isAnimationActive={false} type="monotone" dataKey="baseline" stroke={seriesColor(4)} fill={seriesColor(4)} fillOpacity={0.1} name="Baseline (₹/day)" />
                    <Area isAnimationActive={false} type="monotone" dataKey="projected" stroke={seriesColor(0)} fill={seriesColor(0)} fillOpacity={0.2} name="Projected (₹/day)" />
                  </AreaChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </Panel>
      </div>
    </PageHeader>
  );
};

export default LoadOptimisation;

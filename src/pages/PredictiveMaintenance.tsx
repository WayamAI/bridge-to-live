import { Fragment, useState } from "react";
import { icons, kpi } from "@/lib/icons";
import { toast } from "sonner";
import type { Equipment } from "@/hooks/usePlantData";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { recommendationStatus, workflowTone } from "@/lib/status";
import { activatable, activatableFocus } from "@/lib/a11y";

interface Props {
  equipment: Equipment[];
}

interface Recommendation {
  id: string;
  rank: number;
  tag: string;
  action: string;
  failureMode: string;
  probability: number;
  consequenceCost: number;
  actionCost: number;
  deadline: string;
  team: string;
  status: "Pending" | "Scheduled" | "In-Progress" | "Completed" | "Deferred";
  confidence: number;
  labourHours: number;
  spareParts: string[];
}

const RECOMMENDATIONS: Recommendation[] = [
  { id: "r1", rank: 1, tag: "COMP-A-001", action: "Inspect Drive End bearing — vibration trending up, probability of failure >40% within 30 days", failureMode: "Bearing failure", probability: 78, consequenceCost: 218, actionCost: 8.4, deadline: "2026-04-08", team: "Rotating Equipment", status: "Pending", confidence: 87, labourHours: 16, spareParts: ["SKF 6328 bearing", "Seal kit COMP-A", "Lube oil filter"] },
  { id: "r2", rank: 2, tag: "HEX-C-003", action: "Chemical cleaning of tube bundle — fouling factor exceeds 0.0005 m²K/W", failureMode: "Fouling/blockage", probability: 92, consequenceCost: 142, actionCost: 12.8, deadline: "2026-04-05", team: "Static Equipment", status: "Scheduled", confidence: 94, labourHours: 24, spareParts: ["Chemical cleaning agent", "Gasket set HEX-C"] },
  { id: "r3", rank: 3, tag: "FCV-D-022", action: "Replace positioner actuator assembly — intermittent fault, stuck at 68%", failureMode: "Positioner fault", probability: 88, consequenceCost: 96, actionCost: 14.2, deadline: "2026-04-02", team: "Instrumentation", status: "In-Progress", confidence: 91, labourHours: 8, spareParts: ["Fisher DVC6200 positioner", "Actuator spring kit"] },
  { id: "r4", rank: 4, tag: "MOT-E-018", action: "Thermographic survey + vibration analysis — current imbalance 8.4%", failureMode: "Winding insulation", probability: 42, consequenceCost: 84, actionCost: 2.1, deadline: "2026-04-15", team: "Electrical", status: "Pending", confidence: 72, labourHours: 4, spareParts: [] },
  { id: "r5", rank: 5, tag: "AGC-B-004", action: "Replace fan motor bearings — vibration 4.2 mm/s approaching alarm threshold", failureMode: "Bearing failure", probability: 56, consequenceCost: 38, actionCost: 4.8, deadline: "2026-04-20", team: "Rotating Equipment", status: "Pending", confidence: 78, labourHours: 12, spareParts: ["Fan motor bearing set", "Coupling alignment kit"] },
  { id: "r6", rank: 6, tag: "PUMP-CW-003", action: "Impeller inspection + clearance check — efficiency down 8% from baseline", failureMode: "Impeller wear", probability: 34, consequenceCost: 28, actionCost: 6.2, deadline: "2026-04-25", team: "Rotating Equipment", status: "Deferred", confidence: 65, labourHours: 8, spareParts: ["Impeller CW-003", "Wear ring set"] },
  { id: "r7", rank: 7, tag: "COMP-A-001", action: "Replace lube oil filter — differential pressure at threshold", failureMode: "Lube oil contamination", probability: 62, consequenceCost: 48, actionCost: 1.2, deadline: "2026-04-10", team: "Rotating Equipment", status: "Completed", confidence: 96, labourHours: 2, spareParts: ["Lube oil filter element"] },
  { id: "r8", rank: 8, tag: "SUB-E-001", action: "Install capacitor bank — power factor 0.74 below 0.85 limit", failureMode: "Power quality", probability: 18, consequenceCost: 62, actionCost: 22.0, deadline: "2026-05-15", team: "Electrical", status: "Pending", confidence: 88, labourHours: 40, spareParts: ["Capacitor bank 200kVAR", "Switchgear panel"] },
];

const PredictiveMaintenance = ({ equipment }: Props) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [woPanel, setWoPanel] = useState<Recommendation | null>(null);

  const totalActions = RECOMMENDATIONS.filter(r => r.status !== "Completed" && r.status !== "Deferred").length;
  const totalActionCost = RECOMMENDATIONS.filter(r => r.status !== "Completed" && r.status !== "Deferred").reduce((s, r) => s + r.actionCost, 0);
  const totalConsequence = RECOMMENDATIONS.reduce((s, r) => s + r.consequenceCost, 0);
  const completed = RECOMMENDATIONS.filter(r => r.status === "Completed").length;

  const createWorkOrder = (rec: Recommendation) => {
    const woId = `WO-2026-${4400 + Math.floor(Math.random() * 100)}`;
    toast.success(`Work order ${woId} created in Maximo`, { description: `${rec.tag} · ${rec.action.split("—")[0]}` });
    setWoPanel(null);
  };

  return (
    <PageHeader>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-6 gap-3">
        {[
          { label: "Actions This Week", icon: kpi.actions, value: totalActions.toString() },
          { label: "Est. Action Cost", icon: kpi.cost, value: `₹${totalActionCost.toFixed(1)}L` },
          { label: "Consequence Cost (No Action)", icon: kpi.cost, value: `₹${(totalConsequence / 100).toFixed(2)} Cr` },
          { label: "Projected Savings", icon: kpi.savings, value: `₹${((totalConsequence - totalActionCost * 10) / 100).toFixed(2)} Cr` },
          { label: "Completed This Month", icon: kpi.done, value: `${completed + 67}` },
          { label: "Compliance Rate", icon: kpi.compliance, value: "74%", color: "text-warning" },
        ].map(s => (
          <KpiTile key={s.label} icon={s.icon} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      {/* Recommendations Table */}
      <Panel title="Maintenance Recommendations · Priority Ranked" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary w-8">#</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Tag</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary min-w-[200px]">Recommended Action</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Failure Mode</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Prob.</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Consequence (₹L)</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Action Cost (₹L)</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Deadline</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECOMMENDATIONS.map(rec => (
                <Fragment key={rec.id}>
                  <tr
                    className={`border-b border-hairline hover:bg-raised cursor-pointer ${activatableFocus}`}
                    {...activatable(() => setExpandedRow(expandedRow === rec.id ? null : rec.id))}>
                    <td className="text-center py-2 px-3 tabular font-semibold whitespace-nowrap">{rec.rank}</td>
                    <td className="py-2 px-3 tabular font-medium text-foreground whitespace-nowrap">{rec.tag}</td>
                    <td className="py-2 px-3">{rec.action}</td>
                    <td className="py-2 px-3">{rec.failureMode}</td>
                    <td className="py-2 px-3 text-right tabular whitespace-nowrap">
                      <span className={rec.probability > 70 ? "text-error font-semibold" : rec.probability > 40 ? "text-warning" : ""}>{rec.probability}%</span>
                    </td>
                    <td className="py-2 px-3 text-right tabular whitespace-nowrap">{rec.consequenceCost}</td>
                    <td className="py-2 px-3 text-right tabular whitespace-nowrap">{rec.actionCost}</td>
                    <td className="py-2 px-3 tabular type-body-sm whitespace-nowrap">{rec.deadline}</td>
                    <td className="py-2 px-3">
                      <ToneStatus tone={workflowTone(recommendationStatus, rec.status).tone} solid={workflowTone(recommendationStatus, rec.status).solid}>{rec.status}</ToneStatus>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setWoPanel(rec); }} className="type-label-sm inline-flex h-7 items-center whitespace-nowrap rounded-full border border-hairline bg-action px-2.5 text-secondary-foreground outline-none transition-colors duration-[180ms] hover:border-strong hover:bg-raised-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-active">
                          <icons.createWorkOrder className="mr-1 size-[13px]" aria-hidden />
                          Create WO
                        </button>
                        {expandedRow === rec.id ? <icons.chevronUp className="size-3 text-icon-quaternary" aria-hidden /> : <icons.chevronDown className="size-3 text-icon-quaternary" aria-hidden />}
                      </div>
                    </td>
                  </tr>
                  {expandedRow === rec.id && (
                    <tr className="bg-raised">
                      <td colSpan={10} className="px-6 py-3">
                        <div className="grid grid-cols-4 gap-4 type-body-sm">
                          <div><p className="text-tertiary">Model Confidence</p><p className="tabular font-semibold">{rec.confidence}%</p></div>
                          <div><p className="text-tertiary">Est. Labour Hours</p><p className="tabular font-semibold">{rec.labourHours} hr</p></div>
                          <div><p className="text-tertiary">Assigned Team</p><p className="font-medium">{rec.team}</p></div>
                          <div>
                            <p className="text-tertiary">Spare Parts</p>
                            <p className="font-medium">{rec.spareParts.length > 0 ? rec.spareParts.join(", ") : "None required"}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Work Order Side Panel */}
      {woPanel && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setWoPanel(null)}>
          <div className="flex h-full w-[420px] max-w-full flex-col overflow-auto border-l border-strong bg-container" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3 border-b border-hairline px-5 py-4">
              <div>
                <p className="type-eyebrow text-quaternary">Work Order</p>
                <h3 className="type-display-lg mt-1 text-foreground">Create Work Order</h3>
              </div>
              <button
                onClick={() => setWoPanel(null)}
                aria-label="Close"
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-tertiary outline-none transition-colors duration-[180ms] hover:bg-raised-2 hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-active"
              >
                <icons.close className="size-4" aria-hidden />
              </button>
            </div>
            <div className="type-body-sm flex-1 space-y-3 px-5 py-4">
              <div><p className="type-eyebrow text-quaternary">Equipment Tag</p><p className="tabular mt-1 font-medium text-foreground">{woPanel.tag}</p></div>
              <div><p className="type-eyebrow text-quaternary">Action</p><p className="mt-1">{woPanel.action}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="type-eyebrow text-quaternary">Priority</p><p className="mt-1 font-medium text-foreground">P{woPanel.rank}</p></div>
                <div><p className="type-eyebrow text-quaternary">Est. Hours</p><p className="tabular mt-1">{woPanel.labourHours} hr</p></div>
              </div>
              <div><p className="type-eyebrow text-quaternary">Spare Parts</p>
                {woPanel.spareParts.map(p => <p key={p} className="tabular type-caption mt-1">• {p}</p>)}
                {woPanel.spareParts.length === 0 && <p className="mt-1 text-tertiary">None required</p>}
              </div>
              <div><p className="type-eyebrow text-quaternary">Assigned Team</p><p className="mt-1">{woPanel.team}</p></div>
              <div><p className="type-eyebrow text-quaternary">Deadline</p><p className="tabular mt-1">{woPanel.deadline}</p></div>
            </div>
            <div className="border-t border-hairline px-5 py-4">
              <button
                onClick={() => createWorkOrder(woPanel)}
                className="type-label-md h-11 w-full rounded-full bg-action-primary text-on-color outline-none transition-colors duration-[180ms] hover:bg-action-primary-hover focus-visible:ring-2 focus-visible:ring-active"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <icons.createWorkOrder className="size-[13px]" aria-hidden />
                  Confirm and create work order
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </PageHeader>
  );
};

export default PredictiveMaintenance;

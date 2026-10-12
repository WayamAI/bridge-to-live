import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Wrench, X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import type { Equipment } from "@/hooks/usePlantData";

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

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-gap/10 text-gap",
  Scheduled: "bg-secondary/10 text-secondary",
  "In-Progress": "bg-primary/10 text-primary",
  Completed: "bg-operational/10 text-operational",
  Deferred: "bg-muted text-muted-foreground",
};

const PredictiveMaintenance = ({ equipment }: Props) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [woPanel, setWoPanel] = useState<Recommendation | null>(null);

  const totalActions = RECOMMENDATIONS.filter(r => r.status !== "Completed" && r.status !== "Deferred").length;
  const totalActionCost = RECOMMENDATIONS.filter(r => r.status !== "Completed" && r.status !== "Deferred").reduce((s, r) => s + r.actionCost, 0);
  const totalConsequence = RECOMMENDATIONS.reduce((s, r) => s + r.consequenceCost, 0);
  const completed = RECOMMENDATIONS.filter(r => r.status === "Completed").length;

  const createWorkOrder = (rec: Recommendation) => {
    const woId = `WO-2026-${4400 + Math.floor(Math.random() * 100)}`;
    toast.success(`Work order ${woId} created in Maximo`, { description: `${rec.tag} — ${rec.action.split("—")[0]}` });
    setWoPanel(null);
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto relative">
      <h2 className="text-lg font-bold">Predictive Maintenance</h2>
      <p className="text-xs text-muted-foreground -mt-3">AI-generated maintenance recommendations ranked by risk and value</p>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Actions This Week", value: totalActions.toString() },
          { label: "Est. Action Cost", value: `₹${totalActionCost.toFixed(1)}L` },
          { label: "Consequence Cost (No Action)", value: `₹${(totalConsequence / 100).toFixed(2)} Cr` },
          { label: "Projected Savings", value: `₹${((totalConsequence - totalActionCost * 10) / 100).toFixed(2)} Cr` },
          { label: "Completed This Month", value: `${completed + 67}` },
          { label: "Compliance Rate", value: "74%", color: "text-gap" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-lg font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recommendations Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Maintenance Recommendations — Priority Ranked</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-center py-2 px-2 font-medium w-8">#</th>
                <th className="text-left py-2 px-3 font-medium">Tag</th>
                <th className="text-left py-2 px-3 font-medium min-w-[200px]">Recommended Action</th>
                <th className="text-left py-2 px-3 font-medium">Failure Mode</th>
                <th className="text-right py-2 px-2 font-medium">Prob.</th>
                <th className="text-right py-2 px-2 font-medium">Consequence (₹L)</th>
                <th className="text-right py-2 px-2 font-medium">Action Cost (₹L)</th>
                <th className="text-left py-2 px-3 font-medium">Deadline</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-center py-2 px-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECOMMENDATIONS.map(rec => (
                <>
                  <tr key={rec.id}
                    className={`border-b border-border/50 hover:bg-muted/20 cursor-pointer ${rec.probability > 70 ? "bg-destructive/5" : rec.probability > 40 ? "bg-gap/5" : ""}`}
                    onClick={() => setExpandedRow(expandedRow === rec.id ? null : rec.id)}>
                    <td className="text-center py-2 px-2 font-mono font-bold">{rec.rank}</td>
                    <td className="py-2 px-3 font-mono font-medium text-primary">{rec.tag}</td>
                    <td className="py-2 px-3">{rec.action}</td>
                    <td className="py-2 px-3">{rec.failureMode}</td>
                    <td className="py-2 px-2 text-right font-mono">
                      <span className={rec.probability > 70 ? "text-destructive font-bold" : rec.probability > 40 ? "text-gap" : ""}>{rec.probability}%</span>
                    </td>
                    <td className="py-2 px-2 text-right font-mono">{rec.consequenceCost}</td>
                    <td className="py-2 px-2 text-right font-mono">{rec.actionCost}</td>
                    <td className="py-2 px-3 font-mono text-[10px]">{rec.deadline}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[rec.status]}`}>{rec.status}</span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setWoPanel(rec); }} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded hover:bg-primary/20">
                          Create WO
                        </button>
                        {expandedRow === rec.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </div>
                    </td>
                  </tr>
                  {expandedRow === rec.id && (
                    <tr key={`${rec.id}-detail`} className="bg-muted/10">
                      <td colSpan={10} className="px-6 py-3">
                        <div className="grid grid-cols-4 gap-4 text-[10px]">
                          <div><p className="text-muted-foreground">Model Confidence</p><p className="font-mono font-bold">{rec.confidence}%</p></div>
                          <div><p className="text-muted-foreground">Est. Labour Hours</p><p className="font-mono font-bold">{rec.labourHours} hr</p></div>
                          <div><p className="text-muted-foreground">Assigned Team</p><p className="font-medium">{rec.team}</p></div>
                          <div>
                            <p className="text-muted-foreground">Spare Parts</p>
                            <p className="font-medium">{rec.spareParts.length > 0 ? rec.spareParts.join(", ") : "None required"}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Work Order Side Panel */}
      {woPanel && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex justify-end" onClick={() => setWoPanel(null)}>
          <div className="w-[420px] bg-card border-l border-border h-full p-6 space-y-4 overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Create Work Order</h3>
              <button onClick={() => setWoPanel(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div><p className="text-muted-foreground text-[10px]">Equipment Tag</p><p className="font-mono font-bold text-primary">{woPanel.tag}</p></div>
              <div><p className="text-muted-foreground text-[10px]">Action</p><p>{woPanel.action}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-[10px]">Priority</p><p className="font-bold">P{woPanel.rank}</p></div>
                <div><p className="text-muted-foreground text-[10px]">Est. Hours</p><p className="font-mono">{woPanel.labourHours} hr</p></div>
              </div>
              <div><p className="text-muted-foreground text-[10px]">Spare Parts</p>
                {woPanel.spareParts.map(p => <p key={p} className="font-mono text-[10px]">• {p}</p>)}
                {woPanel.spareParts.length === 0 && <p className="text-muted-foreground">None required</p>}
              </div>
              <div><p className="text-muted-foreground text-[10px]">Assigned Team</p><p>{woPanel.team}</p></div>
              <div><p className="text-muted-foreground text-[10px]">Deadline</p><p className="font-mono">{woPanel.deadline}</p></div>
            </div>
            <button onClick={() => createWorkOrder(woPanel)}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
              Confirm — Create Work Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveMaintenance;

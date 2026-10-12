import { useState } from "react";
import { CheckCircle, Clock, AlertTriangle, Wrench, ArrowUpDown } from "lucide-react";

interface WorkOrder {
  id: string;
  tag: string;
  description: string;
  type: "Planned PM" | "Predictive" | "Corrective" | "Emergency";
  priority: 1 | 2 | 3 | 4;
  status: "Open" | "In-Progress" | "Awaiting Parts" | "Completed" | "Cancelled";
  created: string;
  due: string;
  assignee: string;
  cost: number;
  hours: number;
}

const WORK_ORDERS: WorkOrder[] = [
  { id: "WO-2026-4401", tag: "COMP-A-001", description: "Replace DE bearing — predicted failure within 36 days", type: "Predictive", priority: 1, status: "In-Progress", created: "2026-03-24", due: "2026-04-08", assignee: "Rotating Equip.", cost: 8.4, hours: 16 },
  { id: "WO-2026-4398", tag: "HEX-C-003", description: "Chemical cleaning — fouling factor exceeded threshold", type: "Predictive", priority: 1, status: "Awaiting Parts", created: "2026-03-22", due: "2026-04-05", assignee: "Static Equip.", cost: 12.8, hours: 24 },
  { id: "WO-2026-4405", tag: "FCV-D-022", description: "Replace positioner actuator assembly", type: "Corrective", priority: 1, status: "In-Progress", created: "2026-03-28", due: "2026-04-02", assignee: "Instrumentation", cost: 14.2, hours: 8 },
  { id: "WO-2026-4390", tag: "TURB-G-001", description: "Quarterly PM — vibration survey + oil analysis", type: "Planned PM", priority: 2, status: "Open", created: "2026-03-15", due: "2026-04-10", assignee: "Rotating Equip.", cost: 4.2, hours: 12 },
  { id: "WO-2026-4392", tag: "MOT-E-018", description: "Thermographic survey — current imbalance investigation", type: "Predictive", priority: 2, status: "Open", created: "2026-03-18", due: "2026-04-15", assignee: "Electrical", cost: 2.1, hours: 4 },
  { id: "WO-2026-4385", tag: "PUMP-CW-003", description: "Impeller inspection + clearance check", type: "Planned PM", priority: 3, status: "Completed", created: "2026-03-10", due: "2026-03-25", assignee: "Rotating Equip.", cost: 6.2, hours: 8 },
  { id: "WO-2026-4380", tag: "COMP-A-001", description: "Replace lube oil filter — DP at threshold", type: "Predictive", priority: 3, status: "Completed", created: "2026-03-08", due: "2026-03-15", assignee: "Rotating Equip.", cost: 1.2, hours: 2 },
  { id: "WO-2026-4410", tag: "AGC-B-004", description: "Fan motor bearing replacement", type: "Predictive", priority: 2, status: "Open", created: "2026-03-29", due: "2026-04-20", assignee: "Rotating Equip.", cost: 4.8, hours: 12 },
  { id: "WO-2026-4378", tag: "SUB-E-001", description: "Install capacitor bank — power factor correction", type: "Corrective", priority: 3, status: "Open", created: "2026-03-05", due: "2026-05-15", assignee: "Electrical", cost: 22.0, hours: 40 },
  { id: "WO-2026-4375", tag: "PUMP-B-012", description: "Annual PM — bearing replacement + alignment", type: "Planned PM", priority: 3, status: "Completed", created: "2026-02-28", due: "2026-03-15", assignee: "Rotating Equip.", cost: 3.8, hours: 6 },
  { id: "WO-2026-4412", tag: "COMP-B-001", description: "Stage 1 quarterly vibration baseline", type: "Planned PM", priority: 3, status: "Open", created: "2026-03-30", due: "2026-04-30", assignee: "Rotating Equip.", cost: 1.5, hours: 4 },
  { id: "WO-2026-4370", tag: "GEN-E-001", description: "Load bank test + fuel system inspection", type: "Planned PM", priority: 2, status: "Completed", created: "2026-02-20", due: "2026-03-10", assignee: "Electrical", cost: 5.4, hours: 8 },
];

const TYPE_COLORS: Record<string, string> = {
  "Planned PM": "bg-secondary/10 text-secondary",
  Predictive: "bg-primary/10 text-primary",
  Corrective: "bg-gap/10 text-gap",
  Emergency: "bg-destructive/10 text-destructive",
};

const STATUS_COLORS: Record<string, string> = {
  Open: "bg-gap/10 text-gap",
  "In-Progress": "bg-primary/10 text-primary",
  "Awaiting Parts": "bg-destructive/10 text-destructive",
  Completed: "bg-operational/10 text-operational",
  Cancelled: "bg-muted text-muted-foreground",
};

const WorkOrders = () => {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? WORK_ORDERS : WORK_ORDERS.filter(w => w.status === filter);
  const open = WORK_ORDERS.filter(w => w.status === "Open").length;
  const inProgress = WORK_ORDERS.filter(w => w.status === "In-Progress").length;
  const completed = WORK_ORDERS.filter(w => w.status === "Completed").length;
  const overdue = WORK_ORDERS.filter(w => w.status !== "Completed" && new Date(w.due) < new Date()).length;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold">Work Order Integration</h2>
      <p className="text-xs text-muted-foreground -mt-3">Integrated view of all maintenance work orders — Maximo CMMS</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Open", value: open, icon: Clock, color: "text-gap" },
          { label: "In Progress", value: inProgress, icon: Wrench, color: "text-primary" },
          { label: "Completed (Month)", value: completed, icon: CheckCircle, color: "text-operational" },
          { label: "Overdue", value: overdue, icon: AlertTriangle, color: "text-destructive" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
              <Icon className={`w-5 h-5 ${s.color}`} />
              <div>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
                <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "Open", "In-Progress", "Awaiting Parts", "Completed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-[10px] px-3 py-1.5 rounded-lg border transition-colors ${filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">WO ID</th>
                <th className="text-left py-2 px-3 font-medium">Tag</th>
                <th className="text-left py-2 px-3 font-medium min-w-[200px]">Description</th>
                <th className="text-left py-2 px-3 font-medium">Type</th>
                <th className="text-center py-2 px-2 font-medium">P</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-left py-2 px-3 font-medium">Due</th>
                <th className="text-left py-2 px-3 font-medium">Assignee</th>
                <th className="text-right py-2 px-3 font-medium">Cost (₹L)</th>
                <th className="text-right py-2 px-3 font-medium">Hours</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(wo => (
                <tr key={wo.id} className={`border-b border-border/50 hover:bg-muted/20 ${wo.status !== "Completed" && new Date(wo.due) < new Date() ? "bg-destructive/5" : ""}`}>
                  <td className="py-2 px-3 font-mono font-medium">{wo.id}</td>
                  <td className="py-2 px-3 font-mono text-primary">{wo.tag}</td>
                  <td className="py-2 px-3">{wo.description}</td>
                  <td className="py-2 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${TYPE_COLORS[wo.type]}`}>{wo.type}</span></td>
                  <td className="py-2 px-2 text-center font-mono font-bold">{wo.priority}</td>
                  <td className="py-2 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[wo.status]}`}>{wo.status}</span></td>
                  <td className="py-2 px-3 font-mono text-[10px]">{wo.due}</td>
                  <td className="py-2 px-3">{wo.assignee}</td>
                  <td className="py-2 px-3 text-right font-mono">{wo.cost}</td>
                  <td className="py-2 px-3 text-right font-mono">{wo.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkOrders;

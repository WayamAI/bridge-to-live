import { useState } from "react";
import { Chip, EmptyState, KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { workOrderStatus, workOrderType, workflowTone } from "@/lib/status";
import PageHeader from "@/components/layout/PageHeader";
import { shiftIso } from "@/lib/mockDates";

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
  { id: "WO-2026-4401", tag: "COMP-A-001", description: "Replace DE bearing — predicted failure within 36 days", type: "Predictive", priority: 1, status: "In-Progress", created: shiftIso("2026-03-24"), due: shiftIso("2026-04-08"), assignee: "Rotating Equip.", cost: 8.4, hours: 16 },
  { id: "WO-2026-4398", tag: "HEX-C-003", description: "Chemical cleaning — fouling factor exceeded threshold", type: "Predictive", priority: 1, status: "Awaiting Parts", created: shiftIso("2026-03-22"), due: shiftIso("2026-04-05"), assignee: "Static Equip.", cost: 12.8, hours: 24 },
  { id: "WO-2026-4405", tag: "FCV-D-022", description: "Replace positioner actuator assembly", type: "Corrective", priority: 1, status: "In-Progress", created: shiftIso("2026-03-28"), due: shiftIso("2026-04-02"), assignee: "Instrumentation", cost: 14.2, hours: 8 },
  { id: "WO-2026-4390", tag: "TURB-G-001", description: "Quarterly PM — vibration survey + oil analysis", type: "Planned PM", priority: 2, status: "Open", created: shiftIso("2026-03-15"), due: shiftIso("2026-04-10"), assignee: "Rotating Equip.", cost: 4.2, hours: 12 },
  { id: "WO-2026-4392", tag: "MOT-E-018", description: "Thermographic survey — current imbalance investigation", type: "Predictive", priority: 2, status: "Open", created: shiftIso("2026-03-18"), due: shiftIso("2026-04-15"), assignee: "Electrical", cost: 2.1, hours: 4 },
  { id: "WO-2026-4385", tag: "PUMP-CW-003", description: "Impeller inspection + clearance check", type: "Planned PM", priority: 3, status: "Completed", created: shiftIso("2026-03-10"), due: shiftIso("2026-03-25"), assignee: "Rotating Equip.", cost: 6.2, hours: 8 },
  { id: "WO-2026-4380", tag: "COMP-A-001", description: "Replace lube oil filter — DP at threshold", type: "Predictive", priority: 3, status: "Completed", created: shiftIso("2026-03-08"), due: shiftIso("2026-03-15"), assignee: "Rotating Equip.", cost: 1.2, hours: 2 },
  { id: "WO-2026-4410", tag: "AGC-B-004", description: "Fan motor bearing replacement", type: "Predictive", priority: 2, status: "Open", created: shiftIso("2026-03-29"), due: shiftIso("2026-04-20"), assignee: "Rotating Equip.", cost: 4.8, hours: 12 },
  { id: "WO-2026-4378", tag: "SUB-E-001", description: "Install capacitor bank — power factor correction", type: "Corrective", priority: 3, status: "Open", created: shiftIso("2026-03-05"), due: shiftIso("2026-05-15"), assignee: "Electrical", cost: 22.0, hours: 40 },
  { id: "WO-2026-4375", tag: "PUMP-B-012", description: "Annual PM — bearing replacement + alignment", type: "Planned PM", priority: 3, status: "Completed", created: shiftIso("2026-02-28"), due: shiftIso("2026-03-15"), assignee: "Rotating Equip.", cost: 3.8, hours: 6 },
  { id: "WO-2026-4412", tag: "COMP-B-001", description: "Stage 1 quarterly vibration baseline", type: "Planned PM", priority: 3, status: "Open", created: shiftIso("2026-03-30"), due: shiftIso("2026-04-30"), assignee: "Rotating Equip.", cost: 1.5, hours: 4 },
  { id: "WO-2026-4370", tag: "GEN-E-001", description: "Load bank test + fuel system inspection", type: "Planned PM", priority: 2, status: "Completed", created: shiftIso("2026-02-20"), due: shiftIso("2026-03-10"), assignee: "Electrical", cost: 5.4, hours: 8 },
];

const WorkOrders = () => {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? WORK_ORDERS : WORK_ORDERS.filter(w => w.status === filter);
  const open = WORK_ORDERS.filter(w => w.status === "Open").length;
  const inProgress = WORK_ORDERS.filter(w => w.status === "In-Progress").length;
  const completed = WORK_ORDERS.filter(w => w.status === "Completed").length;
  const overdue = WORK_ORDERS.filter(w => w.status !== "Completed" && new Date(w.due) < new Date()).length;

  return (
    <PageHeader
      title="Work Order Integration"
      subtitle="Integrated view of all maintenance work orders in Maximo CMMS"
      actions={
        <div className="flex flex-wrap gap-2">
          {["all", "Open", "In-Progress", "Awaiting Parts", "Completed"].map(f => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f}
            </Chip>
          ))}
        </div>
      }
    >

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiTile label="Open" value={open} />
        <KpiTile label="In Progress" value={inProgress} />
        <KpiTile label="Completed (Month)" value={completed} />
        <KpiTile label="Overdue" value={overdue} valueClassName={overdue > 0 ? "text-error" : ""} />
      </div>

      {/* Table */}
      <Panel title="Work Orders" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">WO ID</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Tag</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary min-w-[200px]">Description</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Type</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary">P</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Due</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Assignee</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Cost (₹L)</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Hours</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(wo => (
                <tr key={wo.id} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 tabular font-medium whitespace-nowrap">{wo.id}</td>
                  <td className="py-2 px-3 tabular text-foreground whitespace-nowrap">{wo.tag}</td>
                  <td className="py-2 px-3">{wo.description}</td>
                  <td className="py-2 px-3"><ToneStatus tone={workflowTone(workOrderType, wo.type).tone} solid={workflowTone(workOrderType, wo.type).solid}>{wo.type}</ToneStatus></td>
                  <td className="py-2 px-3 text-center tabular font-semibold whitespace-nowrap">{wo.priority}</td>
                  <td className="py-2 px-3"><ToneStatus tone={workflowTone(workOrderStatus, wo.status).tone} solid={workflowTone(workOrderStatus, wo.status).solid}>{wo.status}</ToneStatus></td>
                  <td className={`py-2 px-3 tabular type-body-sm whitespace-nowrap ${wo.status !== "Completed" && new Date(wo.due) < new Date() ? "text-error" : ""}`}>{wo.due}</td>
                  <td className="py-2 px-3">{wo.assignee}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{wo.cost}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{wo.hours}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10}><EmptyState title="No work orders match this filter" className="min-h-[96px]" /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default WorkOrders;

import type { HandoverItem, ConnectedSystem } from "@/hooks/usePlantData";
import { icons } from "@/lib/icons";
import PageHeader from "@/components/layout/PageHeader";
import { Panel, ToneStatus, Unit } from "@/components/ui/primitives";
import { connectedSystemTone, handoverItemStatus, workflowTone } from "@/lib/status";
import { formatNumber } from "@/lib/format";
import { handoverReadiness } from "@/lib/plantStats";

interface HandoverPageProps {
  handoverData: HandoverItem[];
  connectedSystems: ConnectedSystem[];
  plantInfo: { name: string; operator: string; handoverTarget: string; daysRemaining: number };
}

const HandoverPage = ({ handoverData, connectedSystems, plantInfo }: HandoverPageProps) => {
  const completedPct = handoverReadiness(handoverData);

  return (
    <PageHeader>
      {/* Project summary */}
      <Panel title="Active Handover Project">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="type-body-lg font-medium text-foreground">{plantInfo.name} · Phase 2</p>
            <p className="type-body-sm mt-0.5 text-tertiary">Client: {plantInfo.operator} | Target: {plantInfo.handoverTarget} | {plantInfo.daysRemaining} days remaining</p>
          </div>
          <div className="text-right">
            <p className="type-display-2xl tabular text-foreground">{completedPct}<Unit>%</Unit></p>
            <p className="type-caption text-quaternary">Overall readiness</p>
          </div>
        </div>
      </Panel>

      {/* Readiness Scorecard */}
      <Panel title="Handover Readiness Scorecard" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Requirement</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Target</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Completed</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Remaining</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Progress</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
              </tr>
            </thead>
            <tbody>
              {handoverData.map((item, i) => {
                const pct = Math.round(item.completed / item.target * 100);
                return (
                  <tr key={i} className="border-b border-hairline last:border-0 hover:bg-raised cursor-pointer">
                    <td className="px-3 py-2 font-medium">{item.requirement}</td>
                    <td className="px-3 py-2 tabular text-tertiary whitespace-nowrap">{formatNumber(item.target)} {item.unit}</td>
                    <td className="px-3 py-2 tabular whitespace-nowrap">{formatNumber(item.completed)} {item.unit}</td>
                    <td className="px-3 py-2 tabular text-tertiary whitespace-nowrap">{formatNumber(item.target - item.completed)} {item.unit}</td>
                    <td className="px-3 py-2 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-raised-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.status === "Warning" ? "bg-warning" : item.status === "At risk" ? "bg-error" : "bg-quaternary"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="type-body-sm tabular">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <ToneStatus tone={workflowTone(handoverItemStatus, item.status).tone} solid={workflowTone(handoverItemStatus, item.status).solid}>{item.status}</ToneStatus>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Connected systems */}
      <Panel
        title="Connected Systems"
        padded={false}
        action={
          <button className="type-caption inline-flex items-center gap-1 rounded-full text-quaternary outline-none transition-colors duration-[180ms] hover:text-foreground focus-visible:ring-2 focus-visible:ring-active">
            <icons.sync className="size-[13px]" aria-hidden /> Force sync
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">System</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Type</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Last Sync</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Records / 24hr</th>
              </tr>
            </thead>
            <tbody>
              {connectedSystems.map((sys, i) => (
                <tr key={i} className="border-b border-hairline last:border-0 hover:bg-raised">
                  <td className="px-3 py-2 font-medium">{sys.name}</td>
                  <td className="px-3 py-2 text-tertiary">{sys.type}</td>
                  <td className="px-3 py-2">
                    <ToneStatus tone={connectedSystemTone(sys.status).tone} solid={connectedSystemTone(sys.status).solid}>{sys.status}</ToneStatus>
                  </td>
                  <td className="px-3 py-2 tabular text-tertiary whitespace-nowrap">{sys.lastSync}</td>
                  <td className="px-3 py-2 tabular text-tertiary whitespace-nowrap">{sys.recordsPer24h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default HandoverPage;

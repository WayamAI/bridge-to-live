import type { HandoverItem, ConnectedSystem } from "@/hooks/usePlantData";
import { ArrowRightLeft, Check, AlertTriangle, Clock, RefreshCw } from "lucide-react";

interface HandoverPageProps {
  handoverData: HandoverItem[];
  connectedSystems: ConnectedSystem[];
  plantInfo: { name: string; operator: string; handoverTarget: string; daysRemaining: number };
}

const statusColors: Record<string, string> = {
  "Complete": "text-operational bg-operational/10 border-operational/30",
  "On track": "text-engineering bg-engineering/10 border-engineering/30",
  "Warning": "text-gap bg-gap/10 border-gap/30",
  "At risk": "text-destructive bg-destructive/10 border-destructive/30",
};

const HandoverPage = ({ handoverData, connectedSystems, plantInfo }: HandoverPageProps) => {
  const completedPct = Math.round(
    handoverData.reduce((a, h) => a + h.completed, 0) / handoverData.reduce((a, h) => a + h.target, 0) * 100
  );

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Project header */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground font-mono uppercase">Active Handover Project</p>
          <h2 className="text-lg font-bold mt-0.5">{plantInfo.name} — Phase 2</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Client: {plantInfo.operator} | Target: {plantInfo.handoverTarget} | {plantInfo.daysRemaining} days remaining</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold font-mono text-gap">{completedPct}%</p>
          <p className="text-[10px] text-muted-foreground">Overall readiness</p>
        </div>
      </div>

      {/* Readiness Scorecard */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Handover Readiness Scorecard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Requirement</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Target</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Completed</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Remaining</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Progress</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {handoverData.map((item, i) => {
                const pct = Math.round(item.completed / item.target * 100);
                return (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer">
                    <td className="px-3 py-2 font-medium">{item.requirement}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{item.target.toLocaleString()} {item.unit}</td>
                    <td className="px-3 py-2 font-mono">{item.completed.toLocaleString()} {item.unit}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{(item.target - item.completed).toLocaleString()} {item.unit}</td>
                    <td className="px-3 py-2 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.status === "Complete" ? "bg-operational" :
                              item.status === "On track" ? "bg-engineering" :
                              item.status === "Warning" ? "bg-gap" : "bg-destructive"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connected Systems */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Connected Systems</h3>
          <button className="text-[10px] text-primary hover:underline flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Force sync
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">System</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Last Sync</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Records / 24hr</th>
              </tr>
            </thead>
            <tbody>
              {connectedSystems.map((sys, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-3 py-2 font-medium">{sys.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{sys.type}</td>
                  <td className="px-3 py-2">
                    <span className={`flex items-center gap-1.5 ${
                      sys.status === "Active" ? "text-operational" : sys.status === "Degraded" ? "text-gap" : "text-destructive"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        sys.status === "Active" ? "bg-operational" : sys.status === "Degraded" ? "bg-gap" : "bg-destructive"
                      }`} />
                      {sys.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{sys.lastSync}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{sys.recordsPer24h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HandoverPage;

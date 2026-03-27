import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Alert } from "@/hooks/usePlantData";
import { Bell, AlertTriangle, Shield, Wrench, BrainCircuit, CheckCircle2, Search, Filter } from "lucide-react";

const severityStyles = {
  info: "border-engineering/30 bg-engineering/5",
  warning: "border-gap/30 bg-gap/5",
  critical: "border-destructive/30 bg-destructive/5",
};

const typeIcons = {
  anomaly: AlertTriangle,
  threshold: AlertTriangle,
  predictive: BrainCircuit,
  maintenance: Wrench,
  safety: Shield,
  rate_of_change: AlertTriangle,
};

interface AlarmManagementPageProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onSelectEquipment: (id: string) => void;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const AlarmManagementPage = ({ alerts, onAcknowledge, onSelectEquipment }: AlarmManagementPageProps) => {
  const [filterSeverity, setFilterSeverity] = useState<string>("All");
  const [showAcknowledged, setShowAcknowledged] = useState(true);

  const filtered = alerts.filter(a => {
    if (filterSeverity !== "All" && a.severity !== filterSeverity) return false;
    if (!showAcknowledged && a.acknowledged) return false;
    return true;
  });

  const unacknowledged = alerts.filter(a => !a.acknowledged).length;
  const critical = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;
  const avgRate = (alerts.length / 24).toFixed(1);

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* KPI bar */}
      <div className="flex items-center gap-4">
        <div className="rounded-lg border border-border bg-card px-4 py-2">
          <p className="text-[9px] text-muted-foreground">Unacknowledged</p>
          <p className="text-lg font-bold font-mono text-destructive">{unacknowledged}</p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2">
          <p className="text-[9px] text-muted-foreground">Critical Active</p>
          <p className="text-lg font-bold font-mono text-destructive">{critical}</p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2">
          <p className="text-[9px] text-muted-foreground">Alarm Rate</p>
          <p className="text-lg font-bold font-mono text-foreground">{avgRate}/hr</p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2">
          <p className="text-[9px] text-muted-foreground">Total (24h)</p>
          <p className="text-lg font-bold font-mono text-foreground">{alerts.length}</p>
        </div>
        <div className="flex-1" />
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-border bg-card"
        >
          <option value="All">All Severity</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={showAcknowledged} onChange={(e) => setShowAcknowledged(e.target.checked)} className="rounded" />
          Show acknowledged
        </label>
      </div>

      {/* Alarm console table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground w-8">P</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Time</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Tag</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Message</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Duration</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">ACK</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => {
                const Icon = typeIcons[alert.type];
                return (
                  <tr
                    key={alert.id}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-muted/20 ${severityStyles[alert.severity]} ${
                      !alert.acknowledged ? "animate-pulse-subtle" : "opacity-60"
                    }`}
                  >
                    <td className="px-3 py-2">
                      <span className={`inline-flex w-5 h-5 items-center justify-center rounded-full text-[9px] font-bold ${
                        alert.priority === 1 ? "bg-destructive text-destructive-foreground" :
                        alert.priority === 2 ? "bg-gap text-gap-foreground" :
                        alert.priority === 3 ? "bg-engineering text-engineering-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {alert.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatTimeAgo(alert.timestamp)}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => onSelectEquipment(alert.equipmentId)}
                        className="font-mono text-primary hover:underline font-medium"
                      >
                        {alert.equipmentTag}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Icon className="w-3 h-3" />
                        <span className="capitalize">{alert.type.replace("_", " ")}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 max-w-[400px] truncate">{alert.message}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{alert.duration}</td>
                    <td className="px-3 py-2">
                      {alert.acknowledged ? (
                        <span className="text-[9px] text-operational font-mono">ACK</span>
                      ) : (
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="text-[10px] font-medium text-primary hover:underline flex items-center gap-0.5"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Acknowledge
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlarmManagementPage;

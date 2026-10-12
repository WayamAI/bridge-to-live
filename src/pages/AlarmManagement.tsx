import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Alert } from "@/hooks/usePlantData";
import { StatusDot, EmptyState } from "@/components/ui/primitives";
import { priorityTone, severityTone, toneBadgeClass } from "@/lib/status";
import { Bell, AlertTriangle, Shield, Wrench, BrainCircuit, CheckCircle2, Search, Filter } from "lucide-react";

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
      <div className="flex flex-wrap items-center gap-4">
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
          <table className="w-full type-body-sm">
            <thead className="sticky top-0 z-10 bg-container">
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary w-8">P</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Time</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Tag</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Type</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Message</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Duration</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">ACK</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => {
                const Icon = typeIcons[alert.type];
                return (
                  <tr
                    key={alert.id}
                    className={`border-b border-hairline last:border-0 transition-colors hover:bg-raised ${alert.acknowledged ? "opacity-60" : ""}`}
                  >
                    <td className="px-3 py-2">
                      <span className={`inline-flex size-5 items-center justify-center rounded-full type-caption ${toneBadgeClass[priorityTone(alert.priority)]}`}>
                        {alert.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2 tabular type-body-sm text-tertiary whitespace-nowrap">
                      {formatTimeAgo(alert.timestamp)}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => onSelectEquipment(alert.equipmentId)}
                        className="tabular text-primary hover:underline font-medium"
                      >
                        {alert.equipmentTag}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1.5 text-tertiary">
                        <StatusDot tone={severityTone[alert.severity]} className="mr-0.5" />
                        <span className="sr-only">{alert.severity}</span>
                        <Icon className="w-3 h-3" />
                        <span className="capitalize">{alert.type.replace("_", " ")}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 max-w-[400px] truncate">{alert.message}</td>
                    <td className="px-3 py-2 tabular text-tertiary whitespace-nowrap">{alert.duration}</td>
                    <td className="px-3 py-2">
                      {alert.acknowledged ? (
                        <span className="type-body-sm text-operational tabular">ACK</span>
                      ) : (
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="type-body-sm font-medium text-primary hover:underline flex items-center gap-0.5"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Acknowledge
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}><EmptyState title="No alarms match this filter" className="min-h-[96px]" /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AlarmManagementPage;

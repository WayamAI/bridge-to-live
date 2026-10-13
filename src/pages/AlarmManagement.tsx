import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Alert } from "@/hooks/usePlantData";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState, KpiTile, Panel, PillSelect, StatusDot } from "@/components/ui/primitives";
import { priorityTone, severityTone, toneBadgeClass, toneOf } from "@/lib/status";
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
    <PageHeader
      title="Active Alarms"
      subtitle="Review, filter and acknowledge plant alarms"
      actions={
        <>
          <PillSelect value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} aria-label="Filter by severity">
            <option value="All">All severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </PillSelect>
          <label className="type-label-sm flex h-8 items-center gap-1.5 text-tertiary">
            <input
              type="checkbox"
              checked={showAcknowledged}
              onChange={(e) => setShowAcknowledged(e.target.checked)}
              className="size-4 rounded-[4px] accent-action-primary outline-none focus-visible:ring-2 focus-visible:ring-active"
            />
            Show acknowledged
          </label>
        </>
      }
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiTile label="Unacknowledged" value={unacknowledged} valueClassName={unacknowledged > 0 ? "text-error" : ""} />
        <KpiTile label="Critical Active" value={critical} valueClassName={critical > 0 ? "text-error" : ""} />
        <KpiTile label="Alarm Rate" value={avgRate} unit="/hr" />
        <KpiTile label="Total (24h)" value={alerts.length} />
      </div>

      {/* Alarm console table */}
      <Panel title="Alarm Console" padded={false}>
        <div className="max-h-[600px] overflow-x-auto overflow-y-auto">
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
                      <span
                        title={`Priority ${alert.priority}`}
                        className={`inline-flex size-5 items-center justify-center rounded-full type-caption ${toneBadgeClass[priorityTone(alert.priority)]}`}
                      >
                        {alert.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2 tabular type-body-sm text-tertiary whitespace-nowrap">
                      {formatTimeAgo(alert.timestamp)}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => onSelectEquipment(alert.equipmentId)}
                        className="tabular whitespace-nowrap rounded-sm font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-active"
                      >
                        {alert.equipmentTag}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1.5 text-tertiary">
                        <StatusDot tone={toneOf(severityTone, alert.severity)} className="mr-0.5" />
                        <span className="sr-only">{alert.severity}</span>
                        <Icon className="size-3 text-quaternary" aria-hidden />
                        <span className="capitalize">{alert.type.replace("_", " ")}</span>
                      </span>
                    </td>
                    <td className="max-w-[400px] truncate px-3 py-2" title={alert.message}>{alert.message}</td>
                    <td className="px-3 py-2 tabular text-tertiary whitespace-nowrap">{alert.duration}</td>
                    <td className="px-3 py-2">
                      {alert.acknowledged ? (
                        <span className="type-body-sm tabular text-quaternary">ACK</span>
                      ) : (
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="type-label-sm inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-full border border-hairline bg-action px-2.5 text-secondary-foreground outline-none transition-colors duration-[180ms] hover:border-strong hover:bg-raised-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-active"
                        >
                          <CheckCircle2 className="size-3" aria-hidden /> Acknowledge
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
      </Panel>
    </PageHeader>
  );
};

export default AlarmManagementPage;

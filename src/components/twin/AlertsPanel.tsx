import { motion, AnimatePresence } from "framer-motion";
import type { Alert } from "@/hooks/useFactoryData";
import { Icon } from "@/components/ui/Icon";
import { icons, alarmIcon, iconSize } from "@/lib/icons";

const severityStyles = {
  info: "border-engineering/30 bg-engineering/5",
  warning: "border-gap/30 bg-gap/5",
  critical: "border-destructive/30 bg-destructive/5",
};

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onSelectEquipment: (id: string) => void;
}

const AlertsPanel = ({ alerts, onAcknowledge, onSelectEquipment }: AlertsPanelProps) => {
  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name={icons.alarms} size={iconSize.row} />
          <h3 className="text-sm font-semibold">Alerts</h3>
          {unacknowledged > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unacknowledged}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{alerts.length} total</span>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {alerts.map((alert, i) => {
            const typeIcon = alarmIcon(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`border-b border-border last:border-0 p-3 ${severityStyles[alert.severity]} ${
                  alert.acknowledged ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <Icon name={typeIcon} size={iconSize.row} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => onSelectEquipment(alert.equipmentId)}
                      className="text-xs font-semibold hover:underline outline-none focus-visible:ring-2 focus-visible:ring-active"
                    >
                      {alert.equipmentName}
                    </button>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-mono text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-muted text-muted-foreground capitalize">
                        {alert.type}
                      </span>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="text-[9px] font-medium text-operational hover:underline flex items-center gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-active"
                        >
                          <Icon name={icons.acknowledge} size={iconSize.row} /> ACK
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default AlertsPanel;

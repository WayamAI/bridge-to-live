import { motion } from "framer-motion";
import type { Equipment, EquipmentStatus } from "@/hooks/useFactoryData";
import { X, Wrench, AlertTriangle, Clock, Activity } from "lucide-react";
import SensorSparkline from "./SensorSparkline";

const statusBadge: Record<EquipmentStatus, { label: string; className: string }> = {
  running: { label: "Running", className: "bg-operational/10 text-operational border-operational/30" },
  warning: { label: "Warning", className: "bg-gap/10 text-gap border-gap/30" },
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive border-destructive/30" },
  offline: { label: "Offline", className: "bg-muted text-muted-foreground border-border" },
  maintenance: { label: "Maintenance", className: "bg-engineering/10 text-engineering border-engineering/30" },
};

interface EquipmentDetailProps {
  equipment: Equipment;
  onClose: () => void;
}

const EquipmentDetail = ({ equipment, onClose }: EquipmentDetailProps) => {
  const badge = statusBadge[equipment.status];
  const daysToMaintenance = Math.ceil(
    (equipment.nextMaintenance.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const daysToFailure = equipment.predictedFailure
    ? Math.ceil((equipment.predictedFailure.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between">
        <div>
          <h3 className="font-bold text-sm">{equipment.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{equipment.zone}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-md">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Status bar */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badge.className}`}>
          {badge.label}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Activity className="w-3 h-3" />
          <span>Health: <strong className="text-foreground">{equipment.health}%</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{equipment.runtimeHours.toLocaleString()}h runtime</span>
        </div>
      </div>

      {/* Health bar */}
      <div className="px-4 py-2 border-b border-border">
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              equipment.health > 80 ? "bg-operational" : equipment.health > 50 ? "bg-gap" : "bg-destructive"
            }`}
            style={{ width: `${equipment.health}%` }}
          />
        </div>
      </div>

      {/* Sensors */}
      <div className="p-4 space-y-3">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Live Sensors</h4>
        {equipment.sensors.map((sensor) => {
          const isOutOfRange = sensor.value < sensor.normalMin || sensor.value > sensor.normalMax;
          return (
            <div key={sensor.id} className="rounded-lg border border-border bg-surface-elevated p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium">{sensor.name}</span>
                <span className={`text-sm font-mono font-bold ${isOutOfRange ? "text-destructive" : "text-foreground"}`}>
                  {sensor.value} {sensor.unit}
                </span>
              </div>
              <SensorSparkline
                data={sensor.trend}
                min={sensor.min}
                max={sensor.max}
                normalMin={sensor.normalMin}
                normalMax={sensor.normalMax}
              />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono">
                <span>Range: {sensor.normalMin}–{sensor.normalMax} {sensor.unit}</span>
                {isOutOfRange && (
                  <span className="text-destructive flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" /> OUT OF RANGE
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenance info */}
      <div className="p-4 border-t border-border space-y-2">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Maintenance</h4>
        <div className="flex items-center gap-2 text-xs">
          <Wrench className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">Next scheduled:</span>
          <span className={`font-medium ${daysToMaintenance <= 7 ? "text-gap" : "text-foreground"}`}>
            {daysToMaintenance} days
          </span>
        </div>
        {daysToFailure !== null && (
          <div className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-3 h-3 text-destructive" />
            <span className="text-muted-foreground">Predicted failure:</span>
            <span className="font-medium text-destructive">{daysToFailure} days</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EquipmentDetail;

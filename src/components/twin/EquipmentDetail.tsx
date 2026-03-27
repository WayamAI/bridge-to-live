import { motion } from "framer-motion";
import type { Equipment, EquipmentStatus } from "@/hooks/usePlantData";
import { X, Wrench, AlertTriangle, Clock, Activity, MapPin, Factory } from "lucide-react";
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
          <p className="text-[10px] font-mono text-primary">{equipment.tag}</p>
          <h3 className="font-bold text-sm">{equipment.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5" />{equipment.processUnit}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Factory className="w-2.5 h-2.5" />{equipment.manufacturer} {equipment.model}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-md">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Status bar */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3 flex-wrap">
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
        {equipment.rulDays !== null && (
          <span className="text-[10px] font-mono text-muted-foreground">
            RUL: <strong className={equipment.rulDays < 30 ? "text-destructive" : "text-foreground"}>{equipment.rulDays}d</strong>
          </span>
        )}
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
      <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
        <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Live Sensors</h4>
        {equipment.sensors.map((s) => {
          const isOutOfRange = s.value < s.normalMin || s.value > s.normalMax;
          const deviation = s.setpoint !== 0 ? ((s.value - s.setpoint) / s.setpoint * 100).toFixed(1) : "0";
          return (
            <div key={s.id} className="rounded-lg border border-border bg-surface-elevated p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono font-bold ${isOutOfRange ? "text-destructive" : "text-foreground"}`}>
                    {s.value} {s.unit}
                  </span>
                  <span className={`text-[9px] font-mono ${parseFloat(deviation) > 0 ? "text-gap" : "text-muted-foreground"}`}>
                    {parseFloat(deviation) > 0 ? "+" : ""}{deviation}%
                  </span>
                </div>
              </div>
              <SensorSparkline
                data={s.trend}
                min={s.min}
                max={s.max}
                normalMin={s.normalMin}
                normalMax={s.normalMax}
              />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1 font-mono">
                <span>Range: {s.normalMin}–{s.normalMax} {s.unit}</span>
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

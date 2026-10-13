import { motion } from "framer-motion";
import type { Equipment } from "@/hooks/usePlantData";
import { X, Wrench, AlertTriangle, MapPin, Factory } from "lucide-react";
import { EquipmentStatusLabel } from "@/components/ui/primitives";
import SensorSparkline from "./SensorSparkline";
import { formatNumber } from "@/lib/format";

interface EquipmentDetailProps {
  equipment: Equipment;
  onClose: () => void;
}

const EquipmentDetail = ({ equipment, onClose }: EquipmentDetailProps) => {
  const daysToMaintenance = Math.ceil(
    (equipment.nextMaintenance.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const daysToFailure = equipment.predictedFailure
    ? Math.ceil((equipment.predictedFailure.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col overflow-hidden rounded-lg border border-hairline bg-container"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-hairline p-4">
        <div className="min-w-0">
          <p className="type-eyebrow tabular text-quaternary">{equipment.tag}</p>
          <h3 className="type-display-base mt-1 text-foreground">{equipment.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="type-caption flex items-center gap-1 text-quaternary">
              <MapPin className="size-3" aria-hidden />{equipment.processUnit}
            </span>
            <span className="type-caption flex items-center gap-1 text-quaternary">
              <Factory className="size-3" aria-hidden />{equipment.manufacturer} {equipment.model}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close equipment detail"
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-tertiary outline-none transition-colors duration-[180ms] hover:bg-raised-2 hover:text-secondary-foreground focus-visible:ring-2 focus-visible:ring-active"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-hairline px-4 py-3">
        <EquipmentStatusLabel status={equipment.status} />
        <span className="type-body-sm text-tertiary">
          Health: <strong className="tabular font-medium text-foreground">{equipment.health}%</strong>
        </span>
        <span className="type-body-sm tabular text-tertiary">{formatNumber(equipment.runtimeHours)}h runtime</span>
        {equipment.rulDays !== null && (
          <span className="type-body-sm tabular text-tertiary">
            RUL: <strong className={`font-medium ${equipment.rulDays < 30 ? "text-error" : "text-foreground"}`}>{equipment.rulDays}d</strong>
          </span>
        )}
      </div>

      {/* Health bar */}
      <div className="border-b border-hairline px-4 py-2.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-raised-2">
          <div
            className={`h-full rounded-full transition-all ${
              equipment.health > 80 ? "bg-quaternary" : equipment.health > 50 ? "bg-warning" : "bg-error"
            }`}
            style={{ width: `${equipment.health}%` }}
          />
        </div>
      </div>

      {/* Sensors */}
      <div className="max-h-[320px] space-y-3 overflow-y-auto p-4">
        <h4 className="type-eyebrow text-quaternary">Live Sensors</h4>
        {equipment.sensors.map((s) => {
          const isOutOfRange = s.value < s.normalMin || s.value > s.normalMax;
          const deviation = s.setpoint !== 0 ? ((s.value - s.setpoint) / s.setpoint * 100).toFixed(1) : "0";
          return (
            <div key={s.id} className="rounded-lg border border-hairline bg-raised p-3">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="type-label-sm text-foreground">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`type-label-md tabular ${isOutOfRange ? "text-error" : "text-foreground"}`}>
                    {s.value} {s.unit}
                  </span>
                  <span className={`type-caption tabular ${parseFloat(deviation) > 0 ? "text-warning" : "text-quaternary"}`}>
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
              <div className="type-caption tabular mt-1 flex justify-between gap-2 text-quaternary">
                <span>Range: {s.normalMin}–{s.normalMax} {s.unit}</span>
                {isOutOfRange && (
                  <span className="flex items-center gap-0.5 text-error">
                    <AlertTriangle className="size-3" aria-hidden /> Out of range
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Maintenance info */}
      <div className="space-y-2 border-t border-hairline p-4">
        <h4 className="type-eyebrow text-quaternary">Maintenance</h4>
        <div className="type-body-sm flex items-center gap-2">
          <Wrench className="size-3 text-quaternary" aria-hidden />
          <span className="text-tertiary">Next scheduled:</span>
          <span className={`font-medium ${daysToMaintenance <= 7 ? "text-warning" : "text-foreground"}`}>
            {daysToMaintenance} days
          </span>
        </div>
        {daysToFailure !== null && (
          <div className="type-body-sm flex items-center gap-2">
            <AlertTriangle className="size-3 text-error" aria-hidden />
            <span className="text-tertiary">Predicted failure:</span>
            <span className="font-medium text-error">{daysToFailure} days</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EquipmentDetail;

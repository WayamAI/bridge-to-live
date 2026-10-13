import { motion } from "framer-motion";
import type { Equipment, EquipmentStatus } from "@/hooks/usePlantData";
import { equipmentLabel } from "@/lib/status";

const statusColors: Record<EquipmentStatus, string> = {
  running: "bg-success border-success",
  warning: "bg-warning border-warning",
  critical: "bg-error border-error",
  offline: "bg-quaternary border-quaternary",
  maintenance: "bg-info border-info",
};

// The old animate-ping marked alarm states (warning, critical). It is now a static outer ring:
// same signal, no motion.
const statusRing: Record<EquipmentStatus, boolean> = {
  running: false, warning: true, critical: true, offline: false, maintenance: false,
};

interface FactoryFloorProps {
  equipment: Equipment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const FactoryFloor = ({ equipment, selectedId, onSelect }: FactoryFloorProps) => {
  return (
    <div className="relative w-full aspect-[16/9] rounded-lg border border-hairline bg-container overflow-hidden">
      <div className="type-eyebrow absolute left-3 top-3 text-quaternary">
        Factory Floor · Live View
      </div>

      {equipment.map((eq) => {
        const isSelected = eq.id === selectedId;
        const colorClass = statusColors[eq.status];
        const showRing = statusRing[eq.status];

        return (
          <motion.button
            key={eq.id}
            onClick={() => onSelect(eq.id)}
            className="absolute group"
            style={{
              left: `${eq.position.x}%`,
              top: `${eq.position.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.95 }}
          >
            {showRing && (
              <span className={`absolute -inset-1 rounded-full ${colorClass} opacity-30`} />
            )}
            <span
              className={`relative block w-4 h-4 rounded-full border-2 ${colorClass} ${
                isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
              }`}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="whitespace-nowrap rounded-md border border-hairline bg-container px-2.5 py-1.5 shadow-lg">
                <p className="type-label-sm tabular text-foreground">{eq.tag}</p>
                <p className="type-caption text-tertiary">{equipmentLabel[eq.status]} · {eq.health}%</p>
              </div>
            </div>
          </motion.button>
        );
      })}

      <div className="type-caption absolute bottom-3 right-3 flex items-center gap-3 text-quaternary">
        {(["running", "warning", "critical", "maintenance", "offline"] as EquipmentStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${statusColors[s]}`} />
            <span>{equipmentLabel[s]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactoryFloor;

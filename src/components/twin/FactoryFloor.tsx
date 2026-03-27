import { motion } from "framer-motion";
import type { Equipment, EquipmentStatus } from "@/hooks/usePlantData";

const statusColors: Record<EquipmentStatus, string> = {
  running: "bg-operational border-operational/50",
  warning: "bg-gap border-gap/50",
  critical: "bg-destructive border-destructive/50",
  offline: "bg-muted-foreground border-muted-foreground/50",
  maintenance: "bg-engineering border-engineering/50",
};

const statusPulse: Record<EquipmentStatus, boolean> = {
  running: false, warning: true, critical: true, offline: false, maintenance: false,
};

interface FactoryFloorProps {
  equipment: Equipment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const FactoryFloor = ({ equipment, selectedId, onSelect }: FactoryFloorProps) => {
  return (
    <div className="relative w-full aspect-[16/9] rounded-xl border border-border bg-card overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-3 left-3 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
        Factory Floor — Live View
      </div>

      {equipment.map((eq) => {
        const isSelected = eq.id === selectedId;
        const colorClass = statusColors[eq.status];
        const shouldPulse = statusPulse[eq.status];

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
            {shouldPulse && (
              <span className={`absolute inset-0 rounded-full ${colorClass} opacity-30 animate-ping`} />
            )}
            <span
              className={`relative block w-4 h-4 rounded-full border-2 ${colorClass} ${
                isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
              }`}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-popover border border-border rounded-md px-2.5 py-1.5 text-[10px] whitespace-nowrap shadow-lg">
                <p className="font-semibold text-foreground font-mono">{eq.tag}</p>
                <p className="text-muted-foreground capitalize">{eq.status} · {eq.health}%</p>
              </div>
            </div>
          </motion.button>
        );
      })}

      <div className="absolute bottom-3 right-3 flex items-center gap-3 text-[9px] text-muted-foreground font-mono">
        {(["running", "warning", "critical", "maintenance", "offline"] as EquipmentStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${statusColors[s]}`} />
            <span className="capitalize">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactoryFloor;

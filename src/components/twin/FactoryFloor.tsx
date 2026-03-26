import { motion } from "framer-motion";
import type { Equipment, EquipmentStatus } from "@/hooks/useFactoryData";

const statusColors: Record<EquipmentStatus, string> = {
  running: "bg-operational border-operational/50",
  warning: "bg-gap border-gap/50",
  critical: "bg-destructive border-destructive/50",
  offline: "bg-muted-foreground border-muted-foreground/50",
  maintenance: "bg-engineering border-engineering/50",
};

const statusPulse: Record<EquipmentStatus, boolean> = {
  running: false,
  warning: true,
  critical: true,
  offline: false,
  maintenance: false,
};

const typeIcons: Record<Equipment["type"], string> = {
  pump: "⏚",
  compressor: "⊛",
  heat_exchanger: "≋",
  motor: "⊕",
  valve: "⊗",
  turbine: "◎",
  boiler: "△",
  generator: "⚡",
};

interface FactoryFloorProps {
  equipment: Equipment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const FactoryFloor = ({ equipment, selectedId, onSelect }: FactoryFloorProps) => {
  return (
    <div className="relative w-full aspect-[16/9] rounded-xl border border-border bg-card overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Zone labels */}
      <div className="absolute top-3 left-3 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
        Factory Floor — Live View
      </div>

      {/* Zone overlays */}
      {[
        { label: "Zone A — Feed", x: 5, y: 15, w: 45, h: 35, color: "engineering" },
        { label: "Zone B — Cooling", x: 50, y: 10, w: 25, h: 30, color: "operational" },
        { label: "Zone C — Utilities", x: 70, y: 40, w: 28, h: 30, color: "muted-foreground" },
        { label: "Zone D — Production", x: 48, y: 58, w: 30, h: 25, color: "gap" },
        { label: "Zone E — Power", x: 5, y: 60, w: 30, h: 30, color: "primary" },
      ].map((zone) => (
        <div
          key={zone.label}
          className="absolute border border-border/30 rounded-lg"
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.w}%`,
            height: `${zone.h}%`,
          }}
        >
          <span className="absolute top-1 left-2 text-[9px] font-mono text-muted-foreground/40">
            {zone.label}
          </span>
        </div>
      ))}

      {/* Equipment nodes */}
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
            {/* Pulse ring */}
            {shouldPulse && (
              <span className={`absolute inset-0 rounded-full ${colorClass} opacity-30 animate-ping`} />
            )}

            {/* Dot */}
            <span
              className={`relative block w-5 h-5 rounded-full border-2 ${colorClass} ${
                isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""
              }`}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[8px] text-background font-bold">
                {typeIcons[eq.type]}
              </span>
            </span>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-popover border border-border rounded-md px-2.5 py-1.5 text-[10px] whitespace-nowrap shadow-lg">
                <p className="font-semibold text-foreground">{eq.name}</p>
                <p className="text-muted-foreground capitalize">{eq.status} · {eq.health}% health</p>
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Legend */}
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

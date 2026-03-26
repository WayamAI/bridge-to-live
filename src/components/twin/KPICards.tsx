import type { Equipment } from "@/hooks/useFactoryData";
import { Activity, Thermometer, Gauge, Zap } from "lucide-react";

interface KPICardsProps {
  equipment: Equipment[];
}

const KPICards = ({ equipment }: KPICardsProps) => {
  const running = equipment.filter((e) => e.status === "running").length;
  const warnings = equipment.filter((e) => e.status === "warning" || e.status === "critical").length;
  const avgHealth = Math.round(equipment.reduce((acc, e) => acc + e.health, 0) / equipment.length);
  const totalSensors = equipment.reduce((acc, e) => acc + e.sensors.length, 0);

  const cards = [
    { label: "Equipment Online", value: `${running}/${equipment.length}`, icon: Activity, color: "text-operational" },
    { label: "Active Alerts", value: warnings.toString(), icon: Gauge, color: warnings > 0 ? "text-destructive" : "text-operational" },
    { label: "Avg Health", value: `${avgHealth}%`, icon: Thermometer, color: avgHealth > 80 ? "text-operational" : "text-gap" },
    { label: "Live Sensors", value: totalSensors.toString(), icon: Zap, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-3.5 h-3.5 ${card.color}`} />
              <span className="text-[10px] text-muted-foreground font-medium">{card.label}</span>
            </div>
            <p className={`text-xl font-bold font-mono ${card.color}`}>{card.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;

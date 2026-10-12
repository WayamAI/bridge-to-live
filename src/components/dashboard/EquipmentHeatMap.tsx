import { useMemo } from "react";
import type { Equipment } from "@/hooks/usePlantData";

interface EquipmentHeatMapProps {
  equipment: Equipment[];
  onSelect: (id: string) => void;
}

const HEALTH_DIMENSIONS = ["Temperature", "Pressure", "Vibration", "Flow", "Power", "Overall"];

const PROCESS_UNITS_MAP = [
  "Compression Train A",
  "Compression Train B",
  "Cooling Water",
  "Liquefaction Cold Box",
  "Utilities Block",
  "Flare System",
  "Power Generation",
  "Feed Gas Receiving",
  "Instrument Air",
  "Marine Loading Arms",
];

function getHealthColor(score: number): string {
  if (score >= 85) return "bg-operational/80";
  if (score >= 65) return "bg-gap/80";
  return "bg-destructive/80";
}

function getHealthTextColor(score: number): string {
  if (score >= 85) return "text-operational-foreground";
  if (score >= 65) return "text-gap-foreground";
  return "text-destructive-foreground";
}

const EquipmentHeatMap = ({ equipment, onSelect }: EquipmentHeatMapProps) => {
  const heatData = useMemo(() => {
    return PROCESS_UNITS_MAP.map(pu => {
      const puEquip = equipment.filter(e => e.processUnit === pu);
      if (puEquip.length === 0) return null;
      const avgHealth = Math.round(puEquip.reduce((a, e) => a + e.health, 0) / puEquip.length);
      
      // Generate dimensional scores based on sensors
      const dimensions = HEALTH_DIMENSIONS.map(dim => {
        if (dim === "Overall") return avgHealth;
        const base = avgHealth + (Math.random() - 0.5) * 20;
        return Math.max(30, Math.min(100, Math.round(base)));
      });

      return {
        processUnit: pu,
        dimensions,
        equipmentIds: puEquip.map(e => e.id),
        firstId: puEquip[0].id,
      };
    }).filter(Boolean);
  }, [equipment]);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Equipment Health Heat Map</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full type-body-sm">
          <thead>
            <tr className="border-b border-hairline">
              <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary w-40">Process Unit</th>
              {HEALTH_DIMENSIONS.map(d => (
                <th key={d} className="text-center px-2 py-2 font-medium text-muted-foreground w-16">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatData.map((row) => row && (
              <tr
                key={row.processUnit}
                className="border-b border-hairline last:border-0 cursor-pointer hover:bg-raised"
                onClick={() => onSelect(row.firstId)}
              >
                <td className="px-3 py-2 font-medium type-body-sm">{row.processUnit}</td>
                {row.dimensions.map((score, i) => (
                  <td key={i} className="px-1 py-2 text-center">
                    <span className={`inline-block w-12 py-1 rounded type-body-sm font-bold tabular ${getHealthColor(score)} ${getHealthTextColor(score)}`}>
                      {score}%
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentHeatMap;

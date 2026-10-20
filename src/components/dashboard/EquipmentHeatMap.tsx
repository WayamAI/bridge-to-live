import { useMemo } from "react";
import { Panel } from "@/components/ui/primitives";
import type { Equipment } from "@/hooks/usePlantData";
import { activatable, activatableFocus } from "@/lib/a11y";

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

// Quiet when healthy; a tinted chip only for scores that need attention (thresholds unchanged: 85 and 65).
function getHealthColor(score: number): string {
  if (score >= 85) return "";
  if (score >= 65) return "bg-warning-surface";
  return "bg-error-surface";
}

function getHealthTextColor(score: number): string {
  if (score >= 85) return "text-secondary-foreground";
  if (score >= 65) return "text-warning";
  return "text-error";
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
    <Panel title="Equipment Health Heat Map" padded={false}>
      <div className="overflow-x-auto">
        <table className="w-full type-body-sm">
          <thead>
            <tr className="border-b border-hairline">
              <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary w-40">Process Unit</th>
              {HEALTH_DIMENSIONS.map(d => (
                <th key={d} className="type-eyebrow whitespace-nowrap px-2 py-2 text-center text-quaternary">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatData.map((row) => row && (
              <tr
                key={row.processUnit}
                className={`border-b border-hairline last:border-0 cursor-pointer hover:bg-raised ${activatableFocus}`}
                {...activatable(() => onSelect(row.firstId))}
              >
                <td className="px-3 py-2 font-medium text-foreground">{row.processUnit}</td>
                {row.dimensions.map((score, i) => (
                  <td key={i} className="px-1 py-2 text-center">
                    <span className={`inline-block w-12 rounded-full py-0.5 type-label-sm tabular ${getHealthColor(score)} ${getHealthTextColor(score)}`}>
                      {score}%
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};

export default EquipmentHeatMap;

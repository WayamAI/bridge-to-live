import type { Equipment } from "@/hooks/useFactoryData";
import { formatNumber } from "@/lib/format";

interface EquipmentTableProps {
  equipment: Equipment[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusDot: Record<string, string> = {
  running: "bg-operational",
  warning: "bg-gap",
  critical: "bg-destructive",
  offline: "bg-muted-foreground",
  maintenance: "bg-engineering",
};

const EquipmentTable = ({ equipment, selectedId, onSelect }: EquipmentTableProps) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Equipment Registry</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Equipment</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Zone</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Health</th>
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Runtime</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((eq) => (
              <tr
                key={eq.id}
                onClick={() => onSelect(eq.id)}
                className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/20 ${
                  selectedId === eq.id ? "bg-primary/5" : ""
                }`}
              >
                <td className="px-3 py-2 font-medium">{eq.name}</td>
                <td className="px-3 py-2 text-muted-foreground">{eq.zone}</td>
                <td className="px-3 py-2">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${statusDot[eq.status]}`} />
                    <span className="capitalize">{eq.status}</span>
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          eq.health > 80 ? "bg-operational" : eq.health > 50 ? "bg-gap" : "bg-destructive"
                        }`}
                        style={{ width: `${eq.health}%` }}
                      />
                    </div>
                    <span className="font-mono">{eq.health}%</span>
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-muted-foreground">{formatNumber(eq.runtimeHours)}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentTable;

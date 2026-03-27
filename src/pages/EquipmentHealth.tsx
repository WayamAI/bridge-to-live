import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import type { Equipment } from "@/hooks/usePlantData";
import EquipmentDetail from "@/components/twin/EquipmentDetail";
import FactoryFloor from "@/components/twin/FactoryFloor";
import { ArrowUpDown, Search } from "lucide-react";

interface EquipmentHealthPageProps {
  equipment: Equipment[];
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string | null) => void;
}

const statusDot: Record<string, string> = {
  running: "bg-operational",
  warning: "bg-gap",
  critical: "bg-destructive",
  offline: "bg-muted-foreground",
  maintenance: "bg-engineering",
};

type SortKey = "tag" | "classLabel" | "processUnit" | "health" | "status" | "rulDays" | "lastAlarm";

const EquipmentHealthPage = ({ equipment, selectedEquipmentId, onSelectEquipment }: EquipmentHealthPageProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("health");
  const [sortAsc, setSortAsc] = useState(true);
  const [filterUnit, setFilterUnit] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [search, setSearch] = useState("");

  const selectedEquipment = equipment.find(e => e.id === selectedEquipmentId);

  const processUnits = useMemo(() => {
    const units = new Set(equipment.map(e => e.processUnit));
    return ["All", ...Array.from(units).sort()];
  }, [equipment]);

  const filtered = useMemo(() => {
    let list = [...equipment];
    if (filterUnit !== "All") list = list.filter(e => e.processUnit === filterUnit);
    if (filterStatus !== "All") list = list.filter(e => e.status === filterStatus);
    if (search) list = list.filter(e => e.tag.toLowerCase().includes(search.toLowerCase()) || e.name.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      if (typeof aVal === "number" && typeof bVal === "number") return sortAsc ? aVal - bVal : bVal - aVal;
      return sortAsc ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
    return list;
  }, [equipment, filterUnit, filterStatus, search, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <th
      className="text-left px-3 py-2 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
      onClick={() => handleSort(k)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortKey === k ? "text-primary" : "text-muted-foreground/30"}`} />
      </span>
    </th>
  );

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary w-52"
          />
        </div>
        <select
          value={filterUnit}
          onChange={(e) => setFilterUnit(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-border bg-card focus:outline-none"
        >
          {processUnits.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-border bg-card focus:outline-none"
        >
          <option value="All">All Status</option>
          <option value="running">Running</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <span className="text-[10px] text-muted-foreground font-mono ml-auto">{filtered.length} equipment shown</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        {/* Equipment Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card z-10">
                <tr className="border-b border-border bg-muted/30">
                  <SortHeader label="Tag" k="tag" />
                  <SortHeader label="Class" k="classLabel" />
                  <SortHeader label="Process Unit" k="processUnit" />
                  <SortHeader label="Health" k="health" />
                  <SortHeader label="Last Alarm" k="lastAlarm" />
                  <SortHeader label="RUL" k="rulDays" />
                  <SortHeader label="Status" k="status" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((eq) => (
                  <tr
                    key={eq.id}
                    onClick={() => onSelectEquipment(eq.id)}
                    className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/20 ${
                      selectedEquipmentId === eq.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-3 py-2 font-mono text-primary font-medium">{eq.tag}</td>
                    <td className="px-3 py-2 text-muted-foreground">{eq.classLabel}</td>
                    <td className="px-3 py-2 text-muted-foreground">{eq.processUnit}</td>
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
                    <td className="px-3 py-2 text-muted-foreground text-[11px]">{eq.lastAlarm}</td>
                    <td className="px-3 py-2 font-mono">
                      {eq.rulDays !== null ? (
                        <span className={eq.rulDays < 30 ? "text-destructive" : eq.rulDays < 90 ? "text-gap" : "text-foreground"}>
                          {eq.rulDays}d
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusDot[eq.status]}`} />
                        <span className="capitalize">{eq.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedEquipment && (
            <EquipmentDetail
              key={selectedEquipment.id}
              equipment={selectedEquipment}
              onClose={() => onSelectEquipment(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EquipmentHealthPage;

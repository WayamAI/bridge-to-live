import { useState, useMemo } from "react";
import { EmptyState, EquipmentStatusLabel, Panel, PillSelect, SearchField } from "@/components/ui/primitives";
import PageHeader from "@/components/layout/PageHeader";
import { locate } from "@/components/layout/nav";
import { useLocation } from "react-router-dom";
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

type SortKey = "tag" | "classLabel" | "processUnit" | "health" | "status" | "rulDays" | "lastAlarm";

const EquipmentHealthPage = ({ equipment, selectedEquipmentId, onSelectEquipment }: EquipmentHealthPageProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("health");
  const [sortAsc, setSortAsc] = useState(true);
  const [filterUnit, setFilterUnit] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [search, setSearch] = useState("");
  const { pathname } = useLocation();

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
      aria-sort={sortKey === k ? (sortAsc ? "ascending" : "descending") : "none"}
      className="type-eyebrow cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left text-quaternary hover:text-secondary-foreground"
      onClick={() => handleSort(k)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`size-3 ${sortKey === k ? "text-foreground" : "text-quaternary opacity-50"}`} aria-hidden />
      </span>
    </th>
  );

  return (
    <PageHeader
      title={locate(pathname).title}
      subtitle="Equipment status, health and remaining useful life across the plant"
      actions={
        <>
          <SearchField
            type="text"
            placeholder="Search equipment…"
            aria-label="Search equipment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <PillSelect value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)} aria-label="Filter by process unit">
            {processUnits.map(u => <option key={u} value={u}>{u === "All" ? "All units" : u}</option>)}
          </PillSelect>
          <PillSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Filter by status">
            <option value="All">All statuses</option>
            <option value="running">Running</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </PillSelect>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* Equipment table */}
        <Panel
          title="Equipment Registry"
          padded={false}
          action={<span className="type-caption tabular text-quaternary">{filtered.length} equipment shown</span>}
        >
          <div className="max-h-[600px] overflow-x-auto overflow-y-auto">
            <table className="w-full type-body-sm">
              <thead className="sticky top-0 z-10 bg-container">
                <tr className="border-b border-hairline">
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
                    className={`border-b border-hairline last:border-0 cursor-pointer transition-colors hover:bg-raised ${selectedEquipmentId === eq.id ? "bg-raised" : ""}`}
                  >
                    <td className="px-3 py-2 tabular text-foreground font-medium whitespace-nowrap">{eq.tag}</td>
                    <td className="px-3 py-2 text-tertiary">{eq.classLabel}</td>
                    <td className="px-3 py-2 text-tertiary">{eq.processUnit}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 shrink-0 overflow-hidden rounded-full bg-raised-2">
                          <div
                            className={`h-full rounded-full ${
                              eq.health > 80 ? "bg-quaternary" : eq.health > 50 ? "bg-warning" : "bg-error"
                            }`}
                            style={{ width: `${eq.health}%` }}
                          />
                        </div>
                        <span className="tabular">{eq.health}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-tertiary type-body-sm">{eq.lastAlarm}</td>
                    <td className="px-3 py-2 tabular whitespace-nowrap">
                      {eq.rulDays !== null ? (
                        <span className={eq.rulDays < 30 ? "text-error" : eq.rulDays < 90 ? "text-warning" : "text-foreground"}>
                          {eq.rulDays}d
                        </span>
                      ) : (
                        <span className="text-tertiary">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <EquipmentStatusLabel status={eq.status} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7}><EmptyState title="No equipment match this filter" className="min-h-[96px]" /></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Detail panel */}
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
    </PageHeader>
  );
};

export default EquipmentHealthPage;

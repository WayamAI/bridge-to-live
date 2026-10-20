import { useState } from "react";
import { icons, kpi } from "@/lib/icons";
import { toast } from "sonner";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { syncRunTone } from "@/lib/status";
import { formatNumber } from "@/lib/format";
import { shiftTimestamp } from "@/lib/mockDates";

const SYNC_LOG = [
  { timestamp: shiftTimestamp("2026-03-24 08:14:22"), records: "240,412", newTags: 24, modified: 148, deleted: 0, errors: 2, status: "Completed" },
  { timestamp: shiftTimestamp("2026-03-17 08:12:04"), records: "240,388", newTags: 42, modified: 94, deleted: 8, errors: 0, status: "Completed" },
  { timestamp: shiftTimestamp("2026-03-10 08:15:38"), records: "240,354", newTags: 18, modified: 210, deleted: 0, errors: 0, status: "Completed" },
  { timestamp: shiftTimestamp("2026-03-03 08:10:55"), records: "240,126", newTags: 86, modified: 320, deleted: 12, errors: 4, status: "Completed with errors" },
  { timestamp: shiftTimestamp("2026-02-24 08:14:11"), records: "240,064", newTags: 14, modified: 62, deleted: 0, errors: 0, status: "Completed" },
];

const DELTA_DETAILS = [
  { category: "Equipment tags", source: "SmartPlant Foundation", total: 2847, synced: 2847, delta: "+24 new" },
  { category: "P&ID references", source: "SmartPlant P&ID", total: 12440, synced: 12440, delta: "+148 modified" },
  { category: "Instrument data", source: "SmartPlant Instrumentation", total: 42400, synced: 42398, delta: "2 errors" },
  { category: "Equipment datasheets", source: "SmartPlant Reference Data", total: 2847, synced: 2847, delta: "No change" },
  { category: "3D model coordinates", source: "Smart3D", total: 2847, synced: 2847, delta: "No change" },
];

const TwinSync = () => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success("Engineering twin sync completed", { description: "240,412 records synced · 0 errors" });
    }, 3000);
  };

  return (
    <PageHeader
      actions={
        <button
          onClick={handleSync}
          disabled={syncing}
          className="type-label-sm inline-flex h-8 items-center gap-1.5 rounded-full bg-action-primary px-3 text-on-color outline-none transition-colors duration-[180ms] hover:bg-action-primary-hover focus-visible:ring-2 focus-visible:ring-active disabled:bg-action-primary-disabled"
        >
          <icons.sync className="size-[13px]" aria-hidden />
          {syncing ? "Syncing…" : "Force sync now"}
        </button>
      }
    >

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Last Sync", icon: kpi.time, value: "6 days ago" },
          { label: "Records Synced", icon: kpi.records, value: "240,412" },
          { label: "Sync Errors", icon: kpi.error, value: "2", color: "text-warning" },
          { label: "Coverage", icon: kpi.percent, value: "99.99%" },
        ].map(s => (
          <KpiTile key={s.label} icon={s.icon} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      {/* Data Source Mapping */}
      <Panel title="Data Source Mapping · Current Sync State" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Category</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Source System</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Total Records</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Synced</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Delta (Last Sync)</th>
              </tr>
            </thead>
            <tbody>
              {DELTA_DETAILS.map(d => (
                <tr key={d.category} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 font-medium">{d.category}</td>
                  <td className="py-2 px-3 type-body-sm text-tertiary">{d.source}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{formatNumber(d.total)}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{formatNumber(d.synced)}</td>
                  <td className="py-2 px-3 type-body-sm">
                    <span className={d.delta.includes("error") ? "text-error" : d.delta === "No change" ? "text-tertiary" : "text-foreground"}>{d.delta}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Sync History */}
      <Panel title="Sync History" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Timestamp</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Records</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">New</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Modified</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Deleted</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Errors</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
              </tr>
            </thead>
            <tbody>
              {SYNC_LOG.map(s => (
                <tr key={s.timestamp} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 tabular type-body-sm whitespace-nowrap">{s.timestamp}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{s.records}</td>
                  <td className="py-2 px-3 text-right tabular text-foreground whitespace-nowrap">{s.newTags}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{s.modified}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{s.deleted}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{s.errors > 0 ? <span className="text-error">{s.errors}</span> : "0"}</td>
                  <td className="py-2 px-3">
                    <ToneStatus tone={syncRunTone(s.errors)}>{s.status}</ToneStatus>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default TwinSync;

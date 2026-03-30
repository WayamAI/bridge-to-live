import { useState } from "react";
import { Cable, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const SYNC_LOG = [
  { timestamp: "2026-03-24 08:14:22", records: "240,412", newTags: 24, modified: 148, deleted: 0, errors: 2, status: "Completed" },
  { timestamp: "2026-03-17 08:12:04", records: "240,388", newTags: 42, modified: 94, deleted: 8, errors: 0, status: "Completed" },
  { timestamp: "2026-03-10 08:15:38", records: "240,354", newTags: 18, modified: 210, deleted: 0, errors: 0, status: "Completed" },
  { timestamp: "2026-03-03 08:10:55", records: "240,126", newTags: 86, modified: 320, deleted: 12, errors: 4, status: "Completed with errors" },
  { timestamp: "2026-02-24 08:14:11", records: "240,064", newTags: 14, modified: 62, deleted: 0, errors: 0, status: "Completed" },
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
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h1 className="text-lg font-bold flex items-center gap-2"><Cable className="w-5 h-5 text-primary" /> Engineering Twin Sync</h1>
      <p className="text-xs text-muted-foreground -mt-3">Synchronization status between Hexagon SmartPlant engineering twin and PlantMind operational twin</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Last Sync", value: "6 days ago" },
          { label: "Records Synced", value: "240,412" },
          { label: "Sync Errors", value: "2", color: "text-gap" },
          { label: "Coverage", value: "99.99%", color: "text-operational" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex">
        <button onClick={handleSync} disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:opacity-90 disabled:opacity-50 transition-opacity">
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Force Sync Now"}
        </button>
      </div>

      {/* Data Source Mapping */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Data Source Mapping — Current Sync State</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Category</th>
                <th className="text-left py-2 px-3 font-medium">Source System</th>
                <th className="text-right py-2 px-3 font-medium">Total Records</th>
                <th className="text-right py-2 px-3 font-medium">Synced</th>
                <th className="text-left py-2 px-3 font-medium">Delta (Last Sync)</th>
              </tr>
            </thead>
            <tbody>
              {DELTA_DETAILS.map(d => (
                <tr key={d.category} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-2 px-3 font-medium">{d.category}</td>
                  <td className="py-2 px-3 text-[10px] text-muted-foreground">{d.source}</td>
                  <td className="py-2 px-3 text-right font-mono">{d.total.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-mono">{d.synced.toLocaleString()}</td>
                  <td className="py-2 px-3 text-[10px]">
                    <span className={d.delta.includes("error") ? "text-destructive" : d.delta === "No change" ? "text-muted-foreground" : "text-primary"}>{d.delta}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync History */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Sync History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Timestamp</th>
                <th className="text-right py-2 px-3 font-medium">Records</th>
                <th className="text-right py-2 px-3 font-medium">New</th>
                <th className="text-right py-2 px-3 font-medium">Modified</th>
                <th className="text-right py-2 px-3 font-medium">Deleted</th>
                <th className="text-right py-2 px-3 font-medium">Errors</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {SYNC_LOG.map(s => (
                <tr key={s.timestamp} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-2 px-3 font-mono text-[10px]">{s.timestamp}</td>
                  <td className="py-2 px-3 text-right font-mono">{s.records}</td>
                  <td className="py-2 px-3 text-right font-mono text-primary">{s.newTags}</td>
                  <td className="py-2 px-3 text-right font-mono">{s.modified}</td>
                  <td className="py-2 px-3 text-right font-mono">{s.deleted}</td>
                  <td className="py-2 px-3 text-right font-mono">{s.errors > 0 ? <span className="text-destructive">{s.errors}</span> : "0"}</td>
                  <td className="py-2 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.errors > 0 ? "bg-gap/10 text-gap" : "bg-operational/10 text-operational"}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TwinSync;

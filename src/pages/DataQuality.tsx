import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Gauge, AlertTriangle, CheckCircle } from "lucide-react";

const DATA_SOURCES = [
  { source: "Honeywell Experion DCS", freshness: 100, completeness: 99.8, accuracy: 99.9, status: "Healthy" },
  { source: "Siemens S7 PLC Network", freshness: 100, completeness: 99.4, accuracy: 99.7, status: "Healthy" },
  { source: "OSIsoft PI Historian", freshness: 98, completeness: 98.2, accuracy: 99.5, status: "Healthy" },
  { source: "IBM Maximo CMMS", freshness: 92, completeness: 94.8, accuracy: 97.2, status: "Warning" },
  { source: "SAP PM / ERP", freshness: 78, completeness: 91.4, accuracy: 96.8, status: "Warning" },
  { source: "Hexagon SmartPlant", freshness: 42, completeness: 99.9, accuracy: 99.8, status: "Degraded" },
  { source: "Fluke Reliability", freshness: 68, completeness: 88.4, accuracy: 94.2, status: "Degraded" },
  { source: "Schneider Power Monitor", freshness: 96, completeness: 97.8, accuracy: 99.1, status: "Healthy" },
  { source: "LDAR Leak Detection", freshness: 85, completeness: 92.0, accuracy: 98.4, status: "Healthy" },
  { source: "SIS", freshness: 100, completeness: 100, accuracy: 100, status: "Healthy" },
];

const INGESTION_LOG = [
  { timestamp: "2026-03-30 14:28:00", source: "DCS", records: "82.4M", latency: "<1 sec", errors: 0 },
  { timestamp: "2026-03-30 14:27:30", source: "PLC", records: "14.2M", latency: "<1 sec", errors: 0 },
  { timestamp: "2026-03-30 14:27:00", source: "PI Historian", records: "6.8M", latency: "30 sec", errors: 12 },
  { timestamp: "2026-03-30 14:15:00", source: "Maximo CMMS", records: "1,240", latency: "15 min", errors: 0 },
  { timestamp: "2026-03-30 10:00:00", source: "SAP PM", records: "8,420", latency: "4 hr batch", errors: 4 },
  { timestamp: "2026-03-30 08:14:22", source: "SmartPlant", records: "240K", latency: "6 days", errors: 2 },
  { timestamp: "2026-03-30 12:28:00", source: "Fluke", records: "42K", latency: "2 hr lag", errors: 84 },
  { timestamp: "2026-03-30 14:25:00", source: "Schneider", records: "1.2M", latency: "5 min", errors: 0 },
];

const STATUS_COLORS: Record<string, string> = {
  Healthy: "bg-operational/10 text-operational",
  Warning: "bg-gap/10 text-gap",
  Degraded: "bg-destructive/10 text-destructive",
};

const DataQuality = () => {
  const avgFreshness = Math.round(DATA_SOURCES.reduce((s, d) => s + d.freshness, 0) / DATA_SOURCES.length);
  const avgCompleteness = Math.round(DATA_SOURCES.reduce((s, d) => s + d.completeness, 0) / DATA_SOURCES.length * 10) / 10;
  const healthy = DATA_SOURCES.filter(d => d.status === "Healthy").length;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold flex items-center gap-2"><Gauge className="w-5 h-5 text-primary" /> Data Quality Monitor</h2>
      <p className="text-xs text-muted-foreground -mt-3">Real-time monitoring of data source health, freshness, and ingestion quality</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg Data Freshness", value: `${avgFreshness}%`, color: avgFreshness >= 90 ? "text-operational" : "text-gap" },
          { label: "Avg Completeness", value: `${avgCompleteness}%`, color: avgCompleteness >= 95 ? "text-operational" : "text-gap" },
          { label: "Healthy Sources", value: `${healthy}/${DATA_SOURCES.length}`, color: "text-operational" },
          { label: "Total Ingestion Errors (24h)", value: "102", color: "text-gap" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Source Quality Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Data Source Quality Scores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Source</th>
                <th className="text-right py-2 px-3 font-medium">Freshness %</th>
                <th className="text-right py-2 px-3 font-medium">Completeness %</th>
                <th className="text-right py-2 px-3 font-medium">Accuracy %</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map(d => (
                <tr key={d.source} className={`border-b border-border/50 hover:bg-muted/20 ${d.status === "Degraded" ? "bg-destructive/5" : ""}`}>
                  <td className="py-2 px-3 font-medium">{d.source}</td>
                  <td className="py-2 px-3 text-right font-mono"><span className={d.freshness >= 90 ? "text-operational" : d.freshness >= 70 ? "text-gap" : "text-destructive"}>{d.freshness}</span></td>
                  <td className="py-2 px-3 text-right font-mono"><span className={d.completeness >= 95 ? "text-operational" : "text-gap"}>{d.completeness}</span></td>
                  <td className="py-2 px-3 text-right font-mono"><span className={d.accuracy >= 98 ? "text-operational" : "text-gap"}>{d.accuracy}</span></td>
                  <td className="py-2 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[d.status]}`}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingestion Log */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Ingestion Log — Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Timestamp</th>
                <th className="text-left py-2 px-3 font-medium">Source</th>
                <th className="text-right py-2 px-3 font-medium">Records</th>
                <th className="text-left py-2 px-3 font-medium">Latency</th>
                <th className="text-right py-2 px-3 font-medium">Errors</th>
              </tr>
            </thead>
            <tbody>
              {INGESTION_LOG.map((l, i) => (
                <tr key={i} className={`border-b border-border/50 hover:bg-muted/20 ${l.errors > 10 ? "bg-gap/5" : ""}`}>
                  <td className="py-2 px-3 font-mono text-[10px]">{l.timestamp}</td>
                  <td className="py-2 px-3">{l.source}</td>
                  <td className="py-2 px-3 text-right font-mono">{l.records}</td>
                  <td className="py-2 px-3 font-mono text-[10px]">{l.latency}</td>
                  <td className="py-2 px-3 text-right font-mono">{l.errors > 0 ? <span className="text-destructive">{l.errors}</span> : "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataQuality;

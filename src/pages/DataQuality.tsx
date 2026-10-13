import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Gauge, AlertTriangle, CheckCircle } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { sourceHealth, workflowTone } from "@/lib/status";

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

const DataQuality = () => {
  const avgFreshness = Math.round(DATA_SOURCES.reduce((s, d) => s + d.freshness, 0) / DATA_SOURCES.length);
  const avgCompleteness = Math.round(DATA_SOURCES.reduce((s, d) => s + d.completeness, 0) / DATA_SOURCES.length * 10) / 10;
  const healthy = DATA_SOURCES.filter(d => d.status === "Healthy").length;

  return (
    <PageHeader title="Data Quality Monitor" subtitle="Real-time monitoring of data source health, freshness and ingestion quality">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg Data Freshness", value: `${avgFreshness}%`, color: avgFreshness >= 90 ? "" : "text-warning" },
          { label: "Avg Completeness", value: `${avgCompleteness}%`, color: avgCompleteness >= 95 ? "" : "text-warning" },
          { label: "Healthy Sources", value: `${healthy}/${DATA_SOURCES.length}` },
          { label: "Total Ingestion Errors (24h)", value: "102", color: "text-warning" },
        ].map(s => (
          <KpiTile key={s.label} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      {/* Source Quality Table */}
      <Panel title="Data Source Quality Scores" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Source</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Freshness %</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Completeness %</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Accuracy %</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map(d => (
                <tr key={d.source} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 font-medium">{d.source}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap"><span className={d.freshness >= 90 ? "" : d.freshness >= 70 ? "text-warning" : "text-error"}>{d.freshness}</span></td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap"><span className={d.completeness >= 95 ? "" : "text-warning"}>{d.completeness}</span></td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap"><span className={d.accuracy >= 98 ? "" : "text-warning"}>{d.accuracy}</span></td>
                  <td className="py-2 px-3"><ToneStatus tone={workflowTone(sourceHealth, d.status).tone} solid={workflowTone(sourceHealth, d.status).solid}>{d.status}</ToneStatus></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Ingestion Log */}
      <Panel title="Ingestion Log · Recent Activity" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Timestamp</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Source</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Records</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Latency</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Errors</th>
              </tr>
            </thead>
            <tbody>
              {INGESTION_LOG.map((l, i) => (
                <tr key={i} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 tabular type-body-sm whitespace-nowrap">{l.timestamp}</td>
                  <td className="py-2 px-3">{l.source}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{l.records}</td>
                  <td className="py-2 px-3 tabular type-body-sm whitespace-nowrap">{l.latency}</td>
                  <td className="py-2 px-3 text-right tabular whitespace-nowrap">{l.errors > 0 ? <span className="text-error">{l.errors}</span> : "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default DataQuality;

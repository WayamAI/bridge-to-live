import { useState } from "react";
import { ClipboardCheck, AlertTriangle, CheckCircle, Search } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Chip, EmptyState, KpiTile, Panel, ToneStatus } from "@/components/ui/primitives";
import { validationStatus } from "@/lib/status";

interface ValidationRecord {
  id: string;
  tag: string;
  category: string;
  rule: string;
  status: "Pass" | "Fail" | "Warning";
  details: string;
}

const VALIDATION_SUMMARY = [
  { category: "Tag naming convention", total: 12440, pass: 12180, fail: 186, warning: 74 },
  { category: "Mandatory fields", total: 12440, pass: 11842, fail: 412, warning: 186 },
  { category: "UoM compliance", total: 42400, pass: 41980, fail: 284, warning: 136 },
  { category: "Cross-reference integrity", total: 12440, pass: 12104, fail: 248, warning: 88 },
  { category: "Data type validation", total: 42400, pass: 42280, fail: 82, warning: 38 },
  { category: "Equipment class mapping", total: 2847, pass: 2812, fail: 24, warning: 11 },
];

const SAMPLE_ERRORS: ValidationRecord[] = [
  { id: "v1", tag: "TT-X-099", category: "Tag naming", rule: "TAG-NNN pattern required", status: "Fail", details: "Tag does not follow ISO 15926 naming convention — 'X' is not a valid class code" },
  { id: "v2", tag: "COMP-A-001", category: "Mandatory fields", rule: "Design pressure required", status: "Fail", details: "Design pressure field is empty — required for CFIHOS compliance" },
  { id: "v3", tag: "FT-D-018", category: "UoM compliance", rule: "Flow must be in Nm³/h", status: "Warning", details: "Flow recorded as m³/h — should be normalised to Nm³/h per project standard" },
  { id: "v4", tag: "HEX-C-003", category: "Cross-reference", rule: "P&ID ref must exist", status: "Fail", details: "P&ID reference 'PID-CW-042' not found in SmartPlant database" },
  { id: "v5", tag: "PUMP-B-012", category: "Mandatory fields", rule: "Manufacturer required", status: "Warning", details: "Manufacturer field contains abbreviation — full legal name required" },
  { id: "v6", tag: "MOT-E-018", category: "UoM compliance", rule: "Current must be in A", status: "Pass", details: "Current correctly recorded in Amperes" },
  { id: "v7", tag: "V-F-007", category: "Equipment class", rule: "CFIHOS class must match", status: "Fail", details: "Equipment class 'Vessel' should be 'Pressure Vessel' per CFIHOS R4" },
  { id: "v8", tag: "PSV-A-014", category: "Mandatory fields", rule: "Set pressure required", status: "Pass", details: "Set pressure correctly defined: 98 barg" },
];

const ISOValidator = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const totalRecords = 12440;
  const totalPass = VALIDATION_SUMMARY.reduce((s, d) => s + d.pass, 0);
  const totalFail = VALIDATION_SUMMARY.reduce((s, d) => s + d.fail, 0);
  const totalWarn = VALIDATION_SUMMARY.reduce((s, d) => s + d.warning, 0);
  const totalChecks = VALIDATION_SUMMARY.reduce((s, d) => s + d.total, 0);

  const filtered = filterStatus === "all" ? SAMPLE_ERRORS : SAMPLE_ERRORS.filter(e => e.status === filterStatus);

  return (
    <PageHeader title="ISO 15926 / CFIHOS Validator" subtitle="Automated validation of engineering data package against handover standards">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Validation Checks", value: totalChecks.toLocaleString() },
          { label: "Passing", value: totalPass.toLocaleString() },
          { label: "Failures", value: totalFail.toLocaleString(), color: "text-error" },
          { label: "Warnings", value: totalWarn.toLocaleString(), color: "text-warning" },
        ].map(s => (
          <KpiTile key={s.label} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      {/* Summary by Category */}
      <Panel title="Validation Summary by Category" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Category</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Total Checks</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Pass</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Fail</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Warning</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {VALIDATION_SUMMARY.map(d => {
                const rate = Math.round(d.pass / d.total * 1000) / 10;
                return (
                  <tr key={d.category} className="border-b border-hairline hover:bg-raised">
                    <td className="py-2 px-3 font-medium">{d.category}</td>
                    <td className="py-2 px-3 text-right tabular whitespace-nowrap">{d.total.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right tabular whitespace-nowrap">{d.pass.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right tabular text-error whitespace-nowrap">{d.fail}</td>
                    <td className="py-2 px-3 text-right tabular text-warning whitespace-nowrap">{d.warning}</td>
                    <td className="py-2 px-3 text-right tabular font-semibold whitespace-nowrap">
                      <span className={rate >= 99 ? "" : rate >= 95 ? "text-warning" : "text-error"}>{rate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Sample Errors */}
      <Panel title="Validation Details · Sample Records" padded={false}>
        <div className="flex flex-wrap gap-2 border-b border-hairline px-4 py-3">
          {["all", "Pass", "Fail", "Warning"].map(f => (
            <Chip key={f} active={filterStatus === f} onClick={() => setFilterStatus(f)}>
              {f === "all" ? "All" : f}
            </Chip>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Tag</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Category</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Rule</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Status</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary min-w-[250px]">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 tabular text-foreground font-medium whitespace-nowrap">{r.tag}</td>
                  <td className="py-2 px-3">{r.category}</td>
                  <td className="py-2 px-3 type-body-sm">{r.rule}</td>
                  <td className="py-2 px-3"><ToneStatus tone={validationStatus[r.status].tone} solid={validationStatus[r.status].solid}>{r.status}</ToneStatus></td>
                  <td className="py-2 px-3 type-body-sm">{r.details}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5}><EmptyState title="No records match this filter" className="min-h-[96px]" /></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </PageHeader>
  );
};

export default ISOValidator;

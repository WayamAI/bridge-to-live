import { useState } from "react";
import { ClipboardCheck, AlertTriangle, CheckCircle, Search } from "lucide-react";

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

const STATUS_COLORS: Record<string, string> = {
  Pass: "bg-operational/10 text-operational",
  Fail: "bg-destructive/10 text-destructive",
  Warning: "bg-gap/10 text-gap",
};

const ISOValidator = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const totalRecords = 12440;
  const totalPass = VALIDATION_SUMMARY.reduce((s, d) => s + d.pass, 0);
  const totalFail = VALIDATION_SUMMARY.reduce((s, d) => s + d.fail, 0);
  const totalWarn = VALIDATION_SUMMARY.reduce((s, d) => s + d.warning, 0);
  const totalChecks = VALIDATION_SUMMARY.reduce((s, d) => s + d.total, 0);

  const filtered = filterStatus === "all" ? SAMPLE_ERRORS : SAMPLE_ERRORS.filter(e => e.status === filterStatus);

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-primary" /> ISO 15926 / CFIHOS Validator</h2>
      <p className="text-xs text-muted-foreground -mt-3">Automated validation of engineering data package against handover standards</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Validation Checks", value: totalChecks.toLocaleString() },
          { label: "Passing", value: totalPass.toLocaleString(), color: "text-operational" },
          { label: "Failures", value: totalFail.toLocaleString(), color: "text-destructive" },
          { label: "Warnings", value: totalWarn.toLocaleString(), color: "text-gap" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Summary by Category */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Validation Summary by Category</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Category</th>
                <th className="text-right py-2 px-3 font-medium">Total Checks</th>
                <th className="text-right py-2 px-3 font-medium">Pass</th>
                <th className="text-right py-2 px-3 font-medium">Fail</th>
                <th className="text-right py-2 px-3 font-medium">Warning</th>
                <th className="text-right py-2 px-3 font-medium">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {VALIDATION_SUMMARY.map(d => {
                const rate = Math.round(d.pass / d.total * 1000) / 10;
                return (
                  <tr key={d.category} className={`border-b border-border/50 hover:bg-muted/20 ${rate < 95 ? "bg-gap/5" : ""}`}>
                    <td className="py-2 px-3 font-medium">{d.category}</td>
                    <td className="py-2 px-3 text-right font-mono">{d.total.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono text-operational">{d.pass.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono text-destructive">{d.fail}</td>
                    <td className="py-2 px-3 text-right font-mono text-gap">{d.warning}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      <span className={rate >= 99 ? "text-operational" : rate >= 95 ? "text-gap" : "text-destructive"}>{rate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Errors */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Validation Details — Sample Records</h3>
          <div className="flex gap-2">
            {["all", "Pass", "Fail", "Warning"].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className={`text-[10px] px-3 py-1 rounded-lg border ${filterStatus === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-muted-foreground bg-muted/30">
                <th className="text-left py-2 px-3 font-medium">Tag</th>
                <th className="text-left py-2 px-3 font-medium">Category</th>
                <th className="text-left py-2 px-3 font-medium">Rule</th>
                <th className="text-left py-2 px-3 font-medium">Status</th>
                <th className="text-left py-2 px-3 font-medium min-w-[250px]">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className={`border-b border-border/50 hover:bg-muted/20 ${r.status === "Fail" ? "bg-destructive/5" : ""}`}>
                  <td className="py-2 px-3 font-mono text-primary font-medium">{r.tag}</td>
                  <td className="py-2 px-3">{r.category}</td>
                  <td className="py-2 px-3 text-[10px]">{r.rule}</td>
                  <td className="py-2 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                  <td className="py-2 px-3 text-[10px]">{r.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ISOValidator;

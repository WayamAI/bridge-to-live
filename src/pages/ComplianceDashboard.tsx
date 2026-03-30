import { Lock, CheckCircle, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ComplianceDomain {
  domain: string;
  compliance: number;
  target: number;
  status: "green" | "amber" | "red";
  gaps: { finding: string; remediation: string; effort: string }[];
}

const DOMAINS: ComplianceDomain[] = [
  { domain: "System Hardening", compliance: 78, target: 90, status: "amber", gaps: [
    { finding: "3 HMIs running default admin credentials", remediation: "Enforce password policy — change all default credentials", effort: "2 days" },
    { finding: "EW-003 running Windows 10 LTSC 2019 (EOL)", remediation: "Upgrade to LTSC 2021 or replace hardware", effort: "1 week" },
    { finding: "CCTV NVR firmware EOL — known CVEs", remediation: "Replace NVR with supported model", effort: "2 weeks" },
  ]},
  { domain: "User Authentication", compliance: 91, target: 90, status: "green", gaps: [
    { finding: "PI Interface Node allows single-factor auth", remediation: "Enable MFA for historian access", effort: "1 day" },
  ]},
  { domain: "Network Segmentation", compliance: 84, target: 90, status: "amber", gaps: [
    { finding: "Level 3→Level 2 connection uses OPC-DA (unencrypted)", remediation: "Migrate to OPC-UA with TLS", effort: "4 weeks" },
    { finding: "1 unauthorised cross-zone connection detected", remediation: "Block source IP and investigate", effort: "1 day" },
  ]},
  { domain: "Patch Management", compliance: 62, target: 85, status: "red", gaps: [
    { finding: "12 OT assets have patches available but not applied", remediation: "Schedule maintenance window for patch deployment", effort: "3 days" },
    { finding: "3 assets at end-of-life with no vendor patches", remediation: "Implement compensating controls (network isolation)", effort: "2 weeks" },
    { finding: "No automated patch assessment process", remediation: "Deploy vulnerability scanner for OT network", effort: "6 weeks" },
  ]},
  { domain: "Incident Response", compliance: 70, target: 85, status: "amber", gaps: [
    { finding: "OT-specific incident response playbook not tested", remediation: "Schedule tabletop exercise with OT and IT teams", effort: "2 weeks" },
    { finding: "No automated forensic data collection for OT assets", remediation: "Deploy OT-aware SIEM integration", effort: "8 weeks" },
  ]},
];

const CHART_DATA = DOMAINS.map(d => ({
  domain: d.domain,
  compliance: d.compliance,
  target: d.target,
  fill: d.status === "green" ? "hsl(170, 80%, 45%)" : d.status === "amber" ? "hsl(35, 90%, 55%)" : "hsl(0, 72%, 51%)",
}));

const ComplianceDashboard = () => {
  const avgCompliance = Math.round(DOMAINS.reduce((s, d) => s + d.compliance, 0) / DOMAINS.length);
  const totalGaps = DOMAINS.reduce((s, d) => s + d.gaps.length, 0);

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h1 className="text-lg font-bold flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Compliance Dashboard</h1>
      <p className="text-xs text-muted-foreground -mt-3">IEC 62443 Industrial Cybersecurity Standard — compliance assessment</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Overall Compliance", value: `${avgCompliance}%`, color: avgCompliance >= 85 ? "text-operational" : "text-gap" },
          { label: "Domains Assessed", value: DOMAINS.length.toString() },
          { label: "Open Findings", value: totalGaps.toString(), color: "text-gap" },
          { label: "Critical Gaps", value: DOMAINS.filter(d => d.status === "red").length.toString(), color: "text-destructive" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-[9px] text-muted-foreground font-medium">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color || "text-foreground"}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Compliance Chart */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Compliance by Domain (%)</h3>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA} layout="vertical" margin={{ left: 140 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} />
              <YAxis type="category" dataKey="domain" tick={{ fill: "hsl(210, 20%, 92%)", fontSize: 10 }} width={130} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 18%)", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="compliance" radius={[0, 4, 4, 0]}>
                {CHART_DATA.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gaps Table */}
      <div className="space-y-3">
        {DOMAINS.map(d => (
          <div key={d.domain} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${d.status === "green" ? "bg-operational" : d.status === "amber" ? "bg-gap" : "bg-destructive"}`} />
                <h4 className="text-xs font-semibold">{d.domain}</h4>
              </div>
              <span className={`text-xs font-mono font-bold ${d.compliance >= d.target ? "text-operational" : "text-gap"}`}>{d.compliance}% / {d.target}%</span>
            </div>
            {d.gaps.length > 0 && (
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="text-left py-1.5 px-4 font-medium">Finding</th>
                    <th className="text-left py-1.5 px-4 font-medium">Remediation</th>
                    <th className="text-left py-1.5 px-4 font-medium">Effort</th>
                  </tr>
                </thead>
                <tbody>
                  {d.gaps.map((g, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="py-1.5 px-4">{g.finding}</td>
                      <td className="py-1.5 px-4">{g.remediation}</td>
                      <td className="py-1.5 px-4 font-mono">{g.effort}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceDashboard;

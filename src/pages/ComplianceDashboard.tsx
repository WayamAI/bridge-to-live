import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";
import { toneChart, toneOf } from "@/lib/status";
import PageHeader from "@/components/layout/PageHeader";
import { KpiTile, Panel, StatusDot } from "@/components/ui/primitives";
import { zoneTone } from "@/lib/status";
import { kpi } from "@/lib/icons";

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
  fill: d.status === "green" ? toneChart.success : d.status === "amber" ? toneChart.warning : toneChart.error,
}));

const ComplianceDashboard = () => {
  const avgCompliance = Math.round(DOMAINS.reduce((s, d) => s + d.compliance, 0) / DOMAINS.length);
  const totalGaps = DOMAINS.reduce((s, d) => s + d.gaps.length, 0);

  return (
    <PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Overall Compliance", icon: kpi.compliance, value: `${avgCompliance}%`, color: avgCompliance >= 85 ? "" : "text-warning" },
          { label: "Domains Assessed", icon: kpi.groups, value: DOMAINS.length.toString() },
          { label: "Open Findings", icon: kpi.findings, value: totalGaps.toString()},
          { label: "Critical Gaps", icon: kpi.gap, value: DOMAINS.filter(d => d.status === "red").length.toString(), color: "text-error" },
        ].map(s => (
          <KpiTile key={s.label} icon={s.icon} label={s.label} value={s.value} valueClassName={s.color ?? ""} />
        ))}
      </div>

      {/* Compliance Chart */}
      <Panel title="Compliance by Domain (%)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA} layout="vertical" margin={{ left: 140 }}>
              <XAxis type="number" domain={[0, 100]} tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="domain" tick={axisTick} tickLine={false} axisLine={false} width={130} />
              <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
              <Bar isAnimationActive={false} dataKey="compliance" radius={[0, 4, 4, 0]}>
                {CHART_DATA.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
      </Panel>

      {/* Gaps Table */}
      <div className="space-y-3">
        {DOMAINS.map(d => (
          <Panel
            key={d.domain}
            padded={false}
            title={
              <span className="flex items-center gap-2">
                <StatusDot tone={toneOf(zoneTone, d.status)} />
                {d.domain}
              </span>
            }
            action={<span className={`type-body-sm tabular font-medium ${d.compliance >= d.target ? "text-foreground" : "text-warning"}`}>{d.compliance}% / {d.target}%</span>}
          >
            {d.gaps.length > 0 && (
              <table className="w-full type-body-sm">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Finding</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Remediation</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Effort</th>
                  </tr>
                </thead>
                <tbody>
                  {d.gaps.map((g, i) => (
                    <tr key={i} className="border-b border-hairline hover:bg-raised">
                      <td className="py-2 px-3">{g.finding}</td>
                      <td className="py-2 px-3">{g.remediation}</td>
                      <td className="py-2 px-3 tabular whitespace-nowrap">{g.effort}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        ))}
      </div>
    </PageHeader>
  );
};

export default ComplianceDashboard;

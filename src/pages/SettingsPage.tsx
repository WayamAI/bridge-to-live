import { useState } from "react";
import { Settings as SettingsIcon, Save, Bell, Sliders, Users, Database } from "lucide-react";
import { Chip, Panel, StatusDot } from "@/components/ui/primitives";
import { priorityTone } from "@/lib/status";
import { toast } from "sonner";
import PageHeader from "@/components/layout/PageHeader";

const THRESHOLD_PRESETS = [
  { tag: "COMP-*", parameter: "Vibration (DE)", high: 4.5, highHigh: 7.5, unit: "mm/s" },
  { tag: "COMP-*", parameter: "Discharge Temp", high: 135, highHigh: 150, unit: "°C" },
  { tag: "PUMP-*", parameter: "Vibration", high: 4.5, highHigh: 7.5, unit: "mm/s" },
  { tag: "PUMP-*", parameter: "Bearing Temp", high: 80, highHigh: 95, unit: "°C" },
  { tag: "HEX-*", parameter: "Fouling Factor", high: 0.0005, highHigh: 0.001, unit: "m²K/W" },
  { tag: "MOT-*", parameter: "Winding Temp", high: 100, highHigh: 130, unit: "°C" },
  { tag: "TURB-*", parameter: "Exhaust Gas Temp", high: 600, highHigh: 650, unit: "°C" },
  { tag: "FCV-*", parameter: "Positioner Error", high: 5, highHigh: 10, unit: "%" },
];

const MODEL_PARAMS = [
  { model: "Weibull Survival", parameter: "Shape (β)", value: "2.1", description: "Failure acceleration factor" },
  { model: "Weibull Survival", parameter: "Scale (η)", value: "18,000 hr", description: "Characteristic life" },
  { model: "Anomaly Detection", parameter: "Sensitivity", value: "Medium", description: "False positive vs. detection tradeoff" },
  { model: "Anomaly Detection", parameter: "Training Window", value: "90 days", description: "Historical data used for baseline" },
  { model: "Energy Forecast", parameter: "Horizon", value: "48 hr", description: "Prediction lookahead" },
  { model: "RUL Estimator", parameter: "Confidence Threshold", value: "85%", description: "Minimum confidence for alerts" },
];

const thresholdInput =
  "h-8 w-24 rounded-full border border-hairline bg-action px-3 text-right type-label-sm tabular text-foreground outline-none transition-colors duration-[180ms] hover:border-strong focus-visible:border-strong focus-visible:ring-2 focus-visible:ring-active";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("thresholds");

  const tabs = [
    { id: "thresholds", label: "Sensor Thresholds", icon: Sliders },
    { id: "alerts", label: "Alert Configuration", icon: Bell },
    { id: "models", label: "Model Parameters", icon: Database },
    { id: "users", label: "User Management", icon: Users },
  ];

  return (
    <PageHeader title="Settings & Configuration" subtitle="System configuration, thresholds, alert rules and model parameters">

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(t => (
          <Chip key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} className="shrink-0">
            {t.label}
          </Chip>
        ))}
      </div>

      {activeTab === "thresholds" && (
        <Panel title="Sensor Alarm Thresholds" padded={false}
          action={
            <button onClick={() => toast.success("Thresholds saved")} className="type-label-sm inline-flex h-7 items-center gap-1 rounded-full bg-action-primary px-3 text-on-color outline-none transition-colors duration-[180ms] hover:bg-action-primary-hover focus-visible:ring-2 focus-visible:ring-active">
              <Save className="size-3" aria-hidden /> Save changes
            </button>
          }>
          <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Tag Pattern</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Parameter</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">HIGH Alarm</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">HIGH-HIGH Alarm</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Unit</th>
              </tr>
            </thead>
            <tbody>
              {THRESHOLD_PRESETS.map((t, i) => (
                <tr key={i} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 tabular text-foreground whitespace-nowrap">{t.tag}</td>
                  <td className="py-2 px-3">{t.parameter}</td>
                  <td className="py-2 px-3 text-right"><input defaultValue={t.high} aria-label={`${t.tag} ${t.parameter} high alarm`} className={thresholdInput} /></td>
                  <td className="py-2 px-3 text-right"><input defaultValue={t.highHigh} aria-label={`${t.tag} ${t.parameter} high-high alarm`} className={thresholdInput} /></td>
                  <td className="py-2 px-3 text-tertiary">{t.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Panel>
      )}

      {activeTab === "alerts" && (
        <Panel title="Alert Routing Configuration">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { severity: "Critical (P1)", route: "SMS + Email + Dashboard + Siren", delay: "0 sec" },
              { severity: "High (P2)", route: "Email + Dashboard", delay: "30 sec" },
              { severity: "Warning (P3)", route: "Dashboard only", delay: "5 min" },
              { severity: "Info (P4)", route: "Log only", delay: "15 min" },
            ].map((a, i) => (
              <div key={a.severity} className="rounded-lg border border-hairline bg-raised p-3">
                <p className="type-label-md flex items-center gap-2 text-foreground"><StatusDot tone={priorityTone(i + 1)} />{a.severity}</p>
                <p className="type-caption mt-1 text-tertiary">Route: {a.route}</p>
                <p className="type-caption text-tertiary">Suppression delay: {a.delay}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {activeTab === "models" && (
        <Panel title="AI/ML Model Parameters" padded={false}>
          <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Model</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Parameter</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Value</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Description</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_PARAMS.map((p, i) => (
                <tr key={i} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 font-medium">{p.model}</td>
                  <td className="py-2 px-3">{p.parameter}</td>
                  <td className="py-2 px-3 tabular font-semibold whitespace-nowrap">{p.value}</td>
                  <td className="py-2 px-3 text-tertiary">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Panel>
      )}

      {activeTab === "users" && (
        <Panel title="User Roles & Access" padded={false}>
          <div className="overflow-x-auto">
          <table className="w-full type-body-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Role</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Primary Focus</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Screen Access</th>
                <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-center text-quaternary">Active Users</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: "Plant Director", focus: "Cross-plant visibility, executive KPIs", access: "All screens", users: 2 },
                { role: "Operations Engineer", focus: "Real-time equipment status, alarms", access: "Plant Overview, Equipment, Alarms", users: 8 },
                { role: "Reliability Engineer", focus: "Failure analysis, predictive maintenance", access: "Equipment, Failure Analysis, PM, RUL", users: 4 },
                { role: "Maintenance Manager", focus: "Work orders, cost tracking", access: "Maintenance, Work Orders, Cost Tracker", users: 3 },
                { role: "Energy Manager", focus: "Utility consumption, optimisation", access: "Energy, Load Optimisation, Sustainability", users: 2 },
                { role: "IT/OT Security Analyst", focus: "OT asset inventory, threat monitoring", access: "OT Security, Asset Registry, Compliance", users: 2 },
                { role: "Handover Manager", focus: "Data completeness, ISO compliance", access: "Handover, Data Quality, Twin Sync", users: 3 },
              ].map(u => (
                <tr key={u.role} className="border-b border-hairline hover:bg-raised">
                  <td className="py-2 px-3 font-medium">{u.role}</td>
                  <td className="py-2 px-3">{u.focus}</td>
                  <td className="py-2 px-3 type-body-sm">{u.access}</td>
                  <td className="py-2 px-3 text-center tabular whitespace-nowrap">{u.users}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Panel>
      )}
    </PageHeader>
  );
};

export default SettingsPage;

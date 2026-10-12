import { useState } from "react";
import { Settings as SettingsIcon, Save, Bell, Sliders, Users, Database } from "lucide-react";
import { toast } from "sonner";

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

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("thresholds");

  const tabs = [
    { id: "thresholds", label: "Sensor Thresholds", icon: Sliders },
    { id: "alerts", label: "Alert Configuration", icon: Bell },
    { id: "models", label: "Model Parameters", icon: Database },
    { id: "users", label: "User Management", icon: Users },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold flex items-center gap-2"><SettingsIcon className="w-5 h-5 text-primary" /> Settings & Configuration</h2>
      <p className="text-xs text-muted-foreground -mt-3">System configuration, thresholds, alert rules, and model parameters</p>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-border pb-0">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-[1px] ${activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === "thresholds" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Sensor Alarm Thresholds</h3>
            <button onClick={() => toast.success("Thresholds saved")} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
              <Save className="w-3 h-3" /> Save Changes
            </button>
          </div>
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
                  <td className="py-2 px-3 text-right"><input defaultValue={t.high} className="w-20 text-right px-3 py-1 rounded border border-border bg-background text-foreground tabular type-body-sm" /></td>
                  <td className="py-2 px-3 text-right"><input defaultValue={t.highHigh} className="w-20 text-right px-3 py-1 rounded border border-destructive/30 bg-destructive/5 text-foreground tabular type-body-sm" /></td>
                  <td className="py-2 px-3 text-tertiary">{t.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeTab === "alerts" && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <h3 className="text-sm font-semibold">Alert Routing Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { severity: "Critical (P1)", route: "SMS + Email + Dashboard + Siren", delay: "0 sec" },
              { severity: "High (P2)", route: "Email + Dashboard", delay: "30 sec" },
              { severity: "Warning (P3)", route: "Dashboard only", delay: "5 min" },
              { severity: "Info (P4)", route: "Log only", delay: "15 min" },
            ].map(a => (
              <div key={a.severity} className="rounded-lg border border-border p-3">
                <p className="text-xs font-bold">{a.severity}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Route: {a.route}</p>
                <p className="text-[10px] text-muted-foreground">Suppression delay: {a.delay}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "models" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">AI/ML Model Parameters</h3>
          </div>
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
                  <td className="py-2 px-3 tabular font-bold whitespace-nowrap">{p.value}</td>
                  <td className="py-2 px-3 text-tertiary">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">User Roles & Access</h3>
          </div>
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
        </div>
      )}
    </div>
  );
};

export default SettingsPage;

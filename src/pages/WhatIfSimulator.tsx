import { useState, useMemo } from "react";
import { Beaker, ArrowRight, RotateCcw } from "lucide-react";
import type { Equipment } from "@/hooks/usePlantData";

interface ScenarioConfig {
  pmFrequency: number;
  predictiveOnly: boolean;
  airPressure: number;
  startupShift: number;
  throughput: number;
  failureTag: string;
}

interface Props {
  equipment: Equipment[];
}

const DEFAULT_CONFIG: ScenarioConfig = {
  pmFrequency: 0,
  predictiveOnly: false,
  airPressure: 8.5,
  startupShift: 0,
  throughput: 100,
  failureTag: "",
};

const WhatIfSimulator = ({ equipment }: Props) => {
  const [config, setConfig] = useState<ScenarioConfig>({ ...DEFAULT_CONFIG });
  const [savedScenarios, setSavedScenarios] = useState<{ name: string; config: ScenarioConfig }[]>([]);

  const results = useMemo(() => {
    const baseline = {
      failures: 12, downtime: 420, maintenanceCost: 976, energyCost: 4200, oee: 79.2, emissions: 48.2,
    };

    const pmFactor = 1 + config.pmFrequency / 100;
    const predFactor = config.predictiveOnly ? 0.6 : 1;
    const airFactor = (config.airPressure - 8.5) * -12;
    const throughputFactor = config.throughput / 100;
    const failurePenalty = config.failureTag ? 180 : 0;

    const scenario = {
      failures: Math.max(0, Math.round(baseline.failures * predFactor / pmFactor + (config.failureTag ? 1 : 0))),
      downtime: Math.max(0, Math.round(baseline.downtime * predFactor / pmFactor + failurePenalty)),
      maintenanceCost: Math.round(baseline.maintenanceCost * pmFactor * predFactor * 0.9),
      energyCost: Math.round(baseline.energyCost * throughputFactor + airFactor),
      oee: Math.min(100, Math.round((baseline.oee * pmFactor * (config.predictiveOnly ? 1.08 : 1) - (config.failureTag ? 8 : 0)) * 10) / 10),
      emissions: Math.round((baseline.emissions * throughputFactor + airFactor * 0.01) * 10) / 10,
    };

    const net = (baseline.maintenanceCost + baseline.energyCost) - (scenario.maintenanceCost + scenario.energyCost);

    return { baseline, scenario, net };
  }, [config]);

  const saveScenario = () => {
    const name = `Scenario ${savedScenarios.length + 1}`;
    setSavedScenarios([...savedScenarios, { name, config: { ...config } }]);
  };

  const metrics = [
    { label: "Predicted Failures (90d)", baseVal: results.baseline.failures, scenVal: results.scenario.failures, unit: "" },
    { label: "Unplanned Downtime", baseVal: results.baseline.downtime, scenVal: results.scenario.downtime, unit: " hr/yr" },
    { label: "Maintenance Cost", baseVal: results.baseline.maintenanceCost, scenVal: results.scenario.maintenanceCost, unit: "₹", prefix: true, suffix: "L" },
    { label: "Energy Cost", baseVal: results.baseline.energyCost, scenVal: results.scenario.energyCost, unit: "₹", prefix: true, suffix: "L" },
    { label: "OEE", baseVal: results.baseline.oee, scenVal: results.scenario.oee, unit: "%" },
    { label: "Carbon Emissions", baseVal: results.baseline.emissions, scenVal: results.scenario.emissions, unit: "k T CO₂e" },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <h2 className="text-lg font-bold flex items-center gap-2"><Beaker className="w-5 h-5 text-primary" /> What-If Simulator</h2>
      <p className="text-xs text-muted-foreground -mt-3">Model operational scenarios and compare impact against current baseline</p>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
        {/* Controls */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Scenario Builder</h3>
            <button onClick={() => setConfig({ ...DEFAULT_CONFIG })} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="p-4 space-y-4">
            {/* PM Frequency */}
            <div>
              <label className="text-[10px] text-muted-foreground">PM Frequency Change: {config.pmFrequency > 0 ? "+" : ""}{config.pmFrequency}%</label>
              <input type="range" min={-50} max={100} value={config.pmFrequency} onChange={e => setConfig(c => ({ ...c, pmFrequency: +e.target.value }))}
                className="w-full h-1 mt-1 rounded-full appearance-none bg-border accent-primary" />
              <div className="flex justify-between text-[9px] text-muted-foreground"><span>−50%</span><span>Current</span><span>+100%</span></div>
            </div>

            {/* Predictive Only */}
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-muted-foreground">Predictive-Only Maintenance</label>
              <button onClick={() => setConfig(c => ({ ...c, predictiveOnly: !c.predictiveOnly }))}
                className={`w-10 h-5 rounded-full transition-colors ${config.predictiveOnly ? "bg-primary" : "bg-border"}`}>
                <div className={`w-4 h-4 rounded-full bg-foreground transition-transform ${config.predictiveOnly ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>

            {/* Air Pressure */}
            <div>
              <label className="text-[10px] text-muted-foreground">Compressed Air Setpoint: {config.airPressure} bar</label>
              <input type="range" min={6} max={10} step={0.1} value={config.airPressure} onChange={e => setConfig(c => ({ ...c, airPressure: +e.target.value }))}
                className="w-full h-1 mt-1 rounded-full appearance-none bg-border accent-primary" />
            </div>

            {/* Startup Shift */}
            <div>
              <label className="text-[10px] text-muted-foreground">Comp B Startup Shift: {config.startupShift} hr</label>
              <input type="range" min={-4} max={4} value={config.startupShift} onChange={e => setConfig(c => ({ ...c, startupShift: +e.target.value }))}
                className="w-full h-1 mt-1 rounded-full appearance-none bg-border accent-primary" />
            </div>

            {/* Throughput */}
            <div>
              <label className="text-[10px] text-muted-foreground">Operating Throughput: {config.throughput}%</label>
              <input type="range" min={60} max={110} value={config.throughput} onChange={e => setConfig(c => ({ ...c, throughput: +e.target.value }))}
                className="w-full h-1 mt-1 rounded-full appearance-none bg-border accent-primary" />
            </div>

            {/* Failure Sim */}
            <div>
              <label className="text-[10px] text-muted-foreground">Simulate Equipment Failure</label>
              <select value={config.failureTag} onChange={e => setConfig(c => ({ ...c, failureTag: e.target.value }))}
                className="w-full mt-1 text-xs px-2 py-1.5 rounded-lg border border-border bg-card text-foreground">
                <option value="">None</option>
                {equipment.filter(e => e.criticalityTier !== "Non-critical").slice(0, 10).map(e => (
                  <option key={e.id} value={e.tag}>{e.tag} — {e.name}</option>
                ))}
              </select>
            </div>

            <button onClick={saveScenario}
              className="w-full py-2 rounded-lg bg-primary/10 text-primary font-medium text-xs hover:bg-primary/20 transition-colors">
              Save Scenario
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold">Current State vs. Scenario</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground bg-muted/30">
                    <th className="text-left py-2 px-4 font-medium">Metric</th>
                    <th className="text-right py-2 px-4 font-medium">Current</th>
                    <th className="text-right py-2 px-4 font-medium">Scenario</th>
                    <th className="text-right py-2 px-4 font-medium">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map(m => {
                    const delta = m.scenVal - m.baseVal;
                    const isGood = m.label === "OEE" ? delta > 0 : delta < 0;
                    return (
                      <tr key={m.label} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-2.5 px-4 font-medium">{m.label}</td>
                        <td className="py-2.5 px-4 text-right font-mono">{m.prefix ? "₹" : ""}{m.baseVal}{m.suffix || m.unit}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-bold">{m.prefix ? "₹" : ""}{m.scenVal}{m.suffix || m.unit}</td>
                        <td className={`py-2.5 px-4 text-right font-mono font-bold ${isGood ? "text-operational" : delta === 0 ? "text-muted-foreground" : "text-destructive"}`}>
                          {delta > 0 ? "+" : ""}{m.prefix ? "₹" : ""}{Math.round(delta * 10) / 10}{m.suffix || m.unit}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className={`px-4 py-3 border-t border-border text-center ${results.net > 0 ? "bg-operational/5" : results.net < 0 ? "bg-destructive/5" : ""}`}>
              <p className="text-[9px] text-muted-foreground">Net Financial Impact (Annual)</p>
              <p className={`text-xl font-bold font-mono ${results.net > 0 ? "text-operational" : results.net < 0 ? "text-destructive" : ""}`}>
                {results.net > 0 ? "+" : ""}₹{results.net}L/yr
              </p>
            </div>
          </div>

          {/* Saved Scenarios */}
          {savedScenarios.length > 0 && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold">Saved Scenarios ({savedScenarios.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {savedScenarios.map((s, i) => (
                  <div key={i} className="px-4 py-2 flex items-center justify-between hover:bg-muted/20 cursor-pointer" onClick={() => setConfig({ ...s.config })}>
                    <span className="text-xs font-medium">{s.name}</span>
                    <span className="text-[10px] text-primary">Load →</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;

import { useState, useMemo } from "react";
import { Icon } from "@/components/ui/Icon";
import { icons, iconSize, kpi } from "@/lib/icons";
import type { Equipment } from "@/hooks/usePlantData";
import PageHeader from "@/components/layout/PageHeader";
import { Panel, PillSelect, Unit, Slider } from "@/components/ui/primitives";
import { activatable, activatableFocus } from "@/lib/a11y";
import { predictedFailureCounts } from "@/lib/plantStats";
import { formatRupees } from "@/lib/format";

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
      // Machines predicted to fail in the next 90 days: the same rule as the Dashboard's predicted-failures tile.
      failures: predictedFailureCounts(equipment).within90, downtime: 420, maintenanceCost: 976, energyCost: 4200, oee: 79.2, emissions: 48.2,
    };

    const pmFactor = 1 + config.pmFrequency / 100;
    const predFactor = config.predictiveOnly ? 0.6 : 1;
    const airFactor = (config.airPressure - 8.5) * -12;
    const throughputFactor = config.throughput / 100;
    const failurePenalty = config.failureTag ? 180 : 0;

    const scenario = {
      failures: Math.max(0, Math.round(baseline.failures * predFactor / pmFactor + (config.failureTag ? 1 : 0))),
      downtime: Math.max(0, Math.round(baseline.downtime * predFactor / pmFactor + failurePenalty)),
      maintenanceCost: Math.round(baseline.maintenanceCost * pmFactor * predFactor),
      energyCost: Math.round(baseline.energyCost * throughputFactor + airFactor),
      oee: Math.min(100, Math.round((baseline.oee * pmFactor * (config.predictiveOnly ? 1.08 : 1) - (config.failureTag ? 8 : 0)) * 10) / 10),
      emissions: Math.round((baseline.emissions * throughputFactor + airFactor * 0.01) * 10) / 10,
    };

    const net = (baseline.maintenanceCost + baseline.energyCost) - (scenario.maintenanceCost + scenario.energyCost);

    return { baseline, scenario, net };
  }, [config, equipment]);

  const saveScenario = () => {
    const name = `Scenario ${savedScenarios.length + 1}`;
    setSavedScenarios([...savedScenarios, { name, config: { ...config } }]);
  };

  const metrics = [
    { label: "Predicted failures (90d)", baseVal: results.baseline.failures, scenVal: results.scenario.failures, unit: "" },
    { label: "Unplanned downtime", icon: kpi.downtime, baseVal: results.baseline.downtime, scenVal: results.scenario.downtime, unit: " hr/yr" },
    { label: "Maintenance cost", baseVal: results.baseline.maintenanceCost, scenVal: results.scenario.maintenanceCost, unit: "₹", prefix: true, suffix: "L" },
    { label: "Energy cost", baseVal: results.baseline.energyCost, scenVal: results.scenario.energyCost, unit: "₹", prefix: true, suffix: "L" },
    { label: "OEE", baseVal: results.baseline.oee, scenVal: results.scenario.oee, unit: "%" },
    { label: "Carbon emissions", baseVal: results.baseline.emissions, scenVal: results.scenario.emissions, unit: " kT CO₂e" },
  ];

  return (
    <PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
        {/* Controls */}
        <Panel title="Scenario Builder" padded={false}
          action={
            <button onClick={() => setConfig({ ...DEFAULT_CONFIG })} className="type-caption inline-flex items-center gap-1 rounded-full text-quaternary outline-none transition-colors duration-[180ms] hover:text-foreground focus-visible:ring-2 focus-visible:ring-active">
              <Icon name={icons.reset} size={iconSize.button} /> Reset
            </button>
          }>
          <div className="p-4 space-y-4">
            {/* PM Frequency */}
            <div>
              <label htmlFor="whatif-pm-frequency" className="type-label-sm text-secondary-foreground">PM frequency change: {config.pmFrequency > 0 ? "+" : ""}{config.pmFrequency}%</label>
              <Slider id="whatif-pm-frequency" className="mt-2" min={-50} max={100} value={config.pmFrequency} onChange={e => setConfig(c => ({ ...c, pmFrequency: +e.target.value }))} />
              <div className="flex justify-between type-caption text-tertiary"><span>−50%</span><span>Current</span><span>+100%</span></div>
            </div>

            {/* Predictive Only */}
            <div className="flex items-center justify-between">
              <label htmlFor="whatif-predictive-only" className="type-label-sm text-secondary-foreground">Predictive-only maintenance</label>
              <button id="whatif-predictive-only" onClick={() => setConfig(c => ({ ...c, predictiveOnly: !c.predictiveOnly }))}
                role="switch"
                aria-checked={config.predictiveOnly}
                className={`relative h-5 w-9 shrink-0 rounded-full border border-hairline outline-none transition-colors duration-[180ms] focus-visible:ring-2 focus-visible:ring-active ${config.predictiveOnly ? "bg-action-primary" : "bg-raised-2"}`}>
                <span className={`absolute left-0.5 top-0.5 size-3.5 rounded-full bg-container transition-transform duration-[180ms] ${config.predictiveOnly ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Air Pressure */}
            <div>
              <label htmlFor="whatif-air-pressure" className="type-label-sm text-secondary-foreground">Compressed air setpoint: {config.airPressure} bar</label>
              <Slider id="whatif-air-pressure" className="mt-2" min={6} max={10} step={0.1} value={config.airPressure} onChange={e => setConfig(c => ({ ...c, airPressure: +e.target.value }))} />
            </div>

            {/* Startup Shift */}
            <div>
              <label htmlFor="whatif-startup-shift" className="type-label-sm text-secondary-foreground">Compressor B startup shift: {config.startupShift} hr</label>
              <Slider id="whatif-startup-shift" className="mt-2" min={-4} max={4} value={config.startupShift} onChange={e => setConfig(c => ({ ...c, startupShift: +e.target.value }))} />
            </div>

            {/* Throughput */}
            <div>
              <label htmlFor="whatif-throughput" className="type-label-sm text-secondary-foreground">Operating throughput: {config.throughput}%</label>
              <Slider id="whatif-throughput" className="mt-2" min={60} max={110} value={config.throughput} onChange={e => setConfig(c => ({ ...c, throughput: +e.target.value }))} />
            </div>

            {/* Failure Sim */}
            <div>
              <label htmlFor="whatif-failure-tag" className="type-label-sm text-secondary-foreground">Simulate equipment failure</label>
              <PillSelect id="whatif-failure-tag" value={config.failureTag} onChange={e => setConfig(c => ({ ...c, failureTag: e.target.value }))}
                wrapperClassName="mt-1 w-full" className="w-full">
                <option value="">None</option>
                {equipment.filter(e => e.criticalityTier !== "Non-critical").slice(0, 10).map(e => (
                  <option key={e.id} value={e.tag}>{e.tag} · {e.name}</option>
                ))}
              </PillSelect>
            </div>

            <button onClick={saveScenario}
              className="type-label-sm h-8 w-full rounded-full border border-hairline bg-action text-secondary-foreground outline-none transition-colors duration-[180ms] hover:border-strong hover:bg-raised-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-active">
              <span className="inline-flex items-center justify-center gap-1.5">
                <Icon name={icons.save} size={iconSize.button} />
                Save scenario
              </span>
            </button>
          </div>
        </Panel>

        {/* Results */}
        <div className="space-y-4">
          <Panel title="Current State vs. Scenario" padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full type-body-sm">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-left text-quaternary">Metric</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Current</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Scenario</th>
                    <th className="type-eyebrow whitespace-nowrap px-3 py-2 text-right text-quaternary">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map(m => {
                    const delta = m.scenVal - m.baseVal;
                    const isGood = m.label === "OEE" ? delta > 0 : delta < 0;
                    return (
                      <tr key={m.label} className="border-b border-hairline hover:bg-raised">
                        <td className="py-2.5 px-3 font-medium">{m.label}</td>
                        <td className="py-2.5 px-3 text-right tabular whitespace-nowrap">{m.prefix ? formatRupees(m.baseVal) : `${m.baseVal}${m.unit}`}</td>
                        <td className="py-2.5 px-3 text-right tabular font-semibold whitespace-nowrap">{m.prefix ? formatRupees(m.scenVal) : `${m.scenVal}${m.unit}`}</td>
                        <td className={`py-2.5 px-3 text-right tabular font-semibold ${isGood ? "text-success" : delta === 0 ? "text-tertiary" : "text-error"}`}>
                          {m.prefix ? formatRupees(delta, { signed: true }) : `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${Math.abs(Math.round(delta * 10) / 10)}${m.unit}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-hairline bg-raised px-4 py-3 text-center">
              <p className="type-eyebrow text-quaternary">Net financial impact (annual)</p>
              <p className={`type-display-xl tabular mt-1 ${results.net > 0 ? "text-success" : results.net < 0 ? "text-error" : "text-foreground"}`}>
                {formatRupees(results.net, { signed: true, per: "yr" })}
              </p>
            </div>
          </Panel>

          {/* Saved Scenarios */}
          {savedScenarios.length > 0 && (
            <Panel title={<>Saved Scenarios ({savedScenarios.length})</>} padded={false}>
              <div className="divide-y divide-border">
                {savedScenarios.map((s, i) => (
                  <div key={i} className={`px-4 py-2 flex items-center justify-between hover:bg-raised cursor-pointer ${activatableFocus}`} role="button" {...activatable(() => setConfig({ ...s.config }))}>
                    <span className="type-body-sm font-medium">{s.name}</span>
                    <span className="type-caption inline-flex items-center gap-0.5 text-foreground">Load <Icon name={icons.chevron} size={iconSize.chevron} className="-rotate-90" /></span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </PageHeader>
  );
};

export default WhatIfSimulator;

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { icons, iconForPath, kpi, emptyIcon, panelIcon } from "@/lib/icons";
import { usePlantData } from "@/hooks/usePlantData";
import FactoryFloor from "@/components/twin/FactoryFloor";
import EquipmentDetail from "@/components/twin/EquipmentDetail";
import OEEDashboard from "@/components/twin/OEEDashboard";
import EquipmentHeatMap from "@/components/dashboard/EquipmentHeatMap";
import MaintenanceTimeline from "@/components/dashboard/MaintenanceTimeline";
import PlantHealthTrend from "@/components/dashboard/PlantHealthTrend";
import AlarmFrequencyChart from "@/components/dashboard/AlarmFrequencyChart";
import PageHeader from "@/components/layout/PageHeader";
import { EmptyState, KpiGrid, KpiTile, Panel, StatusDot } from "@/components/ui/primitives";
import { severityTone, toneOf } from "@/lib/status";
import { useNavigate } from "react-router-dom";
import { handoverReadiness, predictedFailureCounts } from "@/lib/plantStats";
import { activatable, activatableFocus } from "@/lib/a11y";

interface DashboardProps {
  data: ReturnType<typeof usePlantData>;
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string | null) => void;
}

const pill =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-hairline bg-action px-3 type-label-sm text-secondary-foreground outline-none transition-colors duration-[180ms] hover:border-strong hover:bg-raised-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-active";

const Dashboard = ({ data, selectedEquipmentId, onSelectEquipment }: DashboardProps) => {
  const navigate = useNavigate();
  const { equipment, alerts, oee, acknowledgeAlert, maintenanceEvents, plantInfo } = data;
  const selectedEquipment = equipment.find((e) => e.id === selectedEquipmentId);

  const avgHealth = useMemo(() =>
    Math.round(equipment.reduce((acc, e) => acc + e.health, 0) / equipment.length * 10) / 10,
    [equipment]
  );

  const criticalAlarms = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;
  const { within30: predictedFailures, within90: flaggedComponents } = predictedFailureCounts(equipment);
  const handoverPct = handoverReadiness(data.handoverData);

  // Values keep a status colour only when the old card did and the state needs attention.
  const kpis = [
    {
      label: "Overall Plant Health", icon: kpi.health, value: avgHealth.toString(), unit: "%",
      delta: "-2.1%", hint: "vs last month", tone: "error" as const,
      valueClassName: avgHealth >= 90 ? "" : "text-warning",
    },
    {
      label: "Active Critical Alarms", icon: kpi.critical, value: criticalAlarms.toString(),
      delta: "+3", hint: "vs yesterday", tone: "error" as const,
      valueClassName: criticalAlarms > 0 ? "text-error" : "",
    },
    {
      label: "Predicted Failures (30d)", icon: kpi.failures, value: predictedFailures.toString(),
      hint: `${flaggedComponents} components flagged in 90 days`,
    },
    {
      label: "Energy Efficiency Index", icon: kpi.efficiency, value: "82.1", unit: "%",
      hint: "₹14.2L annual savings opportunity",
    },
    {
      label: "Handover Readiness", icon: kpi.handover, value: handoverPct.toString(), unit: "%",
      hint: "Ratnagiri LNG Phase 2",
      valueClassName: handoverPct >= 90 ? "" : "text-warning",
    },
  ];

  const topAlerts = alerts.filter(a => !a.acknowledged).slice(0, 5);

  const quickActions = [
    { label: "Review active alarms", path: "/alarms", icon: iconForPath("/alarms") },
    { label: "Run maintenance scenario", path: "/simulator", icon: iconForPath("/simulator") },
    { label: "Check handover status", path: "/handover", icon: iconForPath("/handover") },
    { label: "Energy optimisation", path: "/energy", icon: iconForPath("/energy") },
  ];

  return (
    <PageHeader
      actions={quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <button key={action.path} onClick={() => navigate(action.path)} className={pill}>
            <Icon className="size-[13px]" aria-hidden />
            {action.label}
          </button>
        );
      })}
    >
      {/* KPI row */}
      <KpiGrid>
        {kpis.map((kpi) => (
          <KpiTile key={kpi.label} {...kpi} />
        ))}
      </KpiGrid>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PlantHealthTrend />
        <AlarmFrequencyChart />
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_340px]">
        <EquipmentHeatMap equipment={equipment} onSelect={onSelectEquipment} />

        <Panel
          title="Top Active Alerts"
          icon={panelIcon.alerts}
          padded={false}
          action={
            <button
              onClick={() => navigate("/alarms")}
              className="type-caption inline-flex items-center gap-0.5 rounded-full text-quaternary outline-none transition-colors duration-[180ms] hover:text-foreground focus-visible:ring-2 focus-visible:ring-active"
            >
              View all <icons.chevronRight className="size-3" aria-hidden />
            </button>
          }
        >
          {topAlerts.length === 0 ? (
            <EmptyState icon={emptyIcon.noAlerts} title="No active alerts" />
          ) : (
            <div>
              {topAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`cursor-pointer border-b border-hairline px-4 py-2.5 transition-colors duration-150 last:border-0 hover:bg-raised ${activatableFocus}`}
                  role="button" {...activatable(() => onSelectEquipment(alert.equipmentId))}
                >
                  <div className="flex items-start gap-2">
                    <StatusDot tone={toneOf(severityTone, alert.severity)} className="mt-1.5" />
                    <span className="sr-only">{alert.severity}</span>
                    <div className="min-w-0 flex-1">
                      <p className="type-body-sm truncate text-secondary-foreground">
                        <span className="tabular font-medium text-foreground">{alert.equipmentTag}</span> {alert.message}
                      </p>
                      <p className="type-caption mt-0.5 text-quaternary">{alert.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <AnimatePresence mode="wait">
          {selectedEquipment ? (
            <EquipmentDetail
              key={selectedEquipment.id}
              equipment={selectedEquipment}
              onClose={() => onSelectEquipment(null)}
            />
          ) : (
            <Panel>
              <EmptyState icon={emptyIcon.select} title="Select equipment from the heat map or alerts to view details" />
            </Panel>
          )}
        </AnimatePresence>
      </div>

      <MaintenanceTimeline events={maintenanceEvents} />

      <OEEDashboard oee={oee} />
    </PageHeader>
  );
};

export default Dashboard;

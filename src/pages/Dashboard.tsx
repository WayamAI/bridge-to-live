import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { TrendingDown, TrendingUp, AlertTriangle, Calendar, ArrowRight, Zap, Activity, Shield, Clock, FileCheck } from "lucide-react";
import { usePlantData } from "@/hooks/usePlantData";
import FactoryFloor from "@/components/twin/FactoryFloor";
import EquipmentDetail from "@/components/twin/EquipmentDetail";
import OEEDashboard from "@/components/twin/OEEDashboard";
import EquipmentHeatMap from "@/components/dashboard/EquipmentHeatMap";
import MaintenanceTimeline from "@/components/dashboard/MaintenanceTimeline";
import PlantHealthTrend from "@/components/dashboard/PlantHealthTrend";
import AlarmFrequencyChart from "@/components/dashboard/AlarmFrequencyChart";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  data: ReturnType<typeof usePlantData>;
  selectedEquipmentId: string | null;
  onSelectEquipment: (id: string | null) => void;
}

const Dashboard = ({ data, selectedEquipmentId, onSelectEquipment }: DashboardProps) => {
  const navigate = useNavigate();
  const { equipment, alerts, oee, acknowledgeAlert, maintenanceEvents, plantInfo } = data;
  const selectedEquipment = equipment.find((e) => e.id === selectedEquipmentId);

  const avgHealth = useMemo(() =>
    Math.round(equipment.reduce((acc, e) => acc + e.health, 0) / equipment.length * 10) / 10,
    [equipment]
  );

  const criticalAlarms = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length;
  const predictedFailures = equipment.filter(e => e.predictedFailure && e.predictedFailure > new Date() && e.predictedFailure < new Date(Date.now() + 30 * 86400000)).length;
  const handoverPct = 73;

  const kpis = [
    {
      label: "Overall Plant Health", value: `${avgHealth}%`,
      trend: "↓ 2.1% vs. last month", trendDir: "down" as const,
      color: avgHealth >= 90 ? "text-operational" : "text-gap",
      bgColor: avgHealth >= 90 ? "bg-operational/5 border-operational/20" : "bg-gap/5 border-gap/20",
    },
    {
      label: "Active Critical Alarms", value: criticalAlarms.toString(),
      trend: "+3 vs. yesterday", trendDir: "up" as const,
      color: criticalAlarms > 0 ? "text-destructive" : "text-operational",
      bgColor: criticalAlarms > 0 ? "bg-destructive/5 border-destructive/20" : "bg-operational/5 border-operational/20",
    },
    {
      label: "Predicted Failures (30d)", value: predictedFailures.toString(),
      trend: "12 components flagged", trendDir: "neutral" as const,
      color: "text-gap",
      bgColor: "bg-gap/5 border-gap/20",
    },
    {
      label: "Energy Efficiency Index", value: "82.1%",
      trend: "₹14.2L annual savings opp.", trendDir: "neutral" as const,
      color: "text-gap",
      bgColor: "bg-gap/5 border-gap/20",
    },
    {
      label: "Handover Readiness", value: `${handoverPct}%`,
      trend: "Ratnagiri LNG Phase 2", trendDir: "neutral" as const,
      color: handoverPct >= 90 ? "text-operational" : "text-gap",
      bgColor: handoverPct >= 90 ? "bg-operational/5 border-operational/20" : "bg-gap/5 border-gap/20",
    },
  ];

  const topAlerts = alerts.filter(a => !a.acknowledged).slice(0, 5);

  const quickActions = [
    { label: "Review active alarms", path: "/alarms", icon: AlertTriangle },
    { label: "Run maintenance scenario", path: "/simulator", icon: Calendar },
    { label: "Check handover status", path: "/handover", icon: FileCheck },
    { label: "Energy optimisation", path: "/energy", icon: Zap },
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`rounded-xl border p-3 ${kpi.bgColor}`}>
            <p className="text-[10px] text-muted-foreground font-medium mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold font-mono ${kpi.color}`}>{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trendDir === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
              {kpi.trendDir === "up" && <TrendingUp className="w-3 h-3 text-destructive" />}
              <span className="text-[9px] text-muted-foreground">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlantHealthTrend />
        <AlarmFrequencyChart />
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_340px] gap-4">
        {/* Equipment Heat Map */}
        <EquipmentHeatMap equipment={equipment} onSelect={onSelectEquipment} />

        {/* Top Active Alerts */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">Top Active Alerts</h3>
            <button onClick={() => navigate("/alarms")} className="text-[10px] text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {topAlerts.map((alert) => (
              <div key={alert.id} className="px-4 py-2.5 hover:bg-muted/20 cursor-pointer" onClick={() => onSelectEquipment(alert.equipmentId)}>
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    alert.severity === "critical" ? "bg-destructive" : "bg-gap"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate">
                      <span className="font-mono text-primary">{alert.equipmentTag}</span> {alert.message}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{alert.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Detail */}
        <AnimatePresence mode="wait">
          {selectedEquipment ? (
            <EquipmentDetail
              key={selectedEquipment.id}
              equipment={selectedEquipment}
              onClose={() => onSelectEquipment(null)}
            />
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center">
              <Activity className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground">Select equipment from the heat map or alerts to view details</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Maintenance Timeline */}
      <MaintenanceTimeline events={maintenanceEvents} />

      {/* OEE + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
        <OEEDashboard oee={oee} />
        <div className="flex flex-wrap items-center gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors text-xs font-medium"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

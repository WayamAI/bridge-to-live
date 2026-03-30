import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePlantData } from "@/hooks/usePlantData";
import type { UserRole } from "@/hooks/usePlantData";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import EquipmentHealthPage from "@/pages/EquipmentHealth";
import AlarmManagementPage from "@/pages/AlarmManagement";
import EnergyPage from "@/pages/EnergyIntelligence";
import HandoverPage from "@/pages/HandoverTracker";
import FailureAnalysis from "@/pages/FailureAnalysis";
import RemainingUsefulLife from "@/pages/RemainingUsefulLife";
import PredictiveMaintenance from "@/pages/PredictiveMaintenance";
import WorkOrders from "@/pages/WorkOrders";
import MaintenanceCost from "@/pages/MaintenanceCost";
import LoadOptimisation from "@/pages/LoadOptimisation";
import Sustainability from "@/pages/Sustainability";
import AlarmAnalytics from "@/pages/AlarmAnalytics";
import AlarmRationalisation from "@/pages/AlarmRationalisation";
import OTAssetRegistry from "@/pages/OTAssetRegistry";
import ThreatMonitor from "@/pages/ThreatMonitor";
import NetworkSegmentation from "@/pages/NetworkSegmentation";
import ComplianceDashboard from "@/pages/ComplianceDashboard";
import TwinSync from "@/pages/TwinSync";
import DataCompleteness from "@/pages/DataCompleteness";
import ISOValidator from "@/pages/ISOValidator";
import WhatIfSimulator from "@/pages/WhatIfSimulator";
import DataQuality from "@/pages/DataQuality";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppInner = () => {
  const data = usePlantData();
  const [userRole, setUserRole] = useState<UserRole>("plant_director");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  return (
    <Routes>
      <Route element={<AppLayout alerts={data.alerts} userRole={userRole} onRoleChange={setUserRole} />}>
        <Route path="/" element={<Dashboard data={data} selectedEquipmentId={selectedEquipmentId} onSelectEquipment={setSelectedEquipmentId} />} />
        <Route path="/equipment" element={<EquipmentHealthPage equipment={data.equipment} selectedEquipmentId={selectedEquipmentId} onSelectEquipment={setSelectedEquipmentId} />} />
        <Route path="/equipment/detail" element={<EquipmentHealthPage equipment={data.equipment} selectedEquipmentId={selectedEquipmentId} onSelectEquipment={setSelectedEquipmentId} />} />
        <Route path="/alarms" element={<AlarmManagementPage alerts={data.alerts} onAcknowledge={data.acknowledgeAlert} onSelectEquipment={setSelectedEquipmentId} />} />
        <Route path="/energy" element={<EnergyPage energyMetrics={data.energyMetrics} />} />
        <Route path="/handover" element={<HandoverPage handoverData={data.handoverData} connectedSystems={data.connectedSystems} plantInfo={data.plantInfo} />} />
        <Route path="/failure-analysis" element={<FailureAnalysis equipment={data.equipment} />} />
        <Route path="/rul" element={<RemainingUsefulLife equipment={data.equipment} />} />
        <Route path="/predictive-maintenance" element={<PredictiveMaintenance equipment={data.equipment} />} />
        <Route path="/work-orders" element={<WorkOrders />} />
        <Route path="/maintenance-cost" element={<MaintenanceCost />} />
        <Route path="/load-optimisation" element={<LoadOptimisation />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/alarm-analytics" element={<AlarmAnalytics alerts={data.alerts} />} />
        <Route path="/alarm-rationalisation" element={<AlarmRationalisation />} />
        <Route path="/ot-assets" element={<OTAssetRegistry />} />
        <Route path="/threat-monitor" element={<ThreatMonitor />} />
        <Route path="/network" element={<NetworkSegmentation />} />
        <Route path="/compliance" element={<ComplianceDashboard />} />
        <Route path="/twin-sync" element={<TwinSync />} />
        <Route path="/data-completeness" element={<DataCompleteness />} />
        <Route path="/iso-validator" element={<ISOValidator />} />
        <Route path="/simulator" element={<WhatIfSimulator equipment={data.equipment} />} />
        <Route path="/data-sources" element={<HandoverPage handoverData={data.handoverData} connectedSystems={data.connectedSystems} plantInfo={data.plantInfo} />} />
        <Route path="/data-quality" element={<DataQuality />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

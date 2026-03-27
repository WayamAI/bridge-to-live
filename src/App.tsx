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
import PlaceholderPage from "@/pages/PlaceholderPage";
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
        <Route path="/failure-analysis" element={<PlaceholderPage title="Failure Analysis" />} />
        <Route path="/rul" element={<PlaceholderPage title="Remaining Useful Life (RUL)" />} />
        <Route path="/predictive-maintenance" element={<PlaceholderPage title="Predictive Maintenance" />} />
        <Route path="/work-orders" element={<PlaceholderPage title="Work Order Integration" />} />
        <Route path="/maintenance-cost" element={<PlaceholderPage title="Maintenance Cost Tracker" />} />
        <Route path="/load-optimisation" element={<PlaceholderPage title="Load Optimisation" />} />
        <Route path="/sustainability" element={<PlaceholderPage title="Sustainability & Emissions" />} />
        <Route path="/alarm-analytics" element={<PlaceholderPage title="Alarm History & Analytics" />} />
        <Route path="/alarm-rationalisation" element={<PlaceholderPage title="Alarm Rationalisation" />} />
        <Route path="/ot-assets" element={<PlaceholderPage title="OT Asset Registry" />} />
        <Route path="/threat-monitor" element={<PlaceholderPage title="Threat Monitor" />} />
        <Route path="/network" element={<PlaceholderPage title="Network Segmentation Status" />} />
        <Route path="/compliance" element={<PlaceholderPage title="Compliance Dashboard" />} />
        <Route path="/twin-sync" element={<PlaceholderPage title="Engineering Twin Sync" />} />
        <Route path="/data-completeness" element={<PlaceholderPage title="Data Completeness Monitor" />} />
        <Route path="/iso-validator" element={<PlaceholderPage title="ISO 15926 / CFIHOS Validator" />} />
        <Route path="/simulator" element={<PlaceholderPage title="What-If Simulator" />} />
        <Route path="/data-sources" element={<HandoverPage handoverData={data.handoverData} connectedSystems={data.connectedSystems} plantInfo={data.plantInfo} />} />
        <Route path="/data-quality" element={<PlaceholderPage title="Data Quality Monitor" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings & Configuration" />} />
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

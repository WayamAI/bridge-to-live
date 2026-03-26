import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Activity, Radio } from "lucide-react";
import { useFactoryData } from "@/hooks/useFactoryData";
import FactoryFloor from "@/components/twin/FactoryFloor";
import EquipmentDetail from "@/components/twin/EquipmentDetail";
import AlertsPanel from "@/components/twin/AlertsPanel";
import OEEDashboard from "@/components/twin/OEEDashboard";
import KPICards from "@/components/twin/KPICards";
import EquipmentTable from "@/components/twin/EquipmentTable";

const Index = () => {
  const { equipment, alerts, oee, acknowledgeAlert } = useFactoryData();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const selectedEquipment = equipment.find((e) => e.id === selectedEquipmentId);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">TwinBridge</span>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Operational Twin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-operational">
              <Radio className="w-3 h-3 animate-pulse-glow" />
              LIVE
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 space-y-4">
        {/* KPIs */}
        <KPICards equipment={equipment} />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          {/* Left column */}
          <div className="space-y-4">
            {/* Factory floor */}
            <FactoryFloor
              equipment={equipment}
              selectedId={selectedEquipmentId}
              onSelect={setSelectedEquipmentId}
            />

            {/* OEE */}
            <OEEDashboard oee={oee} />

            {/* Equipment table */}
            <EquipmentTable
              equipment={equipment}
              selectedId={selectedEquipmentId}
              onSelect={setSelectedEquipmentId}
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Equipment detail */}
            <AnimatePresence mode="wait">
              {selectedEquipment && (
                <EquipmentDetail
                  key={selectedEquipment.id}
                  equipment={selectedEquipment}
                  onClose={() => setSelectedEquipmentId(null)}
                />
              )}
            </AnimatePresence>

            {/* Alerts */}
            <AlertsPanel
              alerts={alerts}
              onAcknowledge={acknowledgeAlert}
              onSelectEquipment={setSelectedEquipmentId}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

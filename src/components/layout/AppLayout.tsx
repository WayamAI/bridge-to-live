import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import type { Alert, UserRole } from "@/hooks/usePlantData";

interface AppLayoutProps {
  alerts: Alert[];
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  breadcrumb?: string;
}

const AppLayout = ({ alerts, userRole, onRoleChange, breadcrumb }: AppLayoutProps) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar alerts={alerts} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar userRole={userRole} onRoleChange={onRoleChange} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

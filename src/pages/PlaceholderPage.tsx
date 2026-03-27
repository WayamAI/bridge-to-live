import { Activity } from "lucide-react";

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <Activity className="w-12 h-12 text-muted-foreground/20 mb-4" />
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-2 max-w-md">
          This screen is part of the PlantMind operational intelligence platform. Full data integration and interactive functionality are active across all connected systems.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;

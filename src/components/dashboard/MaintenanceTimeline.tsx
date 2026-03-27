import type { MaintenanceEvent } from "@/hooks/usePlantData";
import { Wrench, Brain, FileWarning } from "lucide-react";

interface MaintenanceTimelineProps {
  events: MaintenanceEvent[];
}

const urgencyColors = {
  low: "border-muted-foreground/30 bg-muted/20",
  medium: "border-engineering/30 bg-engineering/5",
  high: "border-gap/30 bg-gap/5",
  critical: "border-destructive/30 bg-destructive/5",
};

const typeIcons = {
  "Planned PM": Wrench,
  "Predictive": Brain,
  "Warranty Expiry": FileWarning,
};

const MaintenanceTimeline = ({ events }: MaintenanceTimelineProps) => {
  const sorted = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  const now = Date.now();
  const sixtyDays = 60 * 86400000;
  const upcoming = sorted.filter(e => e.date.getTime() > now && e.date.getTime() < now + sixtyDays);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Upcoming Maintenance — Next 60 Days</h3>
        <span className="text-[10px] text-muted-foreground font-mono">{upcoming.length} events</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {upcoming.map((event) => {
          const Icon = typeIcons[event.type];
          const daysUntil = Math.ceil((event.date.getTime() - now) / 86400000);
          return (
            <div key={event.id} className={`shrink-0 w-52 rounded-lg border p-3 ${urgencyColors[event.urgency]}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className="w-3 h-3 text-muted-foreground" />
                <span className="text-[9px] font-mono text-muted-foreground uppercase">{event.type}</span>
                {event.probability && (
                  <span className="text-[9px] font-mono text-gap ml-auto">{event.probability}% prob</span>
                )}
              </div>
              <p className="text-[10px] font-medium font-mono text-primary">{event.equipmentTag}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{event.description}</p>
              <p className="text-[9px] font-mono mt-1.5 text-foreground">
                {event.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                <span className="text-muted-foreground ml-1">({daysUntil}d)</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenanceTimeline;

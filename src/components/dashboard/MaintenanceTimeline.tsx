import type { MaintenanceEvent } from "@/hooks/usePlantData";
import { Wrench, Brain, FileWarning } from "lucide-react";
import { EmptyState, Panel, StatusDot } from "@/components/ui/primitives";
import type { Tone } from "@/lib/status";
import { toneOf } from "@/lib/status";
import { formatDate } from "@/lib/format";

interface MaintenanceTimelineProps {
  events: MaintenanceEvent[];
}

// critical -> error, high -> warning, medium -> info, low -> neutral
const urgencyTone: Record<MaintenanceEvent["urgency"], Tone> = {
  low: "neutral",
  medium: "info",
  high: "warning",
  critical: "error",
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
    <Panel
      title="Upcoming Maintenance · Next 60 Days"
      action={<span className="type-caption tabular text-quaternary">{upcoming.length} events</span>}
    >
      {upcoming.length === 0 ? (
        <EmptyState title="No maintenance in the next 60 days" className="min-h-[96px]" />
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {upcoming.map((event) => {
            const Icon = typeIcons[event.type];
            const daysUntil = Math.ceil((event.date.getTime() - now) / 86400000);
            return (
              <div key={event.id} className="w-52 shrink-0 rounded-lg border border-hairline bg-raised p-3">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <StatusDot tone={toneOf(urgencyTone, event.urgency)} />
                  <span className="sr-only">{event.urgency} urgency</span>
                  <Icon className="size-3 text-quaternary" aria-hidden />
                  <span className="type-eyebrow truncate text-quaternary">{event.type}</span>
                  {event.probability && (
                    <span className="type-caption tabular ml-auto text-warning">{event.probability}% prob</span>
                  )}
                </div>
                <p className="type-label-sm tabular text-foreground">{event.equipmentTag}</p>
                <p className="type-body-sm mt-0.5 leading-snug text-tertiary">{event.description}</p>
                <p className="type-caption tabular mt-1.5 text-foreground">
                  {formatDate(event.date)}
                  <span className="ml-1 text-quaternary">({daysUntil}d)</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
};

export default MaintenanceTimeline;

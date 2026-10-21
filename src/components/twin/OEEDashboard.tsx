import type { OEEMetrics } from "@/hooks/usePlantData";
import { motion } from "framer-motion";
import { seriesColor } from "@/components/dashboard/chartTheme";
import { Panel, Unit } from "@/components/ui/primitives";
import { panelIcon } from "@/lib/icons";

interface OEEGaugeProps { label: string; value: number; color: string; }

const OEEGauge = ({ label, value, color }: OEEGaugeProps) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          {/* Track: the quaternary text colour at 40%, so the unfilled part reads as a full ring on white and on the dark panel. */}
          <circle cx="40" cy="40" r={radius} fill="none" style={{ stroke: "var(--text-quaternary)", strokeOpacity: 0.4 }} strokeWidth="5" />
          <motion.circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }} transition={{ duration: 1, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="type-display-base tabular text-foreground">{value}<Unit>%</Unit></span>
        </div>
      </div>
      <span className="type-caption mt-1 text-quaternary">{label}</span>
    </div>
  );
};

const OEEDashboard = ({ oee }: { oee: OEEMetrics }) => (
  <Panel title="Overall Equipment Effectiveness" icon={panelIcon.oee}>
    <div className="flex flex-wrap items-center justify-around gap-4">
      {/* The gauge colour is fixed per gauge (it does not change with the value), so it is a series colour, not a status. Overall OEE is a fourth gauge of the same kind. */}
      <OEEGauge label="Availability" value={oee.availability} color={seriesColor(0)} />
      <OEEGauge label="Performance" value={oee.performance} color={seriesColor(0)} />
      <OEEGauge label="Quality" value={oee.quality} color={seriesColor(0)} />
      <OEEGauge label="OEE" value={oee.overall} color={seriesColor(0)} />
    </div>
  </Panel>
);

export default OEEDashboard;

import type { OEEMetrics } from "@/hooks/usePlantData";
import { motion } from "framer-motion";
import { axisTick, chartTooltipStyle, chartTooltipLabelStyle, seriesColor } from "@/components/dashboard/chartTheme";

interface OEEGaugeProps { label: string; value: number; color: string; }

const OEEGauge = ({ label, value, color }: OEEGaugeProps) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" className="stroke-muted" strokeWidth="5" />
          <motion.circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }} transition={{ duration: 1, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold font-mono">{value}%</span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground mt-1">{label}</span>
    </div>
  );
};

const OEEDashboard = ({ oee }: { oee: OEEMetrics }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <h3 className="text-sm font-semibold mb-4">Overall Equipment Effectiveness</h3>
    <div className="flex items-center justify-around">
      <OEEGauge label="Availability" value={oee.availability} color={seriesColor(1)} />
      <OEEGauge label="Performance" value={oee.performance} color={seriesColor(0)} />
      <OEEGauge label="Quality" value={oee.quality} color={seriesColor(2)} />
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center glow-primary">
          <span className="text-xl font-bold font-mono text-primary">{oee.overall}%</span>
        </div>
        <span className="text-[10px] font-bold text-primary mt-1">OEE</span>
      </div>
    </div>
  </div>
);

export default OEEDashboard;

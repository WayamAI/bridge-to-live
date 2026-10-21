import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";
import { EmptyState } from "@/components/ui/primitives";
import { CHART_HEIGHT } from "./chartTheme";
import { emptyIcon } from "@/lib/icons";
import { wrapLabel } from "@/lib/chartLabels";

/**
 * Every chart sits in one of these: a fixed standard or tall height, an accessible name, and a readable empty state
 * instead of a blank plot when there is nothing to draw.
 */
export const ChartBox = ({
  height = "standard",
  empty = false,
  emptyTitle = "No data to chart",
  label,
  children,
}: {
  height?: keyof typeof CHART_HEIGHT;
  empty?: boolean;
  emptyTitle?: string;
  /** What the chart shows, read by screen readers. */
  label?: string;
  children: ReactElement;
}) => {
  const h = CHART_HEIGHT[height];
  if (empty) return <EmptyState icon={emptyIcon.nothing} title={emptyTitle} className="min-h-0" />;
  return (
    <div role={label ? "img" : undefined} aria-label={label} style={{ height: h }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
};

/** Y-axis tick for category labels: wraps instead of overlapping or being cut off. Recharts injects x, y and payload. */
export const CategoryTick = ({ x, y, payload, maxChars = 20 }: { x?: number; y?: number; payload?: { value: string }; maxChars?: number }) => {
  const lines = wrapLabel(String(payload?.value ?? ""), maxChars);
  return (
    <text x={x} y={y} textAnchor="end" fill="var(--text-quaternary)" fontSize={11}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? (lines.length > 1 ? "-0.2em" : "0.35em") : "1.15em"}>
          {l}
        </tspan>
      ))}
    </text>
  );
};

import type { CSSProperties } from "react";

export interface LegendItem {
  label: string;
  /** A CSS colour or variable, normally from seriesColor() or toneChart. */
  color: string;
  /** What the series looks like on the chart: a filled square, a solid line, a dashed line or a dotted line. */
  kind?: "square" | "line" | "dashed" | "dotted";
  /** Draw the swatch faded (a band or a forecast). */
  faded?: boolean;
}

const swatch = (kind: NonNullable<LegendItem["kind"]>, color: string, faded?: boolean): CSSProperties => {
  const opacity = faded ? 0.35 : 1;
  if (kind === "square") return { backgroundColor: color, opacity };
  if (kind === "line") return { backgroundColor: color, opacity };
  return { borderTop: `2px ${kind} ${color}`, opacity };
};

/** One legend for every chart: lists exactly the series that are drawn. */
const ChartLegend = ({ items }: { items: LegendItem[] }) => (
  <ul className="type-caption mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-quaternary">
    {items.map(({ label, color, kind = "square", faded }) => (
      <li key={label} className="flex items-center gap-1">
        <span
          aria-hidden
          className={kind === "square" ? "inline-block size-2 rounded-sm" : kind === "line" ? "inline-block h-0.5 w-3" : "inline-block w-3"}
          style={swatch(kind, color, faded)}
        />
        {label}
      </li>
    ))}
  </ul>
);

export default ChartLegend;

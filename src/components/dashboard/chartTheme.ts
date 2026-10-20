// Chronus chart styling constants (Wayam Chronus design system: charts).
// Always CSS variables, so charts follow the light/dark theme.

/** Series colour by position: blue, green, orange, red, grey, purple, then repeat. */
export const seriesColor = (index: number) => `var(--analytics-series-${(index % 6) + 1})`;

export const chartTooltipStyle = {
  background: "var(--surface-container)",
  border: "1px solid var(--stroke-muted)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--text-primary)",
};

export const chartTooltipLabelStyle = { color: "var(--text-primary)" };

/** Axis tick: 11px quaternary text, no axis line, no tick line (set on the axis). */
export const axisTick = { fill: "var(--text-quaternary)", fontSize: 11 };

/** The two chart heights. Standard for most charts; tall for the main chart of a page or a chart with many labels. */
export const CHART_HEIGHT = { standard: 220, tall: 280 } as const;

/** Axis title: same 11px quaternary text as the ticks, for units that are not obvious from the panel title. Give the X axis `height={AXIS_TITLE_HEIGHT}` so the title has its own row below the ticks. */
export const axisTitle = (value: string, angle?: number) => ({
  value,
  angle,
  position: angle ? ("insideLeft" as const) : ("insideBottom" as const),
  offset: angle ? undefined : 0,
  fill: "var(--text-quaternary)",
  fontSize: 11,
});

/** Tick density for a time axis: first and last label always, the rest only where they do not touch. */
export const timeAxisProps = { interval: "preserveStartEnd" as const, minTickGap: 40 };

/** Height of an X axis that carries a title (ticks above, title below). */
export const AXIS_TITLE_HEIGHT = 52;

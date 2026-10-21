import { sparklineDomain } from "@/lib/sparkline";

interface SensorSparklineProps {
  data: number[];
  /** Instrument range; kept for callers, the line is scaled to the data and the normal band instead. */
  min?: number;
  max?: number;
  normalMin: number;
  normalMax: number;
}

const SensorSparkline = ({ data, normalMin, normalMax }: SensorSparklineProps) => {
  const width = 200;
  const height = 32;
  const { min, max } = sparklineDomain(data, normalMin, normalMax);
  const range = max - min;

  const toY = (val: number) => height - ((val - min) / range) * height;
  // The normal band is clipped to the plot; where the data does not reach it, no band or limit line is drawn.
  const clampY = (y: number) => Math.max(0, Math.min(height, y));
  const normalMinY = clampY(toY(normalMin));
  const normalMaxY = clampY(toY(normalMax));
  const minVisible = normalMin >= min && normalMin <= max;
  const maxVisible = normalMax >= min && normalMax <= max;

  const points = data.map((val, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * width : width;
    const y = toY(val);
    return `${x},${y}`;
  });

  const lastVal = data[data.length - 1];
  const isOutOfRange = lastVal < normalMin || lastVal > normalMax;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-8" preserveAspectRatio="none">
      {/* Normal range band */}
      <rect
        x={0}
        y={normalMaxY}
        width={width}
        height={normalMinY - normalMaxY}
        className="fill-raised-2"
      />
      {/* Normal range lines */}
      {minVisible && (
        <line x1={0} y1={normalMinY} x2={width} y2={normalMinY}
          className="stroke-quaternary" strokeWidth="0.5" strokeDasharray="3,3" />
      )}
      {maxVisible && (
        <line x1={0} y1={normalMaxY} x2={width} y2={normalMaxY}
          className="stroke-quaternary" strokeWidth="0.5" strokeDasharray="3,3" />
      )}
      {/* Data line */}
      <polyline
        points={points.join(" ")}
        fill="none"
        className={isOutOfRange ? "stroke-error" : "stroke-foreground"}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Current value dot */}
      <circle
        cx={width}
        cy={toY(lastVal)}
        r="2.5"
        className={isOutOfRange ? "fill-error" : "fill-foreground"}
      />
    </svg>
  );
};

export default SensorSparkline;

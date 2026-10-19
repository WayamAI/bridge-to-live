interface SensorSparklineProps {
  data: number[];
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
}

const SensorSparkline = ({ data, min, max, normalMin, normalMax }: SensorSparklineProps) => {
  const width = 200;
  const height = 32;
  const range = max - min || 1;

  const toY = (val: number) => height - ((val - min) / range) * height;
  const normalMinY = toY(normalMin);
  const normalMaxY = toY(normalMax);

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
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
      <line x1={0} y1={normalMinY} x2={width} y2={normalMinY}
        className="stroke-quaternary" strokeWidth="0.5" strokeDasharray="3,3" />
      <line x1={0} y1={normalMaxY} x2={width} y2={normalMaxY}
        className="stroke-quaternary" strokeWidth="0.5" strokeDasharray="3,3" />
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

import { useState, useEffect, useCallback, useRef } from "react";

export type EquipmentStatus = "running" | "warning" | "critical" | "offline" | "maintenance";

export interface SensorReading {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  timestamp: Date;
  trend: number[]; // last 20 readings
}

export interface Equipment {
  id: string;
  name: string;
  type: "pump" | "compressor" | "heat_exchanger" | "motor" | "valve" | "turbine" | "boiler" | "generator";
  zone: string;
  status: EquipmentStatus;
  health: number; // 0-100
  sensors: SensorReading[];
  lastMaintenance: Date;
  nextMaintenance: Date;
  predictedFailure?: Date;
  runtimeHours: number;
  position: { x: number; y: number }; // percent position on factory map
}

export interface Alert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: "anomaly" | "threshold" | "predictive" | "maintenance" | "safety";
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface OEEMetrics {
  availability: number;
  performance: number;
  quality: number;
  overall: number;
}

// Generate realistic sensor trend data
function generateTrend(base: number, variance: number, length = 20): number[] {
  const trend: number[] = [];
  let val = base;
  for (let i = 0; i < length; i++) {
    val += (Math.random() - 0.5) * variance;
    val = Math.max(base - variance * 3, Math.min(base + variance * 3, val));
    trend.push(Math.round(val * 10) / 10);
  }
  return trend;
}

function createSensor(id: string, name: string, base: number, unit: string, min: number, max: number, normalMin: number, normalMax: number): SensorReading {
  const trend = generateTrend(base, (normalMax - normalMin) * 0.05);
  return {
    id, name, unit, min, max, normalMin, normalMax,
    value: trend[trend.length - 1],
    timestamp: new Date(),
    trend,
  };
}

const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: "pump-01", name: "Feed Pump P-101", type: "pump", zone: "Zone A - Feed",
    status: "running", health: 92,
    sensors: [
      createSensor("p01-temp", "Temperature", 65, "°C", 0, 150, 50, 85),
      createSensor("p01-pressure", "Discharge Pressure", 12.5, "bar", 0, 25, 8, 16),
      createSensor("p01-vibration", "Vibration", 2.1, "mm/s", 0, 15, 0, 4.5),
      createSensor("p01-flow", "Flow Rate", 340, "m³/h", 0, 500, 280, 400),
    ],
    lastMaintenance: new Date("2026-02-15"), nextMaintenance: new Date("2026-05-15"),
    runtimeHours: 4320, position: { x: 15, y: 30 },
  },
  {
    id: "pump-02", name: "Coolant Pump P-201", type: "pump", zone: "Zone B - Cooling",
    status: "warning", health: 68,
    sensors: [
      createSensor("p02-temp", "Temperature", 78, "°C", 0, 150, 50, 85),
      createSensor("p02-pressure", "Discharge Pressure", 9.8, "bar", 0, 25, 8, 16),
      createSensor("p02-vibration", "Vibration", 5.2, "mm/s", 0, 15, 0, 4.5),
      createSensor("p02-flow", "Flow Rate", 260, "m³/h", 0, 500, 280, 400),
    ],
    lastMaintenance: new Date("2026-01-10"), nextMaintenance: new Date("2026-04-10"),
    predictedFailure: new Date("2026-04-22"),
    runtimeHours: 6100, position: { x: 55, y: 25 },
  },
  {
    id: "comp-01", name: "Air Compressor C-101", type: "compressor", zone: "Zone C - Utilities",
    status: "running", health: 88,
    sensors: [
      createSensor("c01-temp", "Outlet Temperature", 95, "°C", 0, 200, 70, 120),
      createSensor("c01-pressure", "Outlet Pressure", 8.2, "bar", 0, 15, 6, 10),
      createSensor("c01-current", "Motor Current", 145, "A", 0, 300, 100, 200),
      createSensor("c01-vibration", "Vibration", 1.8, "mm/s", 0, 15, 0, 4.5),
    ],
    lastMaintenance: new Date("2026-03-01"), nextMaintenance: new Date("2026-06-01"),
    runtimeHours: 3200, position: { x: 80, y: 55 },
  },
  {
    id: "hx-01", name: "Heat Exchanger HX-301", type: "heat_exchanger", zone: "Zone A - Feed",
    status: "running", health: 95,
    sensors: [
      createSensor("hx01-tin", "Inlet Temperature", 120, "°C", 0, 250, 100, 160),
      createSensor("hx01-tout", "Outlet Temperature", 45, "°C", 0, 100, 30, 60),
      createSensor("hx01-dp", "Differential Pressure", 0.8, "bar", 0, 3, 0, 1.5),
      createSensor("hx01-flow", "Flow Rate", 520, "m³/h", 0, 800, 400, 650),
    ],
    lastMaintenance: new Date("2026-02-20"), nextMaintenance: new Date("2026-08-20"),
    runtimeHours: 2800, position: { x: 35, y: 55 },
  },
  {
    id: "motor-01", name: "Drive Motor M-401", type: "motor", zone: "Zone D - Production",
    status: "running", health: 82,
    sensors: [
      createSensor("m01-temp", "Winding Temperature", 72, "°C", 0, 180, 50, 100),
      createSensor("m01-current", "Current Draw", 185, "A", 0, 400, 120, 250),
      createSensor("m01-vibration", "Vibration", 3.1, "mm/s", 0, 15, 0, 4.5),
      createSensor("m01-speed", "Speed", 1480, "RPM", 0, 1800, 1400, 1550),
    ],
    lastMaintenance: new Date("2026-01-25"), nextMaintenance: new Date("2026-04-25"),
    runtimeHours: 5400, position: { x: 60, y: 70 },
  },
  {
    id: "boiler-01", name: "Steam Boiler B-101", type: "boiler", zone: "Zone C - Utilities",
    status: "critical", health: 45,
    sensors: [
      createSensor("b01-temp", "Steam Temperature", 195, "°C", 0, 300, 150, 200),
      createSensor("b01-pressure", "Steam Pressure", 14.8, "bar", 0, 20, 8, 15),
      createSensor("b01-level", "Water Level", 42, "%", 0, 100, 40, 80),
      createSensor("b01-exhaust", "Exhaust Temperature", 280, "°C", 0, 400, 180, 260),
    ],
    lastMaintenance: new Date("2025-11-10"), nextMaintenance: new Date("2026-03-28"),
    predictedFailure: new Date("2026-04-05"),
    runtimeHours: 8200, position: { x: 82, y: 30 },
  },
  {
    id: "turbine-01", name: "Gas Turbine GT-101", type: "turbine", zone: "Zone E - Power",
    status: "running", health: 91,
    sensors: [
      createSensor("gt01-temp", "Exhaust Gas Temp", 540, "°C", 0, 700, 480, 600),
      createSensor("gt01-speed", "Shaft Speed", 3580, "RPM", 0, 4000, 3400, 3700),
      createSensor("gt01-vibration", "Vibration", 1.4, "mm/s", 0, 15, 0, 4.5),
      createSensor("gt01-power", "Power Output", 42.5, "MW", 0, 60, 35, 55),
    ],
    lastMaintenance: new Date("2026-03-10"), nextMaintenance: new Date("2026-09-10"),
    runtimeHours: 1800, position: { x: 20, y: 75 },
  },
  {
    id: "valve-01", name: "Control Valve V-501", type: "valve", zone: "Zone A - Feed",
    status: "maintenance", health: 100,
    sensors: [
      createSensor("v01-pos", "Position", 50, "%", 0, 100, 0, 100),
      createSensor("v01-pressure", "Upstream Pressure", 6.5, "bar", 0, 15, 4, 10),
    ],
    lastMaintenance: new Date("2026-03-25"), nextMaintenance: new Date("2026-09-25"),
    runtimeHours: 0, position: { x: 42, y: 35 },
  },
];

const INITIAL_ALERTS: Alert[] = [
  {
    id: "a1", equipmentId: "boiler-01", equipmentName: "Steam Boiler B-101",
    type: "threshold", severity: "critical",
    message: "Exhaust temperature exceeded safe operating range (280°C > 260°C limit)",
    timestamp: new Date(Date.now() - 120000), acknowledged: false,
  },
  {
    id: "a2", equipmentId: "boiler-01", equipmentName: "Steam Boiler B-101",
    type: "predictive", severity: "critical",
    message: "Predicted tube failure within 10 days based on fouling rate analysis",
    timestamp: new Date(Date.now() - 300000), acknowledged: false,
  },
  {
    id: "a3", equipmentId: "pump-02", equipmentName: "Coolant Pump P-201",
    type: "anomaly", severity: "warning",
    message: "Vibration level 5.2 mm/s exceeds normal threshold (4.5 mm/s). Bearing degradation suspected.",
    timestamp: new Date(Date.now() - 600000), acknowledged: false,
  },
  {
    id: "a4", equipmentId: "pump-02", equipmentName: "Coolant Pump P-201",
    type: "predictive", severity: "warning",
    message: "Bearing replacement recommended within 27 days based on degradation curve",
    timestamp: new Date(Date.now() - 900000), acknowledged: true,
  },
  {
    id: "a5", equipmentId: "valve-01", equipmentName: "Control Valve V-501",
    type: "maintenance", severity: "info",
    message: "Scheduled maintenance in progress. Estimated completion: 2 hours.",
    timestamp: new Date(Date.now() - 1800000), acknowledged: true,
  },
  {
    id: "a6", equipmentId: "motor-01", equipmentName: "Drive Motor M-401",
    type: "anomaly", severity: "warning",
    message: "Current draw trending 8% higher than baseline. Check load alignment.",
    timestamp: new Date(Date.now() - 3600000), acknowledged: true,
  },
];

export function useFactoryData() {
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const intervalRef = useRef<number | null>(null);

  const oee: OEEMetrics = {
    availability: 87.5,
    performance: 92.3,
    quality: 98.1,
    overall: 79.2,
  };

  // Simulate live sensor updates
  const updateSensors = useCallback(() => {
    setEquipment(prev =>
      prev.map(eq => ({
        ...eq,
        sensors: eq.sensors.map(sensor => {
          const variance = (sensor.normalMax - sensor.normalMin) * 0.02;
          const newValue = Math.round((sensor.value + (Math.random() - 0.5) * variance) * 10) / 10;
          const clampedValue = Math.max(sensor.min, Math.min(sensor.max, newValue));
          return {
            ...sensor,
            value: clampedValue,
            trend: [...sensor.trend.slice(1), clampedValue],
            timestamp: new Date(),
          };
        }),
      }))
    );
  }, []);

  useEffect(() => {
    intervalRef.current = window.setInterval(updateSensors, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [updateSensors]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  }, []);

  return { equipment, alerts, oee, acknowledgeAlert };
}

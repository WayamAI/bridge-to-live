import { useState, useEffect, useCallback, useRef } from "react";
import { daysFromNow, shiftDate } from "@/lib/mockDates";

export type EquipmentStatus = "running" | "warning" | "critical" | "offline" | "maintenance";
export type EquipmentClass = "COMP" | "PUMP" | "HEX" | "TURB" | "V" | "FCV" | "MOT" | "AGC" | "PSV" | "TT" | "PT" | "FT" | "LT" | "AT" | "GEN";
export type AlarmSeverity = "info" | "warning" | "critical";
export type AlarmType = "anomaly" | "threshold" | "predictive" | "maintenance" | "safety" | "rate_of_change";
export type UserRole = "plant_director" | "operations_engineer" | "reliability_engineer" | "maintenance_manager" | "energy_manager" | "security_analyst" | "handover_manager";

export interface SensorReading {
  id: string;
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  setpoint: number;
  timestamp: Date;
  trend: number[];
}

export interface Equipment {
  id: string;
  tag: string;
  name: string;
  equipmentClass: EquipmentClass;
  classLabel: string;
  type: string;
  zone: string;
  processUnit: string;
  status: EquipmentStatus;
  health: number;
  sensors: SensorReading[];
  lastMaintenance: Date;
  nextMaintenance: Date;
  predictedFailure?: Date;
  runtimeHours: number;
  position: { x: number; y: number };
  manufacturer: string;
  model: string;
  installDate: Date;
  criticalityTier: "Safety-critical" | "Production-critical" | "Non-critical";
  rulDays: number | null;
  lastAlarm: string;
}

export interface Alert {
  id: string;
  equipmentId: string;
  equipmentTag: string;
  equipmentName: string;
  type: AlarmType;
  severity: AlarmSeverity;
  message: string;
  parameter?: string;
  currentValue?: string;
  setpoint?: string;
  timestamp: Date;
  acknowledged: boolean;
  duration: string;
  priority: 1 | 2 | 3 | 4;
}

export interface OEEMetrics {
  availability: number;
  performance: number;
  quality: number;
  overall: number;
}

export interface HandoverItem {
  requirement: string;
  target: number;
  completed: number;
  unit: string;
  status: "Complete" | "On track" | "Warning" | "At risk";
}

export interface ConnectedSystem {
  name: string;
  type: string;
  status: "Active" | "Degraded" | "Offline";
  lastSync: string;
  recordsPer24h: string;
}

export interface MaintenanceEvent {
  id: string;
  equipmentTag: string;
  type: "Planned PM" | "Predictive" | "Warranty Expiry";
  description: string;
  date: Date;
  probability?: number;
  urgency: "low" | "medium" | "high" | "critical";
}

export interface EnergyMetric {
  label: string;
  value: number;
  unit: string;
  setpoint: number;
  costPerHour: number;
  trend: number[];
}

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

function sensor(id: string, name: string, base: number, unit: string, min: number, max: number, normalMin: number, normalMax: number, setpoint?: number): SensorReading {
  const trend = generateTrend(base, (normalMax - normalMin) * 0.05);
  return {
    id, name, unit, min, max, normalMin, normalMax,
    setpoint: setpoint ?? (normalMin + normalMax) / 2,
    value: trend[trend.length - 1],
    timestamp: new Date(),
    trend,
  };
}

const PROCESS_UNITS = [
  "Feed Gas Receiving", "Compression Train A", "Compression Train B",
  "Liquefaction Cold Box", "Utilities Block", "Flare System",
  "Marine Loading Arms", "Power Generation", "Instrument Air",
  "Cooling Water", "Firewater"
];

const INITIAL_EQUIPMENT: Equipment[] = [
  // Compression Train A
  {
    id: "comp-a-001", tag: "COMP-A-001", name: "Centrifugal Compressor — Stage 1", equipmentClass: "COMP", classLabel: "Centrifugal compressor", type: "compressor",
    zone: "Compression A", processUnit: "Compression Train A", status: "warning", health: 72,
    sensors: [
      sensor("ca001-sp", "Suction pressure", 34.2, "barg", 0, 60, 28, 42, 35),
      sensor("ca001-dp", "Discharge pressure", 82.5, "barg", 0, 130, 70, 95, 85),
      sensor("ca001-st", "Suction temperature", 32, "°C", -10, 80, 20, 45, 35),
      sensor("ca001-dt", "Discharge temperature", 142, "°C", 0, 200, 100, 135, 120),
      sensor("ca001-ss", "Shaft speed", 9840, "RPM", 0, 12000, 9000, 10500, 9800),
      sensor("ca001-bde", "Bearing temperature — DE", 78, "°C", 0, 120, 50, 85, 70),
      sensor("ca001-bnde", "Bearing temperature — NDE", 74, "°C", 0, 120, 50, 85, 70),
      sensor("ca001-vde", "Vibration — DE", 5.8, "mm/s", 0, 15, 0, 4.5, 2.5),
      sensor("ca001-vnde", "Vibration — NDE", 3.2, "mm/s", 0, 15, 0, 4.5, 2.5),
      sensor("ca001-lop", "Lube oil pressure", 3.4, "barg", 0, 8, 2.5, 5, 3.5),
      sensor("ca001-lot", "Lube oil temperature", 52, "°C", 0, 80, 35, 60, 48),
      sensor("ca001-mc", "Motor current", 420, "A", 0, 600, 300, 500, 410),
      sensor("ca001-pw", "Power consumption", 3240, "kW", 0, 5000, 2500, 4000, 3200),
    ],
    lastMaintenance: shiftDate("2025-12-15"), nextMaintenance: shiftDate("2026-06-15"),
    predictedFailure: daysFromNow(36) /* the alarm text says "within 36 days" */,
    runtimeHours: 14200, position: { x: 18, y: 28 },
    manufacturer: "MAN Energy Solutions", model: "MCL 703", installDate: shiftDate("2023-06-10"),
    criticalityTier: "Production-critical", rulDays: 284, lastAlarm: "Temperature high, 47 min",
  },
  {
    id: "comp-a-002", tag: "COMP-A-002", name: "Centrifugal Compressor — Stage 2", equipmentClass: "COMP", classLabel: "Centrifugal compressor", type: "compressor",
    zone: "Compression A", processUnit: "Compression Train A", status: "running", health: 89,
    sensors: [
      sensor("ca002-dp", "Discharge pressure", 118, "barg", 0, 150, 100, 130, 120),
      sensor("ca002-dt", "Discharge temperature", 124, "°C", 0, 200, 100, 140, 125),
      sensor("ca002-vde", "Vibration — DE", 2.1, "mm/s", 0, 15, 0, 4.5, 2.5),
      sensor("ca002-mc", "Motor current", 385, "A", 0, 600, 300, 500, 400),
    ],
    lastMaintenance: shiftDate("2026-01-20"), nextMaintenance: shiftDate("2026-07-20"),
    runtimeHours: 12800, position: { x: 25, y: 22 },
    manufacturer: "MAN Energy Solutions", model: "MCL 703", installDate: shiftDate("2023-06-10"),
    criticalityTier: "Production-critical", rulDays: 520, lastAlarm: "None",
  },
  // Compression Train B
  {
    id: "comp-b-001", tag: "COMP-B-001", name: "Centrifugal Compressor — Train B Stage 1", equipmentClass: "COMP", classLabel: "Centrifugal compressor", type: "compressor",
    zone: "Compression B", processUnit: "Compression Train B", status: "running", health: 85,
    sensors: [
      sensor("cb001-dp", "Discharge pressure", 80, "barg", 0, 130, 70, 95, 85),
      sensor("cb001-dt", "Discharge temperature", 128, "°C", 0, 200, 100, 135, 120),
      sensor("cb001-vde", "Vibration — DE", 2.8, "mm/s", 0, 15, 0, 4.5, 2.5),
      sensor("cb001-mc", "Motor current", 448, "A", 0, 600, 300, 500, 410),
    ],
    lastMaintenance: shiftDate("2026-02-10"), nextMaintenance: shiftDate("2026-08-10"),
    runtimeHours: 11400, position: { x: 32, y: 55 },
    manufacturer: "MAN Energy Solutions", model: "MCL 805", installDate: shiftDate("2023-08-15"),
    criticalityTier: "Production-critical", rulDays: 410, lastAlarm: "None",
  },
  // Cooling System
  {
    id: "hex-c-003", tag: "HEX-C-003", name: "Shell & Tube Heat Exchanger", equipmentClass: "HEX", classLabel: "Shell and tube heat exchanger", type: "heat_exchanger",
    zone: "Cooling", processUnit: "Cooling Water", status: "critical", health: 61,
    sensors: [
      sensor("hc003-tin", "Inlet temperature", 95, "°C", 0, 150, 70, 100, 85),
      sensor("hc003-tout", "Outlet temperature", 52, "°C", 0, 100, 30, 50, 42),
      sensor("hc003-dp", "Differential pressure", 1.8, "bar", 0, 3, 0, 1.2, 0.8),
      sensor("hc003-ff", "Fouling factor", 0.0008, "m²K/W", 0, 0.002, 0, 0.0005, 0.0003),
    ],
    lastMaintenance: shiftDate("2025-09-18"), nextMaintenance: shiftDate("2026-04-15"),
    predictedFailure: daysFromNow(18) /* = rulDays */,
    runtimeHours: 18400, position: { x: 58, y: 20 },
    manufacturer: "Alfa Laval", model: "M15-BFG", installDate: shiftDate("2022-11-20"),
    criticalityTier: "Production-critical", rulDays: 18, lastAlarm: "Fouling — predictive",
  },
  // Utility Pumps
  {
    id: "pump-b-012", tag: "PUMP-B-012", name: "Centrifugal Pump — Utility Water", equipmentClass: "PUMP", classLabel: "Centrifugal pump", type: "pump",
    zone: "Utilities", processUnit: "Utilities Block", status: "running", health: 94,
    sensors: [
      sensor("pb012-dp", "Discharge pressure", 6.2, "barg", 0, 12, 4, 8, 6),
      sensor("pb012-flow", "Flow rate", 480, "m³/h", 0, 700, 350, 550, 480),
      sensor("pb012-vib", "Vibration", 1.4, "mm/s", 0, 15, 0, 4.5, 2),
      sensor("pb012-temp", "Bearing temperature", 48, "°C", 0, 100, 30, 65, 50),
    ],
    lastMaintenance: shiftDate("2026-02-28"), nextMaintenance: shiftDate("2026-08-28"),
    runtimeHours: 8200, position: { x: 72, y: 65 },
    manufacturer: "Sulzer", model: "MSD-D 150-400", installDate: shiftDate("2023-03-15"),
    criticalityTier: "Non-critical", rulDays: 620, lastAlarm: "None",
  },
  // Gas Turbine
  {
    id: "turb-g-001", tag: "TURB-G-001", name: "Gas Turbine Generator", equipmentClass: "TURB", classLabel: "Gas turbine", type: "turbine",
    zone: "Power Gen", processUnit: "Power Generation", status: "running", health: 88,
    sensors: [
      sensor("tg001-egt", "Exhaust gas temperature", 545, "°C", 0, 700, 480, 600, 540),
      sensor("tg001-ss", "Shaft speed", 3580, "RPM", 0, 4000, 3400, 3700, 3600),
      sensor("tg001-vib", "Vibration", 1.9, "mm/s", 0, 15, 0, 4.5, 2),
      sensor("tg001-pw", "Power output", 42.5, "MW", 0, 60, 35, 55, 45),
      sensor("tg001-ffr", "Fuel flow rate", 12400, "Nm³/h", 0, 18000, 10000, 15000, 12500),
    ],
    lastMaintenance: shiftDate("2026-03-10"), nextMaintenance: shiftDate("2026-09-10"),
    runtimeHours: 6400, position: { x: 15, y: 75 },
    manufacturer: "Siemens Energy", model: "SGT-800", installDate: shiftDate("2023-01-20"),
    criticalityTier: "Safety-critical", rulDays: 410, lastAlarm: "Vibration — 3 days ago",
  },
  // Flow Control Valve
  {
    id: "fcv-d-022", tag: "FCV-D-022", name: "Flow Control Valve — Feed Section", equipmentClass: "FCV", classLabel: "Flow control valve", type: "valve",
    zone: "Feed", processUnit: "Feed Gas Receiving", status: "critical", health: 45,
    sensors: [
      sensor("fd022-pos", "Position", 68, "%", 0, 100, 0, 100, 50),
      sensor("fd022-up", "Upstream pressure", 42, "barg", 0, 60, 30, 50, 42),
      sensor("fd022-dp", "Downstream pressure", 38, "barg", 0, 60, 28, 45, 38),
      sensor("fd022-flow", "Flow rate", 1240, "Nm³/h", 0, 2000, 800, 1600, 1200),
    ],
    lastMaintenance: shiftDate("2025-10-05"), nextMaintenance: shiftDate("2026-04-05"),
    predictedFailure: daysFromNow(9) /* = rulDays */,
    runtimeHours: 22100, position: { x: 10, y: 42 },
    manufacturer: "Fisher", model: "ED/EAD", installDate: shiftDate("2022-08-12"),
    criticalityTier: "Production-critical", rulDays: 9, lastAlarm: "Positioner fault — 2 hr",
  },
  // Motor
  {
    id: "mot-e-018", tag: "MOT-E-018", name: "Electric Motor — Comp B Drive", equipmentClass: "MOT", classLabel: "Electric motor", type: "motor",
    zone: "Compression B", processUnit: "Compression Train B", status: "warning", health: 81,
    sensors: [
      sensor("me018-wt", "Winding temperature", 88, "°C", 0, 180, 50, 100, 75),
      sensor("me018-cur", "Current draw", 445, "A", 0, 600, 350, 500, 420),
      sensor("me018-vib", "Vibration", 3.8, "mm/s", 0, 15, 0, 4.5, 2.5),
      sensor("me018-spd", "Speed", 1485, "RPM", 0, 1800, 1450, 1520, 1490),
      sensor("me018-pf", "Power factor", 0.87, "", 0, 1, 0.85, 0.98, 0.92),
    ],
    lastMaintenance: shiftDate("2026-01-25"), nextMaintenance: shiftDate("2026-07-25"),
    runtimeHours: 13200, position: { x: 38, y: 62 },
    manufacturer: "ABB", model: "AXR 560MK4", installDate: shiftDate("2023-08-15"),
    criticalityTier: "Production-critical", rulDays: 190, lastAlarm: "Current imbalance — 6 hr",
  },
  // Pressure Vessel
  {
    id: "v-f-007", tag: "V-F-007", name: "Pressure Vessel — Flare KO Drum", equipmentClass: "V", classLabel: "Pressure vessel", type: "vessel",
    zone: "Flare", processUnit: "Flare System", status: "running", health: 99,
    sensors: [
      sensor("vf007-pr", "Operating pressure", 2.1, "barg", 0, 5, 0, 3.5, 2),
      sensor("vf007-lv", "Level", 22, "%", 0, 100, 10, 60, 30),
      sensor("vf007-tmp", "Temperature", 38, "°C", 0, 80, 20, 55, 35),
    ],
    lastMaintenance: shiftDate("2026-03-01"), nextMaintenance: shiftDate("2027-03-01"),
    runtimeHours: 0, position: { x: 85, y: 35 },
    manufacturer: "L&T Heavy Engineering", model: "Custom KOD-3000", installDate: shiftDate("2022-06-01"),
    criticalityTier: "Safety-critical", rulDays: null, lastAlarm: "None",
  },
  // Air Cooled HEX
  {
    id: "agc-b-004", tag: "AGC-B-004", name: "Air Cooled Heat Exchanger", equipmentClass: "AGC", classLabel: "Air-cooled heat exchanger", type: "air_cooler",
    zone: "Compression B", processUnit: "Compression Train B", status: "warning", health: 78,
    sensors: [
      sensor("ab004-tin", "Process inlet temperature", 110, "°C", 0, 180, 80, 130, 105),
      sensor("ab004-tout", "Process outlet temperature", 52, "°C", 0, 100, 35, 55, 45),
      sensor("ab004-fan", "Fan motor current", 28, "A", 0, 50, 15, 35, 25),
      sensor("ab004-vib", "Fan vibration", 4.2, "mm/s", 0, 15, 0, 4.5, 2.5),
    ],
    lastMaintenance: shiftDate("2026-01-08"), nextMaintenance: shiftDate("2026-07-08"),
    runtimeHours: 10200, position: { x: 42, y: 48 },
    manufacturer: "Kelvion", model: "LHN 412", installDate: shiftDate("2023-08-15"),
    criticalityTier: "Production-critical", rulDays: 120, lastAlarm: "Fan motor fault — 1 day",
  },
  // Cooling Water Pumps
  {
    id: "pump-cw-003", tag: "PUMP-CW-003", name: "Cooling Water Pump — Train 3", equipmentClass: "PUMP", classLabel: "Centrifugal pump", type: "pump",
    zone: "Cooling", processUnit: "Cooling Water", status: "running", health: 86,
    sensors: [
      sensor("pcw003-dp", "Discharge pressure", 4.8, "barg", 0, 8, 3, 6, 5),
      sensor("pcw003-flow", "Flow rate", 1850, "m³/h", 0, 2500, 1500, 2200, 1900),
      sensor("pcw003-vib", "Vibration", 2.4, "mm/s", 0, 15, 0, 4.5, 2),
      sensor("pcw003-eff", "Pump efficiency", 78, "%", 0, 100, 75, 92, 85),
    ],
    lastMaintenance: shiftDate("2026-02-14"), nextMaintenance: shiftDate("2026-08-14"),
    runtimeHours: 9600, position: { x: 62, y: 30 },
    manufacturer: "KSB", model: "Omega 500-710A", installDate: shiftDate("2023-01-10"),
    criticalityTier: "Production-critical", rulDays: 340, lastAlarm: "Efficiency down 8%",
  },
  // PSV
  {
    id: "psv-a-014", tag: "PSV-A-014", name: "Pressure Safety Valve — Comp A Discharge", equipmentClass: "PSV", classLabel: "Pressure safety valve", type: "safety_valve",
    zone: "Compression A", processUnit: "Compression Train A", status: "running", health: 100,
    sensors: [
      sensor("pa014-sp", "Set pressure", 98, "barg", 0, 120, 95, 102, 98),
      sensor("pa014-lk", "Leak detection", 0, "ppm", 0, 100, 0, 5, 0),
    ],
    lastMaintenance: shiftDate("2026-03-20"), nextMaintenance: shiftDate("2027-03-20"),
    runtimeHours: 0, position: { x: 22, y: 18 },
    manufacturer: "Emerson", model: "Anderson Greenwood 81/83P", installDate: shiftDate("2023-06-10"),
    criticalityTier: "Safety-critical", rulDays: null, lastAlarm: "None",
  },
  // Electrical Substation
  {
    id: "gen-e-001", tag: "GEN-E-001", name: "Emergency Diesel Generator", equipmentClass: "GEN", classLabel: "Diesel generator", type: "generator",
    zone: "Power Gen", processUnit: "Power Generation", status: "running", health: 92,
    sensors: [
      sensor("ge001-vol", "Output voltage", 11.2, "kV", 0, 15, 10.5, 11.5, 11),
      sensor("ge001-freq", "Frequency", 50.01, "Hz", 0, 55, 49.5, 50.5, 50),
      sensor("ge001-cur", "Load current", 245, "A", 0, 400, 150, 320, 250),
      sensor("ge001-ft", "Fuel temperature", 42, "°C", 0, 80, 30, 55, 40),
    ],
    lastMaintenance: shiftDate("2026-03-15"), nextMaintenance: shiftDate("2026-09-15"),
    runtimeHours: 3200, position: { x: 20, y: 85 },
    manufacturer: "Cummins", model: "QSK78-G9", installDate: shiftDate("2023-01-20"),
    criticalityTier: "Safety-critical", rulDays: 800, lastAlarm: "None",
  },
  // Feed Gas equipment
  {
    id: "fcv-a-001", tag: "FCV-A-001", name: "Feed Gas Inlet Control Valve", equipmentClass: "FCV", classLabel: "Flow control valve", type: "valve",
    zone: "Feed", processUnit: "Feed Gas Receiving", status: "running", health: 91,
    sensors: [
      sensor("fa001-pos", "Position", 72, "%", 0, 100, 0, 100, 65),
      sensor("fa001-flow", "Flow rate", 2840, "Nm³/h", 0, 4000, 2200, 3400, 2800),
    ],
    lastMaintenance: shiftDate("2026-02-01"), nextMaintenance: shiftDate("2026-08-01"),
    runtimeHours: 14800, position: { x: 8, y: 35 },
    manufacturer: "Fisher", model: "NPS 12 Class 600", installDate: shiftDate("2022-08-12"),
    criticalityTier: "Production-critical", rulDays: 480, lastAlarm: "None",
  },
  // Instrument Air Compressor
  {
    id: "comp-ia-001", tag: "COMP-IA-001", name: "Instrument Air Compressor", equipmentClass: "COMP", classLabel: "Screw compressor", type: "compressor",
    zone: "Utilities", processUnit: "Instrument Air", status: "running", health: 90,
    sensors: [
      sensor("cia001-dp", "Outlet pressure", 8.2, "barg", 0, 12, 7, 9, 8.5),
      sensor("cia001-dt", "Outlet temperature", 42, "°C", 0, 80, 30, 55, 40),
      sensor("cia001-dew", "Dew point", -38, "°C", -60, 0, -50, -30, -40),
      sensor("cia001-flow", "Air flow", 3400, "Nm³/h", 0, 5000, 2800, 4200, 3500),
    ],
    lastMaintenance: shiftDate("2026-03-01"), nextMaintenance: shiftDate("2026-09-01"),
    runtimeHours: 8800, position: { x: 75, y: 50 },
    manufacturer: "Atlas Copco", model: "ZR 500 VSD", installDate: shiftDate("2023-03-01"),
    criticalityTier: "Safety-critical", rulDays: 540, lastAlarm: "None",
  },
  // Marine Loading
  {
    id: "pump-ml-001", tag: "PUMP-ML-001", name: "LNG Loading Pump — Berth 1", equipmentClass: "PUMP", classLabel: "Submerged pump", type: "pump",
    zone: "Marine", processUnit: "Marine Loading Arms", status: "offline", health: 95,
    sensors: [
      sensor("pml001-flow", "Flow rate", 0, "m³/h", 0, 3000, 1800, 2600, 2200),
      sensor("pml001-pr", "Discharge pressure", 0, "barg", 0, 12, 6, 10, 8),
    ],
    lastMaintenance: shiftDate("2026-03-20"), nextMaintenance: shiftDate("2026-09-20"),
    runtimeHours: 2400, position: { x: 90, y: 80 },
    manufacturer: "Ebara", model: "CVM 6K", installDate: shiftDate("2023-05-01"),
    criticalityTier: "Production-critical", rulDays: 700, lastAlarm: "None",
  },
  // Liquefaction Cold Box
  {
    id: "hex-lb-001", tag: "HEX-LB-001", name: "Main Cryogenic Heat Exchanger", equipmentClass: "HEX", classLabel: "Brazed aluminium HEX", type: "heat_exchanger",
    zone: "Liquefaction", processUnit: "Liquefaction Cold Box", status: "running", health: 93,
    sensors: [
      sensor("hlb001-tin", "Warm end temperature", -32, "°C", -60, 20, -40, -20, -33),
      sensor("hlb001-tout", "Cold end temperature", -162, "°C", -200, -100, -165, -155, -161),
      sensor("hlb001-dp", "Differential pressure", 0.4, "bar", 0, 2, 0, 0.8, 0.5),
    ],
    lastMaintenance: shiftDate("2026-01-15"), nextMaintenance: shiftDate("2027-01-15"),
    runtimeHours: 14000, position: { x: 48, y: 38 },
    manufacturer: "Chart Industries", model: "BAHX-5000", installDate: shiftDate("2022-12-01"),
    criticalityTier: "Production-critical", rulDays: 580, lastAlarm: "None",
  },
  // Firewater
  {
    id: "pump-fw-001", tag: "PUMP-FW-001", name: "Firewater Jockey Pump", equipmentClass: "PUMP", classLabel: "Centrifugal pump", type: "pump",
    zone: "Safety", processUnit: "Firewater", status: "running", health: 97,
    sensors: [
      sensor("pfw001-pr", "System pressure", 12.8, "barg", 0, 18, 10, 15, 12.5),
      sensor("pfw001-cur", "Motor current", 18, "A", 0, 40, 10, 25, 18),
    ],
    lastMaintenance: shiftDate("2026-03-05"), nextMaintenance: shiftDate("2026-09-05"),
    runtimeHours: 1200, position: { x: 88, y: 50 },
    manufacturer: "Grundfos", model: "CR 64-4-2", installDate: shiftDate("2023-01-10"),
    criticalityTier: "Safety-critical", rulDays: null, lastAlarm: "None",
  },
  // Sub-station
  {
    id: "sub-e-001", tag: "SUB-E-001", name: "Electrical Substation — Main Bus", equipmentClass: "GEN", classLabel: "Substation", type: "substation",
    zone: "Power Gen", processUnit: "Power Generation", status: "warning", health: 82,
    sensors: [
      sensor("se001-vol", "Bus voltage", 33.2, "kV", 0, 40, 31, 35, 33),
      sensor("se001-pf", "Power factor", 0.74, "", 0, 1, 0.85, 0.98, 0.92),
      sensor("se001-load", "Load", 78, "%", 0, 100, 40, 85, 70),
      sensor("se001-thd", "THD", 4.2, "%", 0, 10, 0, 5, 3),
    ],
    lastMaintenance: shiftDate("2026-02-20"), nextMaintenance: shiftDate("2026-08-20"),
    runtimeHours: 14400, position: { x: 25, y: 88 },
    manufacturer: "Schneider Electric", model: "SM6-36", installDate: shiftDate("2022-11-01"),
    criticalityTier: "Safety-critical", rulDays: 360, lastAlarm: "Power factor 0.74 — below limit",
  },
  // More transmitters
  {
    id: "tt-a-041", tag: "TT-A-041", name: "Temperature Transmitter — Comp A DE Bearing", equipmentClass: "TT", classLabel: "Temperature transmitter", type: "transmitter",
    zone: "Compression A", processUnit: "Compression Train A", status: "running", health: 100,
    sensors: [sensor("ta041-tmp", "Temperature", 78, "°C", 0, 150, 50, 85, 70)],
    lastMaintenance: shiftDate("2026-03-01"), nextMaintenance: shiftDate("2027-03-01"),
    runtimeHours: 14200, position: { x: 20, y: 25 },
    manufacturer: "Endress+Hauser", model: "iTHERM TM411", installDate: shiftDate("2023-06-10"),
    criticalityTier: "Non-critical", rulDays: null, lastAlarm: "None",
  },
  {
    id: "pt-a-042", tag: "PT-A-042", name: "Pressure Transmitter — Comp A Discharge", equipmentClass: "PT", classLabel: "Pressure transmitter", type: "transmitter",
    zone: "Compression A", processUnit: "Compression Train A", status: "running", health: 100,
    sensors: [sensor("pa042-pr", "Pressure", 82.5, "barg", 0, 130, 70, 95, 85)],
    lastMaintenance: shiftDate("2026-03-01"), nextMaintenance: shiftDate("2027-03-01"),
    runtimeHours: 14200, position: { x: 24, y: 30 },
    manufacturer: "Emerson", model: "Rosemount 3051S", installDate: shiftDate("2023-06-10"),
    criticalityTier: "Non-critical", rulDays: null, lastAlarm: "None",
  },
  {
    id: "ft-d-018", tag: "FT-D-018", name: "Flow Transmitter — Feed Gas", equipmentClass: "FT", classLabel: "Flow transmitter", type: "transmitter",
    zone: "Feed", processUnit: "Feed Gas Receiving", status: "running", health: 98,
    sensors: [sensor("fd018-flow", "Flow rate", 2840, "Nm³/h", 0, 4000, 2200, 3400, 2800)],
    lastMaintenance: shiftDate("2026-02-15"), nextMaintenance: shiftDate("2027-02-15"),
    runtimeHours: 14800, position: { x: 8, y: 40 },
    manufacturer: "Emerson", model: "Micro Motion Elite", installDate: shiftDate("2022-08-12"),
    criticalityTier: "Non-critical", rulDays: null, lastAlarm: "None",
  },
  {
    id: "lt-f-003", tag: "LT-F-003", name: "Level Transmitter — Flare KO Drum", equipmentClass: "LT", classLabel: "Level transmitter", type: "transmitter",
    zone: "Flare", processUnit: "Flare System", status: "running", health: 100,
    sensors: [sensor("lf003-lvl", "Level", 22, "%", 0, 100, 10, 60, 30)],
    lastMaintenance: shiftDate("2026-03-01"), nextMaintenance: shiftDate("2027-03-01"),
    runtimeHours: 0, position: { x: 87, y: 38 },
    manufacturer: "Emerson", model: "Rosemount 5300", installDate: shiftDate("2022-06-01"),
    criticalityTier: "Non-critical", rulDays: null, lastAlarm: "None",
  },
  // Analyser
  {
    id: "at-d-001", tag: "AT-D-001", name: "Gas Analyser — Feed Composition", equipmentClass: "AT", classLabel: "Gas analyser", type: "analyser",
    zone: "Feed", processUnit: "Feed Gas Receiving", status: "running", health: 96,
    sensors: [
      sensor("ad001-ch4", "Methane", 92.4, "%", 80, 100, 88, 96, 92),
      sensor("ad001-c2h6", "Ethane", 4.8, "%", 0, 10, 2, 7, 5),
      sensor("ad001-co2", "CO₂", 0.12, "%", 0, 1, 0, 0.3, 0.1),
    ],
    lastMaintenance: shiftDate("2026-03-10"), nextMaintenance: shiftDate("2026-06-10"),
    runtimeHours: 14800, position: { x: 12, y: 48 },
    manufacturer: "ABB", model: "Sensi+", installDate: shiftDate("2022-08-12"),
    criticalityTier: "Production-critical", rulDays: 420, lastAlarm: "None",
  },
  // Additional equipment for density
  ...generateBulkEquipment(),
];

function generateBulkEquipment(): Equipment[] {
  const extra: Equipment[] = [];
  const items = [
    { tag: "PUMP-CW-001", name: "Cooling Water Pump — Train 1", cls: "PUMP" as EquipmentClass, clsLabel: "Centrifugal pump", pu: "Cooling Water", pos: { x: 55, y: 25 }, health: 91, status: "running" as EquipmentStatus, rt: 12400, mfr: "KSB", mdl: "Omega 500-710A", rul: 380, alarm: "None" },
    { tag: "PUMP-CW-002", name: "Cooling Water Pump — Train 2", cls: "PUMP" as EquipmentClass, clsLabel: "Centrifugal pump", pu: "Cooling Water", pos: { x: 58, y: 28 }, health: 88, status: "running" as EquipmentStatus, rt: 11800, mfr: "KSB", mdl: "Omega 500-710A", rul: 320, alarm: "Vibration trend — 2 days" },
    { tag: "HEX-C-001", name: "Shell & Tube HEX — Primary", cls: "HEX" as EquipmentClass, clsLabel: "Shell and tube heat exchanger", pu: "Cooling Water", pos: { x: 60, y: 22 }, health: 84, status: "running" as EquipmentStatus, rt: 16200, mfr: "Alfa Laval", mdl: "M15-BFG", rul: 240, alarm: "None" },
    { tag: "HEX-C-002", name: "Shell & Tube HEX — Secondary", cls: "HEX" as EquipmentClass, clsLabel: "Shell and tube heat exchanger", pu: "Cooling Water", pos: { x: 63, y: 18 }, health: 79, status: "warning" as EquipmentStatus, rt: 17800, mfr: "Alfa Laval", mdl: "M10-BFG", rul: 95, alarm: "DP rising — 8 hr" },
    { tag: "MOT-A-001", name: "Electric Motor — Comp A Drive", cls: "MOT" as EquipmentClass, clsLabel: "Electric motor", pu: "Compression Train A", pos: { x: 20, y: 32 }, health: 84, status: "running" as EquipmentStatus, rt: 14200, mfr: "ABB", mdl: "AXR 560MK4", rul: 280, alarm: "None" },
    { tag: "V-A-003", name: "Suction Scrubber — Comp A", cls: "V" as EquipmentClass, clsLabel: "Pressure vessel", pu: "Compression Train A", pos: { x: 16, y: 24 }, health: 98, status: "running" as EquipmentStatus, rt: 14200, mfr: "L&T", mdl: "Custom", rul: null, alarm: "None" },
    { tag: "V-B-004", name: "Suction Scrubber — Comp B", cls: "V" as EquipmentClass, clsLabel: "Pressure vessel", pu: "Compression Train B", pos: { x: 30, y: 52 }, health: 97, status: "running" as EquipmentStatus, rt: 11400, mfr: "L&T", mdl: "Custom", rul: null, alarm: "None" },
    { tag: "FCV-D-023", name: "Flow Control Valve — Slug Catcher", cls: "FCV" as EquipmentClass, clsLabel: "Flow control valve", pu: "Feed Gas Receiving", pos: { x: 12, y: 45 }, health: 88, status: "running" as EquipmentStatus, rt: 14800, mfr: "Fisher", mdl: "ET", rul: 340, alarm: "None" },
    { tag: "PUMP-B-013", name: "Condensate Pump", cls: "PUMP" as EquipmentClass, clsLabel: "Centrifugal pump", pu: "Utilities Block", pos: { x: 70, y: 60 }, health: 92, status: "running" as EquipmentStatus, rt: 7600, mfr: "Sulzer", mdl: "MSD-D 100-250", rul: 480, alarm: "None" },
    { tag: "PUMP-FW-002", name: "Firewater Main Pump — Diesel", cls: "PUMP" as EquipmentClass, clsLabel: "Diesel fire pump", pu: "Firewater", pos: { x: 90, y: 55 }, health: 100, status: "running" as EquipmentStatus, rt: 240, mfr: "Kirloskar", mdl: "KDS 1340+", rul: null, alarm: "None" },
    { tag: "TURB-G-002", name: "Steam Turbine Generator", cls: "TURB" as EquipmentClass, clsLabel: "Steam turbine", pu: "Power Generation", pos: { x: 18, y: 80 }, health: 87, status: "running" as EquipmentStatus, rt: 5800, mfr: "Triveni Turbines", mdl: "TSST-30", rul: 380, alarm: "None" },
    { tag: "HEX-U-001", name: "Waste Heat Recovery Unit", cls: "HEX" as EquipmentClass, clsLabel: "HRSG", pu: "Power Generation", pos: { x: 22, y: 78 }, health: 90, status: "running" as EquipmentStatus, rt: 5800, mfr: "Thermax", mdl: "WHRU-50", rul: 420, alarm: "None" },
    { tag: "V-LB-001", name: "Cold Box Separator Drum", cls: "V" as EquipmentClass, clsLabel: "Pressure vessel", pu: "Liquefaction Cold Box", pos: { x: 50, y: 35 }, health: 99, status: "running" as EquipmentStatus, rt: 14000, mfr: "Linde", mdl: "Custom", rul: null, alarm: "None" },
    { tag: "FCV-LB-001", name: "Refrigerant Control Valve", cls: "FCV" as EquipmentClass, clsLabel: "Control valve", pu: "Liquefaction Cold Box", pos: { x: 52, y: 42 }, health: 94, status: "running" as EquipmentStatus, rt: 14000, mfr: "Fisher", mdl: "NPS 8 Class 900", rul: 520, alarm: "None" },
    { tag: "PSV-F-001", name: "Flare Header PSV", cls: "PSV" as EquipmentClass, clsLabel: "Pressure safety valve", pu: "Flare System", pos: { x: 82, y: 32 }, health: 100, status: "running" as EquipmentStatus, rt: 0, mfr: "Emerson", mdl: "Crosby J-Series", rul: null, alarm: "None" },
    { tag: "COMP-IA-002", name: "Instrument Air Compressor — Standby", cls: "COMP" as EquipmentClass, clsLabel: "Screw compressor", pu: "Instrument Air", pos: { x: 78, y: 48 }, health: 100, status: "offline" as EquipmentStatus, rt: 2400, mfr: "Atlas Copco", mdl: "ZR 500 VSD", rul: 800, alarm: "None" },
    { tag: "MOT-CW-001", name: "CW Pump Motor — Train 1", cls: "MOT" as EquipmentClass, clsLabel: "Electric motor", pu: "Cooling Water", pos: { x: 54, y: 28 }, health: 90, status: "running" as EquipmentStatus, rt: 12400, mfr: "Siemens", mdl: "1LA8 355", rul: 380, alarm: "None" },
  ];

  for (const item of items) {
    extra.push({
      id: item.tag.toLowerCase(), tag: item.tag, name: item.name,
      equipmentClass: item.cls, classLabel: item.clsLabel, type: item.cls.toLowerCase(),
      zone: item.pu.split(" ")[0], processUnit: item.pu,
      status: item.status, health: item.health,
      sensors: [
        sensor(`${item.tag.toLowerCase()}-s1`, "Primary Sensor", 50 + Math.random() * 30, "°C", 0, 120, 40, 80, 60),
      ],
      lastMaintenance: shiftDate("2026-02-01"), nextMaintenance: shiftDate("2026-08-01"),
      runtimeHours: item.rt, position: item.pos,
      manufacturer: item.mfr, model: item.mdl,
      installDate: shiftDate("2023-01-01"),
      criticalityTier: "Non-critical", rulDays: item.rul, lastAlarm: item.alarm,
    });
  }
  return extra;
}

const INITIAL_ALERTS: Alert[] = [
  {
    id: "a1", equipmentId: "comp-a-001", equipmentTag: "COMP-A-001", equipmentName: "Centrifugal Compressor — Stage 1",
    type: "threshold", severity: "critical", parameter: "Discharge Temperature", currentValue: "142°C", setpoint: "135°C",
    message: "Discharge temperature 142°C — High alarm (setpoint 135°C)",
    timestamp: new Date(Date.now() - 2820000), acknowledged: false, duration: "47 min", priority: 1,
  },
  {
    id: "a2", equipmentId: "hex-c-003", equipmentTag: "HEX-C-003", equipmentName: "Shell & Tube Heat Exchanger",
    type: "predictive", severity: "critical", parameter: "Fouling Factor",
    message: "Fouling factor rising — predictive alert — failure probable in 18 days",
    timestamp: new Date(Date.now() - 3600000), acknowledged: false, duration: "1 hr", priority: 1,
  },
  {
    id: "a3", equipmentId: "fcv-d-022", equipmentTag: "FCV-D-022", equipmentName: "Flow Control Valve — Feed Section",
    type: "threshold", severity: "critical", parameter: "Positioner", currentValue: "Fault",
    message: "Positioner fault — Critical — valve stuck at 68% open",
    timestamp: new Date(Date.now() - 8040000), acknowledged: false, duration: "2 hr 14 min", priority: 1,
  },
  {
    id: "a4", equipmentId: "mot-e-018", equipmentTag: "MOT-E-018", equipmentName: "Electric Motor — Comp B Drive",
    type: "anomaly", severity: "warning", parameter: "Current Draw", currentValue: "445A", setpoint: "420A",
    message: "Current imbalance 8.4% — Warning — check load alignment",
    timestamp: new Date(Date.now() - 21600000), acknowledged: false, duration: "6 hr", priority: 2,
  },
  {
    id: "a5", equipmentId: "sub-e-001", equipmentTag: "SUB-E-001", equipmentName: "Electrical Substation — Main Bus",
    type: "threshold", severity: "warning", parameter: "Power Factor", currentValue: "0.74", setpoint: "0.85",
    message: "Power factor 0.74 — below limit 0.85",
    timestamp: new Date(Date.now() - 11520000), acknowledged: true, duration: "3.2 hr", priority: 2,
  },
  {
    id: "a6", equipmentId: "comp-a-001", equipmentTag: "COMP-A-001", equipmentName: "Centrifugal Compressor — Stage 1",
    type: "predictive", severity: "critical",
    message: "Predicted bearing failure within 36 days — vibration DE trending 5.8 mm/s",
    timestamp: new Date(Date.now() - 7200000), acknowledged: false, duration: "2 hr", priority: 1,
  },
  {
    id: "a7", equipmentId: "agc-b-004", equipmentTag: "AGC-B-004", equipmentName: "Air Cooled Heat Exchanger",
    type: "anomaly", severity: "warning", parameter: "Fan Vibration", currentValue: "4.2 mm/s", setpoint: "4.5 mm/s",
    message: "Fan motor vibration approaching threshold — bearing suspected",
    timestamp: new Date(Date.now() - 86400000), acknowledged: true, duration: "1 day", priority: 3,
  },
  {
    id: "a8", equipmentId: "pump-cw-003", equipmentTag: "PUMP-CW-003", equipmentName: "Cooling Water Pump — Train 3",
    type: "anomaly", severity: "warning",
    message: "Pump efficiency down 8% vs. baseline — fouling suspected — ₹0.9 L/day impact",
    timestamp: new Date(Date.now() - 14400000), acknowledged: true, duration: "4 hr", priority: 3,
  },
  {
    id: "a9", equipmentId: "comp-b-001", equipmentTag: "COMP-B-001", equipmentName: "Centrifugal Compressor — Train B Stage 1",
    type: "rate_of_change", severity: "warning",
    message: "Motor drawing 12% excess current vs. similar load profile — ₹1.8 L/day impact",
    timestamp: new Date(Date.now() - 28800000), acknowledged: true, duration: "8 hr", priority: 3,
  },
  {
    id: "a10", equipmentId: "hex-c-002", equipmentTag: "HEX-C-002", equipmentName: "Shell & Tube HEX — Secondary",
    type: "threshold", severity: "warning", parameter: "Differential Pressure",
    message: "Differential pressure rising — 1.4 bar vs. 1.2 bar limit",
    timestamp: new Date(Date.now() - 28800000), acknowledged: false, duration: "8 hr", priority: 2,
  },
];

const CONNECTED_SYSTEMS: ConnectedSystem[] = [
  { name: "Honeywell Experion DCS", type: "OT / DCS", status: "Active", lastSync: "Live (< 1 sec)", recordsPer24h: "82.4M readings" },
  { name: "Siemens S7 PLC Network", type: "OT / PLC", status: "Active", lastSync: "Live (< 1 sec)", recordsPer24h: "14.2M readings" },
  { name: "OSIsoft PI Historian", type: "Historian", status: "Active", lastSync: "30 sec intervals", recordsPer24h: "6.8M points" },
  { name: "IBM Maximo CMMS", type: "CMMS", status: "Active", lastSync: "15 min ago", recordsPer24h: "1,240 records" },
  { name: "SAP PM / ERP", type: "ERP", status: "Active", lastSync: "4 hr ago (batch)", recordsPer24h: "8,420 records" },
  { name: "Hexagon SmartPlant (engineering twin)", type: "Engineering", status: "Active", lastSync: "6 days ago", recordsPer24h: "240K tags" },
  { name: "Fluke Reliability (vibration)", type: "IoT / Condition", status: "Degraded", lastSync: "2 hr ago (lagging)", recordsPer24h: "42K readings" },
  { name: "Schneider Power Monitoring", type: "Energy / OT", status: "Active", lastSync: "5 min intervals", recordsPer24h: "1.2M readings" },
  { name: "LDAR Leak Detection", type: "Emissions / OT", status: "Active", lastSync: "Hourly", recordsPer24h: "3,840 readings" },
  { name: "Safety Instrumented System (SIS)", type: "Safety / OT", status: "Active", lastSync: "Live — read-only", recordsPer24h: "Monitoring only" },
];

const HANDOVER_DATA: HandoverItem[] = [
  { requirement: "Equipment sensor mapping", target: 2847, completed: 2104, unit: "items", status: "Warning" },
  { requirement: "P&ID → operational tag linkage", target: 12440, completed: 11892, unit: "tags", status: "On track" },
  { requirement: "Sensor threshold definition", target: 2847, completed: 1820, unit: "items", status: "At risk" },
  { requirement: "IoT gateway commissioning", target: 48, completed: 31, unit: "gateways", status: "On track" },
  { requirement: "OT protocol connectivity test", target: 48, completed: 18, unit: "gateways", status: "At risk" },
  { requirement: "ISO 15926 / CFIHOS validation", target: 12440, completed: 9210, unit: "tags", status: "At risk" },
  { requirement: "CMMS work order template setup", target: 2847, completed: 2847, unit: "items", status: "Complete" },
  { requirement: "Cloud platform provisioning", target: 1, completed: 1, unit: "environment", status: "Complete" },
  { requirement: "Client UAT sign-off", target: 3, completed: 1, unit: "modules", status: "On track" },
];

const MAINTENANCE_EVENTS: MaintenanceEvent[] = [
  { id: "me1", equipmentTag: "COMP-A-001", type: "Predictive", description: "Bearing inspection — vibration trending", date: shiftDate("2026-04-05"), probability: 72, urgency: "critical" },
  { id: "me2", equipmentTag: "HEX-C-003", type: "Planned PM", description: "Tube bundle cleaning", date: shiftDate("2026-04-15"), urgency: "high" },
  { id: "me3", equipmentTag: "FCV-D-022", type: "Predictive", description: "Positioner replacement", date: shiftDate("2026-04-02"), probability: 88, urgency: "critical" },
  { id: "me4", equipmentTag: "MOT-E-018", type: "Planned PM", description: "Bearing lubrication & alignment check", date: shiftDate("2026-04-25"), urgency: "medium" },
  { id: "me5", equipmentTag: "PUMP-CW-003", type: "Planned PM", description: "Impeller inspection", date: shiftDate("2026-05-01"), urgency: "medium" },
  { id: "me6", equipmentTag: "AGC-B-004", type: "Predictive", description: "Fan motor bearing replacement", date: shiftDate("2026-04-18"), probability: 54, urgency: "high" },
  { id: "me7", equipmentTag: "TURB-G-001", type: "Planned PM", description: "Hot gas path inspection", date: shiftDate("2026-09-10"), urgency: "low" },
  { id: "me8", equipmentTag: "COMP-IA-001", type: "Planned PM", description: "Oil & filter change", date: shiftDate("2026-05-15"), urgency: "low" },
  { id: "me9", equipmentTag: "PSV-A-014", type: "Warranty Expiry", description: "Warranty expires — schedule recertification", date: shiftDate("2026-06-10"), urgency: "medium" },
  { id: "me10", equipmentTag: "SUB-E-001", type: "Planned PM", description: "Capacitor bank inspection — power factor correction", date: shiftDate("2026-04-20"), urgency: "high" },
];

const ENERGY_METRICS: EnergyMetric[] = [
  { label: "Electrical load", value: 48200, unit: "kW", setpoint: 45000, costPerHour: 24100, trend: generateTrend(48200, 1200) },
  { label: "Steam consumption", value: 142, unit: "T/hr", setpoint: 135, costPerHour: 8520, trend: generateTrend(142, 8) },
  { label: "Cooling water flow", value: 8400, unit: "m³/hr", setpoint: 8000, costPerHour: 2100, trend: generateTrend(8400, 400) },
  { label: "Compressed air", value: 6800, unit: "Nm³/hr", setpoint: 6500, costPerHour: 1360, trend: generateTrend(6800, 300) },
  { label: "Natural gas", value: 18.4, unit: "MMBTU/hr", setpoint: 17.5, costPerHour: 46000, trend: generateTrend(18.4, 1.2) },
  { label: "Energy cost rate", value: 82080, unit: "₹/hr", setpoint: 75000, costPerHour: 82080, trend: generateTrend(82080, 4000) },
];

export function usePlantData() {
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const intervalRef = useRef<number | null>(null);

  const oee: OEEMetrics = {
    availability: 87.5,
    performance: 92.3,
    quality: 98.1,
    overall: 79.2,
  };

  const updateSensors = useCallback(() => {
    setEquipment(prev =>
      prev.map(eq => ({
        ...eq,
        sensors: eq.sensors.map(s => {
          const variance = (s.normalMax - s.normalMin) * 0.02;
          const newValue = Math.round((s.value + (Math.random() - 0.5) * variance) * 10) / 10;
          const clampedValue = Math.max(s.min, Math.min(s.max, newValue));
          return { ...s, value: clampedValue, trend: [...s.trend.slice(1), clampedValue], timestamp: new Date() };
        }),
      }))
    );
  }, []);

  useEffect(() => {
    intervalRef.current = window.setInterval(updateSensors, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [updateSensors]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  }, []);

  return {
    equipment, alerts, oee, acknowledgeAlert,
    connectedSystems: CONNECTED_SYSTEMS,
    handoverData: HANDOVER_DATA,
    maintenanceEvents: MAINTENANCE_EVENTS,
    energyMetrics: ENERGY_METRICS,
    processUnits: PROCESS_UNITS,
    plantInfo: {
      name: "Ratnagiri LNG Terminal",
      operator: "HPCL-Shapoorji LNG",
      capacity: "5 MMTPA",
      totalEquipment: 2847,
      totalSensorTags: 42400,
      handoverTarget: "14 November 2026",
      daysRemaining: 232,
    },
  };
}

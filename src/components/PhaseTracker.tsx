import { motion } from "framer-motion";
import { Database, Wifi, FileText, Shield, Brain, Settings } from "lucide-react";
import { useState } from "react";

const phases = [
  {
    number: 1,
    title: "Component Census & Sensor Mapping",
    icon: Settings,
    color: "engineering" as const,
    timeline: "Weeks 1–4",
    summary: "Map every engineering component to the sensors that will monitor it in operation.",
    details: [
      "Analyse every pump, compressor, heat exchanger, vessel, valve, motor, and transmitter",
      "Identify critical operational parameters (temperature, pressure, flow, vibration)",
      "Define normal operating ranges from engineering specifications",
      "Set alarm and trip thresholds per process design",
      "Determine sensor types and sampling frequencies",
    ],
  },
  {
    number: 2,
    title: "IoT & Sensor Deployment",
    icon: Wifi,
    color: "operational" as const,
    timeline: "Weeks 5–10",
    summary: "Deploy the physical sensing infrastructure and OT protocol integration layer.",
    details: [
      "Install smart sensors and transmitters on equipment",
      "Deploy edge devices for local signal processing and buffering",
      "Build OT protocol translation layer (OPC-UA, Modbus, MQTT)",
      "Implement Purdue Model network architecture for IT/OT segmentation",
      "Configure data diodes for one-way data flow where required",
    ],
  },
  {
    number: 3,
    title: "Cloud Big Data Platform",
    icon: Database,
    color: "operational" as const,
    timeline: "Weeks 7–14",
    summary: "Build the cloud platform for ingestion, storage, and serving of operational data at scale.",
    details: [
      "Real-time ingestion via Azure IoT Hub / AWS IoT Core / Kafka",
      "Time-series storage (InfluxDB, OSIsoft PI, Azure Data Explorer)",
      "Data lakehouse for long-term queryable storage",
      "Stream processing for real-time threshold alerts",
      "API serving layer (REST, GraphQL) for dashboards and external systems",
    ],
  },
  {
    number: 4,
    title: "AI & Analytics Layer",
    icon: Brain,
    color: "primary" as const,
    timeline: "Weeks 12–20",
    summary: "Convert raw sensor data into operational intelligence with predictive capabilities.",
    details: [
      "Anomaly detection and condition monitoring against baselines",
      "Predictive maintenance with remaining useful life (RUL) models",
      "Energy optimisation: AI-driven load balancing and prescriptive recommendations",
      "OEE dashboards for plant managers, operators, maintenance, and HSE",
      "Automated root cause analysis for equipment degradation",
    ],
  },
  {
    number: 5,
    title: "IT/OT Security Hardening",
    icon: Shield,
    color: "gap" as const,
    timeline: "Weeks 14–22",
    summary: "Secure the expanded attack surface created by connecting OT systems to the cloud.",
    details: [
      "OT asset discovery and complete inventory",
      "Industrial DMZ and firewall configuration",
      "OT Security Operations Centre (SOC) setup",
      "Encrypted, role-based secure remote access",
      "Incident response playbooks for OT-specific threats",
    ],
  },
  {
    number: 6,
    title: "Structured Data Handover & Governance",
    icon: FileText,
    color: "primary" as const,
    timeline: "Weeks 18–32",
    summary: "Restructure the handover from document-first to data-first using ISO 15926 / CFIHOS.",
    details: [
      "Define data handover requirements at project inception",
      "Configure SmartPlant for ISO 15926 / CFIHOS structured export",
      "Validate handover datasets against operational system requirements",
      "Establish master data management and data quality monitoring",
      "Implement role-based access control and audit trail",
    ],
  },
];

const colorMap = {
  engineering: {
    bg: "bg-engineering-muted/30",
    border: "border-engineering/30",
    text: "text-engineering",
    activeBg: "bg-engineering-muted/50",
    activeBorder: "border-engineering/60",
    dot: "bg-engineering",
  },
  operational: {
    bg: "bg-operational-muted/30",
    border: "border-operational/30",
    text: "text-operational",
    activeBg: "bg-operational-muted/50",
    activeBorder: "border-operational/60",
    dot: "bg-operational",
  },
  primary: {
    bg: "bg-primary/5",
    border: "border-primary/30",
    text: "text-primary",
    activeBg: "bg-primary/10",
    activeBorder: "border-primary/60",
    dot: "bg-primary",
  },
  gap: {
    bg: "bg-gap/5",
    border: "border-gap/30",
    text: "text-gap",
    activeBg: "bg-gap/10",
    activeBorder: "border-gap/60",
    dot: "bg-gap",
  },
};

const PhaseTracker = () => {
  const [activePhase, setActivePhase] = useState(0);
  const active = phases[activePhase];
  const colors = colorMap[active.color];
  const Icon = active.icon;

  return (
    <section className="py-20 px-6 bg-grid">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-4"
        >
          6-Phase Transition Playbook
        </motion.h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          A repeatable, scalable methodology for converting engineering twins to operational twins across all projects.
        </p>

        {/* Phase selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {phases.map((phase, i) => {
            const c = colorMap[phase.color];
            const isActive = i === activePhase;
            return (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-medium ${
                  isActive
                    ? `${c.activeBg} ${c.activeBorder} ${c.text}`
                    : `${c.bg} ${c.border} text-muted-foreground hover:text-foreground`
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? `${c.dot} text-background` : "bg-muted text-muted-foreground"
                }`}>
                  {phase.number}
                </span>
                <span className="hidden sm:inline">{phase.title.split(" ").slice(0, 2).join(" ")}</span>
              </button>
            );
          })}
        </div>

        {/* Active phase detail */}
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl border ${colors.activeBorder} ${colors.activeBg} p-8`}
        >
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-lg ${colors.dot} flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6 text-background" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold">{active.title}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {active.timeline}
                </span>
              </div>
              <p className="text-muted-foreground">{active.summary}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {active.details.map((detail, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 text-sm"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} mt-2 shrink-0`} />
                <span className="text-foreground/80">{detail}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhaseTracker;

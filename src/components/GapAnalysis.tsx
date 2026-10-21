import { motion } from "framer-motion";
import { AlertTriangle, Database, Network, FileText } from "lucide-react";

const gaps = [
  {
    icon: Database,
    title: "Data Architecture Mismatch",
    problem: "Engineering twins sit on relational databases (SQL/Oracle) designed for structured design data. A large facility generates GBs of sensor data per hour, relational databases can't handle that at scale.",
    solution: "Cloud-native big data platform: data lakes, streaming pipelines, time-series databases (InfluxDB, OSIsoft PI, Azure Data Explorer).",
    severity: "critical" as const,
  },
  {
    icon: Network,
    title: "IT/OT Integration Gap",
    problem: "Engineering model lives in IT (SmartPlant, SAP). The running plant lives in OT (SCADA, PLCs, DCS). Different protocols, different security requirements, never designed to communicate.",
    solution: "Purpose-built OT integration middleware, OPC-UA protocol translation, secure data diodes, Purdue Model network segmentation.",
    severity: "critical" as const,
  },
  {
    icon: FileText,
    title: "Document-Driven Handover",
    problem: "Even though engineering tools generate rich structured data internally, what gets handed over is PDFs and drawings, the structured data is flattened and lost.",
    solution: "Data-first handover using ISO 15926 and CFIHOS standards. Structured, machine-readable exports from SmartPlant at commissioning.",
    severity: "high" as const,
  },
];

const severityColors = {
  critical: "border-destructive/40 bg-destructive/5",
  high: "border-gap/40 bg-gap/5",
};

const GapAnalysis = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gap/10 border border-gap/30 text-gap text-sm font-medium mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            Core Challenges
          </div>
          <h2 className="text-3xl font-bold mb-4">Why the Transition Is Hard</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three compounding problems create the gap between engineering and operational twins.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {gaps.map((gap, i) => {
            const Icon = gap.icon;
            return (
              <motion.div
                key={gap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`rounded-xl border p-6 ${severityColors[gap.severity]} flex flex-col`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{gap.title}</h3>
                    <span className={`text-[10px] font-mono tracking-wide ${
                      gap.severity === "critical" ? "text-destructive" : "text-gap"
                    }`}>
                      {gap.severity}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{gap.problem}</p>
                <div className="rounded-lg bg-operational-muted/30 border border-operational/20 p-3">
                  <p className="text-xs font-medium text-operational mb-1">Resolution</p>
                  <p className="text-xs text-foreground/70">{gap.solution}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GapAnalysis;

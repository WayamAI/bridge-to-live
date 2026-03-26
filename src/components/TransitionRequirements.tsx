import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const requirements = [
  { category: "Data Architecture", items: ["Relational → cloud big data", "Time-series databases", "Data lakehouse setup"] },
  { category: "Sensor / IoT Layer", items: ["Parameters mapped", "Thresholds defined", "Edge devices deployed"] },
  { category: "Data Pipelines", items: ["ETL + real-time ingestion", "Stream processing", "API serving layer"] },
  { category: "Dashboards + AI", items: ["OEE tracking", "Predictive maintenance", "Energy optimisation"] },
  { category: "Governance Model", items: ["Security policies", "Data ownership", "Access control"] },
  { category: "Standardised Handover", items: ["ISO 15926 compliance", "CFIHOS formats", "Automated validation"] },
];

const TransitionRequirements = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-4"
        >
          What the Transition Requires
        </motion.h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Six capability areas must be built to bridge the engineering-to-operational twin gap.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requirements.map((req, i) => (
            <motion.div
              key={req.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="font-semibold text-sm mb-3">{req.category}</h3>
              <div className="space-y-2">
                {req.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-3.5 h-3.5 text-operational shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransitionRequirements;

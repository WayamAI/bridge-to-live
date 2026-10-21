import { motion } from "framer-motion";
import { TrendingDown, Zap, Wrench, Clock, Users } from "lucide-react";

const metrics = [
  { icon: TrendingDown, label: "Unplanned Downtime", value: "30-40%", suffix: "reduction", color: "text-operational" },
  { icon: Zap, label: "Energy Costs", value: "10-12%", suffix: "savings", color: "text-primary" },
  { icon: Wrench, label: "Maintenance Costs", value: "15-25%", suffix: "reduction", color: "text-engineering" },
  { icon: Clock, label: "Anomaly Detection", value: "~50%", suffix: "faster", color: "text-gap" },
  { icon: Users, label: "Manual Diagnostics", value: "~35%", suffix: "reduction", color: "text-primary" },
];

const MetricsBar = () => {
  return (
    <section className="py-16 px-6 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center mb-10"
        >
          Expected Business Outcomes
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <Icon className={`w-5 h-5 mx-auto mb-2 ${m.color}`} />
                <p className={`text-2xl font-bold font-mono ${m.color}`}>{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.suffix}</p>
                <p className="text-xs font-medium mt-1">{m.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MetricsBar;

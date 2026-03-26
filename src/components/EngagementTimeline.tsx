import { motion } from "framer-motion";

const stages = [
  { stage: "Discovery & Blueprint", timeline: "Weeks 1–6", desc: "Engineering twin audit, sensor census, cloud architecture design, OT security requirements, handover schema definition." },
  { stage: "Pilot Deployment", timeline: "Weeks 7–20", desc: "IoT layer and cloud platform for pilot project. 3–5 predictive maintenance models. OEE dashboard and energy intelligence." },
  { stage: "Blueprint Productisation", timeline: "Weeks 21–32", desc: "Convert pilot into reusable IaC templates, connector library, sensor mapping library, governance model and playbooks." },
  { stage: "Scaled Rollout", timeline: "Ongoing", desc: "Apply blueprint across projects using distributed execution teams. Platform governance, AI model updates, OT security monitoring." },
];

const EngagementTimeline = () => {
  return (
    <section className="py-20 px-6 bg-grid">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Engagement Timeline
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {stages.map((s, i) => (
              <motion.div
                key={s.stage}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-16"
              >
                <div className="absolute left-4 top-2 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{s.stage}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {s.timeline}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngagementTimeline;

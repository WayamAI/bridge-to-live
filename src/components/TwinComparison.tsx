import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

const engineeringItems = [
  { title: "3D plant model", desc: "Every pipe, valve, bolt modeled" },
  { title: "Relational database", desc: "SQL / Oracle, structured data" },
  { title: "Bill of materials", desc: "Feeds procurement, construction" },
  { title: "Document-centric handover", desc: "PDFs, drawings, static files" },
];

const operationalItems = [
  { title: "Live connected model", desc: "Sensor + IoT data streams in real time" },
  { title: "Big data platform", desc: "Cloud-native, GBs/hour at scale" },
  { title: "IT/OT integration", desc: "SCADA, CMMS, EAM connected" },
  { title: "Intelligent operations", desc: "Predictive analytics, AI decisioning" },
];

const TwinComparison = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-4"
        >
          Understanding the Two Twins
        </motion.h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          The engineering twin and operational twin are fundamentally different in architecture, data model, and purpose.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
          {/* Engineering Twin */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-lg border border-engineering/30 bg-engineering-muted/30 p-5 mb-4">
              <h3 className="text-engineering font-semibold text-lg mb-1">Engineering Digital Twin</h3>
              <p className="text-muted-foreground text-sm">Static · Design-time · Relational DB</p>
            </div>
            <div className="space-y-3">
              {engineeringItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg border border-engineering/20 bg-engineering-muted/20 p-4"
                >
                  <h4 className="font-semibold text-sm text-engineering-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gap indicator */}
          <div className="flex flex-col items-center justify-center py-8 lg:py-20">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.3 }}
              className="w-20 h-20 rounded-xl bg-gap/10 border-2 border-gap/50 flex flex-col items-center justify-center"
            >
              <Zap className="w-5 h-5 text-gap mb-1" />
              <span className="text-gap font-bold text-xs">GAP</span>
              <span className="text-gap/70 text-[10px]">IT / OT</span>
            </motion.div>
            <div className="hidden lg:flex items-center mt-4 text-muted-foreground">
              <ArrowRight className="w-4 h-4 animate-pulse-glow" />
            </div>
          </div>

          {/* Operational Twin */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-lg border border-operational/30 bg-operational-muted/30 p-5 mb-4">
              <h3 className="text-operational font-semibold text-lg mb-1">Operational Digital Twin</h3>
              <p className="text-muted-foreground text-sm">Dynamic · Runtime · Cloud / Big Data</p>
            </div>
            <div className="space-y-3">
              {operationalItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg border border-operational/20 bg-operational-muted/20 p-4"
                >
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TwinComparison;

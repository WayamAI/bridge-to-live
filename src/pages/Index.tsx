import { motion } from "framer-motion";
import { ArrowDown, Box, Activity } from "lucide-react";
import TwinComparison from "@/components/TwinComparison";
import GapAnalysis from "@/components/GapAnalysis";
import PhaseTracker from "@/components/PhaseTracker";
import MetricsBar from "@/components/MetricsBar";
import TransitionRequirements from "@/components/TransitionRequirements";
import EngagementTimeline from "@/components/EngagementTimeline";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">TwinBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#twins" className="hover:text-foreground transition-colors">Twins</a>
            <a href="#gaps" className="hover:text-foreground transition-colors">Gap Analysis</a>
            <a href="#phases" className="hover:text-foreground transition-colors">Playbook</a>
            <a href="#outcomes" className="hover:text-foreground transition-colors">Outcomes</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-6">
              <Box className="w-3.5 h-3.5" />
              Engineering → Operational Twin Transition
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Bridge the gap between{" "}
              <span className="text-engineering">design</span> and{" "}
              <span className="text-operational">operations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              A systematic playbook for transforming static engineering digital twins into live, 
              sensor-connected operational twins — scalable across 40–50 simultaneous projects.
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowDown className="w-5 h-5 text-muted-foreground mx-auto" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <div id="twins">
        <TwinComparison />
      </div>
      <div id="gaps">
        <GapAnalysis />
      </div>
      <TransitionRequirements />
      <div id="outcomes">
        <MetricsBar />
      </div>
      <div id="phases">
        <PhaseTracker />
      </div>
      <EngagementTimeline />

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6 text-center text-sm text-muted-foreground">
        <p>TwinBridge — Engineering to Operational Twin Transition Playbook</p>
        <p className="text-xs mt-1">Based on JoulesToWatts methodology for Fluor Corporation</p>
      </footer>
    </div>
  );
};

export default Index;

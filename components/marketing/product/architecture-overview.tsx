// components/custom/product/architecture-overview.tsx
"use client";

import { motion } from "motion/react";
import {
  Code2,
  Database,
  Sparkles,
  Brain,
  Shield,
  Users,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    icon: Code2,
    title: "SDK",
    description: "Lightweight instrumentation",
    color: "text-blue-500",
  },
  {
    icon: Database,
    title: "Ingestion",
    description: "Real-time data processing",
    color: "text-indigo-500",
  },
  {
    icon: Sparkles,
    title: "Analysis",
    description: "Pattern recognition",
    color: "text-purple-500",
  },
  {
    icon: Brain,
    title: "AI",
    description: "Root cause explanation",
    color: "text-pink-500",
  },
  {
    icon: Shield,
    title: "Recommendation",
    description: "Safe recovery steps",
    color: "text-orange-500",
  },
  {
    icon: Users,
    title: "Human Approval",
    description: "Final verification",
    color: "text-green-500",
  },
];

export const ArchitectureOverview = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Architecture <span className="text-primary">Overview</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From detection to recovery - a complete pipeline for system reliability
          </p>
        </motion.div>

        {/* Pipeline visualization */}
        <div className="relative">
          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center p-4">
                  {/* Icon with pulse effect */}
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-background border-2 border-border flex items-center justify-center relative z-10`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.08,
                      }}
                      className="absolute inset-0 bg-primary/20 rounded-2xl blur-md"
                    />
                  </div>

                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-3 text-muted-foreground/30 z-20">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Flow line background */}
          <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-y-1/2 hidden lg:block" />
        </div>

        {/* Additional context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 rounded-2xl bg-background/50 border border-border/50"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-primary mb-2">Lightweight SDK</h4>
              <p className="text-sm text-muted-foreground">
                &lt; 5% CPU overhead, sub-millisecond latency
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Real-time Processing</h4>
              <p className="text-sm text-muted-foreground">
                &lt; 100ms from detection to recommendation
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-2">Audit Trail</h4>
              <p className="text-sm text-muted-foreground">
                Complete history of all decisions and actions
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
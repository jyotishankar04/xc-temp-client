// components/custom/how-it-works/technical-specs.tsx
"use client";

import { motion } from "motion/react";
import {
  Gauge,
  Clock,
  Shield,
  Lock,
  Cpu,
  Network,
  HardDrive,
  Zap
} from "lucide-react";

const specs = [
  {
    icon: Cpu,
    title: "Performance",
    items: [
      { label: "CPU Overhead", value: "< 5%" },
      { label: "Memory Impact", value: "< 50MB" },
      { label: "Latency", value: "< 1ms" },
    ],
    color: "text-blue-500",
  },
  {
    icon: Network,
    title: "Data & Network",
    items: [
      { label: "Payload Size", value: "~2KB per event" },
      { label: "Batch Interval", value: "100ms" },
      { label: "Retry Policy", value: "Exponential backoff" },
    ],
    color: "text-purple-500",
  },
  {
    icon: Shield,
    title: "Security",
    items: [
      { label: "Encryption", value: "TLS 1.3" },
      { label: "Authentication", value: "API keys + JWT" },
      { label: "Compliance", value: "SOC2, GDPR" },
    ],
    color: "text-green-500",
  },
  {
    icon: HardDrive,
    title: "Storage",
    items: [
      { label: "Retention", value: "30 days default" },
      { label: "Compression", value: "Gzip, ratio 10:1" },
      { label: "Backup", value: "Multi-region" },
    ],
    color: "text-orange-500",
  },
];

export const TechnicalSpecs = () => {
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
            Technical{" "}
            <span className="text-primary">specifications</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for scale, designed for performance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {specs.map((spec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center`}>
                  <spec.icon className={`w-5 h-5 ${spec.color}`} />
                </div>
                <h3 className="text-xl font-semibold">{spec.title}</h3>
              </div>

              <div className="space-y-3">
                {spec.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "99.99%", sub: "Uptime SLA" },
            { label: "< 100ms", sub: "Time to insight" },
            { label: "50+", sub: "Languages/frameworks" },
            { label: "10k+", sub: "Events/second" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-muted/30 border border-border/50">
              <div className="text-2xl font-bold text-primary">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
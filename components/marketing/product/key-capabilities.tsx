// components/custom/product/key-capabilities.tsx
"use client";

import { motion } from "motion/react";
import {
  AlertCircle,
  Search,
  Brain,
  Shield,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const capabilities = [
  {
    icon: AlertCircle,
    title: "Failure Detection",
    description: "Capture real-time failures using lightweight SDK with minimal overhead. Instantly detect anomalies across your entire stack.",
    color: "from-red-500/20 to-red-500/5",
    border: "border-red-500/20",
    iconColor: "text-red-500",
  },
  {
    icon: Search,
    title: "Root Cause Analysis",
    description: "AI explains what actually caused the failure with natural language insights. No more digging through endless logs.",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    icon: Brain,
    title: "Decision Engine",
    description: "Recommends safe, context-aware recovery steps based on historical patterns and system state analysis.",
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/20",
    iconColor: "text-purple-500",
  },
  {
    icon: Shield,
    title: "Controlled Recovery",
    description: "Trigger automated rollbacks and recovery actions with human approval gates at every critical step.",
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/20",
    iconColor: "text-green-500",
  },
];

export const KeyCapabilities = () => {
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
            Key <span className="text-primary">Capabilities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to understand and recover from failures, powered by AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((capability, index) => (
            <Card className="gap-0">
              {/* Icon */}
              <CardHeader>

                <div className={`w-10 h-10 rounded-xl bg-background/80 border ${capability.border} flex items-center justify-center mb-6 relative z-10`}>
                  <capability.icon className={`w-6 h-6 ${capability.iconColor}`} />
                </div>
              </CardHeader>

              <CardContent>

                {/* Content */}
                <h3 className="text-2xl font-semibold mb-3 relative z-10">
                  {capability.title}
                </h3>
              </CardContent>
              <CardFooter>

                <p className="text-muted-foreground leading-relaxed relative z-10">
                  {capability.description}
                </p>
              </CardFooter>

              {/* Learn more link */}
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative corner gradient */}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
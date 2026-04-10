// components/custom/product/value-proposition.tsx
"use client";

import { motion } from "motion/react";
import { ArrowRight, Eye, Zap, Shield } from "lucide-react";

export const ValueProposition = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A decision layer between{" "}
            <span className="text-primary">observability and action</span>
          </h2>
        </motion.div>

        {/* Visual pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          {/* Pipeline visualization */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {/* Monitoring */}
            <div className="w-full md:w-1/3 flex flex-col items-center p-6">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Eye className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Monitoring</h3>
              <p className="text-sm text-muted-foreground text-center">
                Real-time observability data
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-muted-foreground">
              <ArrowRight className="w-8 h-8" />
            </div>
            <div className="block md:hidden text-muted-foreground rotate-90 my-2">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* X Tech (Our product) */}
            <div className="w-full md:w-1/3 flex flex-col items-center p-6 relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl -z-10" />

              <div className="w-24 h-24 rounded-2xl bg-primary border-2 border-primary/50 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <Zap className="w-12 h-12 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">XecureCode</h3>
              <p className="text-sm text-muted-foreground text-center">
                AI decision layer
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-muted-foreground">
              <ArrowRight className="w-8 h-8" />
            </div>
            <div className="block md:hidden text-muted-foreground rotate-90 my-2">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Recovery */}
            <div className="w-full md:w-1/3 flex flex-col items-center p-6">
              <div className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Recovery</h3>
              <p className="text-sm text-muted-foreground text-center">
                Safe automated actions
              </p>
            </div>
          </div>

          {/* Connecting lines (desktop) */}
          <svg className="hidden md:block absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none">
            <line
              x1="25%"
              y1="50%"
              x2="38%"
              y2="50%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="text-muted-foreground/30"
            />
            <line
              x1="62%"
              y1="50%"
              x2="75%"
              y2="50%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="text-muted-foreground/30"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};
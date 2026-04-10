// components/custom/how-it-works/hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export const HowItWorksHero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-6">
            <span className="text-sm font-mono text-muted-foreground tracking-wider bg-muted/50 px-3 py-1 rounded-full">
              SIMPLE INTEGRATION
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            From detection to recovery
            <br />
            <span className="text-primary">in 4 simple steps</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Integrate our lightweight SDK in minutes, and let AI handle the rest.
            No complex setup, no configuration headaches.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/docs">
              <Button size="lg" className="rounded-full px-8 text-base gap-2">
                See Integration Guide
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base gap-2">
                <Play className="w-4 h-4" />
                Watch 2-min Demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center gap-8 mt-16"
          >
            {[
              { label: "5-min setup", value: "Average" },
              { label: "AI-powered", value: "Real-time" },
              { label: "Zero config", value: "Auto-instrumentation" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-sm font-medium text-primary">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
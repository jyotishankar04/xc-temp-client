// components/custom/product/product-hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const ProductHero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mb-6">
            <span className="text-sm font-mono text-muted-foreground tracking-wider">
              XECURECODE
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-5xl md:text-7xl font-medium mb-6 tracking-tight"
          >
            AI-powered reliability
            <br />
            <span className="text-muted-foreground">for production systems</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-sm text-muted-foreground max-w-xl mx-auto mb-10"
          >
            Understand failures, explain root causes,
            and guide safe recovery actions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Link href={"/waitlist"}>
              <Button
                size="lg"
                className="rounded-full px-6 py-5 text-sm"
              >
                Join Waitlist
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>

            <Link href={"/contact"}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6 py-5 text-sm"
              >
                Contact Sales
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
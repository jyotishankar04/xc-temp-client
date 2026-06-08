// components/custom/product/product-cta.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const ProductCTA = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mb-4">
            <span className="text-sm font-mono text-muted-foreground tracking-wider">
              PRODUCT UPDATES
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-medium mb-4">
            Ready to transform your
            <br />
            <span className="text-primary">
              production reliability?
            </span>
          </h2>

          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            Subscribe for product updates, beta notes, and reliability workflow guides.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/subscribe"
            >
              <Button>
                Subscribe for Updates
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link
              href={"/contact"}
            >
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6 py-5 text-sm"
              >
                Contact Sales
              </Button>
            </Link>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xs text-muted-foreground"
          >
            Updates are occasional and easy to unsubscribe from.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

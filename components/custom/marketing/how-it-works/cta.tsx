// components/custom/how-it-works/cta.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Code2, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const HowItWorksCTA = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
            <CardContent className="p-12 text-center">
              <Badge variant="outline" className="mb-6 px-3 py-1 text-xs font-mono">
                GET STARTED TODAY
              </Badge>

              <div className="flex justify-center gap-3 mb-8">
                {[Code2, Sparkles, Users].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-xl text-primary font-medium mb-6">
                Integrate in minutes
              </p>

              <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                Join hundreds of engineering teams using XecureCode to sleep better at night.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/docs">
                  <Button size="lg" className="rounded-full px-8 text-base gap-2">
                    Start Integrating
                    <Code2 className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full px-8 text-base gap-2">
                    Talk to an Engineer
                    <Users className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {["Documentation", "API Reference", "GitHub", "Community"].map((link, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                  >
                    {link}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
// components/custom/product/safety-trust.tsx
"use client";

import { motion } from "motion/react";
import {
  Shield,
  Users,
  FileText,
  CheckCircle,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Human-in-the-loop approvals",
    description: "Every critical action requires explicit human confirmation before execution.",
  },
  {
    icon: Shield,
    title: "No automatic actions",
    description: "We recommend, you decide. Full control stays with your team.",
  },
  {
    icon: FileText,
    title: "Full audit logs",
    description: "Complete traceability of every detection and action taken.",
  },
  {
    icon: Lock,
    title: "Enterprise-grade security",
    description: "SOC2 compliant with end-to-end encryption.",
  },
];

export const SafetyTrust = () => {
  return (
    <section className="py-24 group px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-6">
              <span className="text-sm font-mono text-muted-foreground tracking-wider">
                SAFETY
              </span>
            </div>

            <h2 className="text-3xl font-semibold md:text-4xl font-medium mb-4">
              Built for
              <span className="text-primary"> safety & trust</span>
            </h2>

            <p className="text-sm text-muted-foreground mb-8">
              We believe AI should augment human decision-making, not replace it.
              That's why every recommendation requires human approval.
            </p>

            <div className="space-y-3">
              {[
                "100% human control over recovery actions",
                "Comprehensive audit trails for compliance",
                "Enterprise-grade security by default",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="p-5 rounded-lg border group-hover:border-primary/30 border-border  bg-background hover:border-primary/50 hover:bg-primary/5 duration-300"
              >
                <feature.icon className="w-4 h-4 text-muted-foreground mb-3" />
                <h3 className="text-sm font-medium mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="mt-12 flex flex-wrap justify-center gap-6 items-center"
        >
          {["SOC2", "GDPR", "HIPAA", "ISO 27001"].map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-xs font-mono text-muted-foreground/60">{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
"use client";

import { Wrench } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "@/components/shared/branding";
import { PlatformStatusCard, PlatformStatusShell } from "@/components/shared/platform-status-card";

export function MaintenancePage({ message }: { message?: string | null }) {
  return (
    <PlatformStatusShell>
      <PlatformStatusCard
        variant="maintenance"
        icon={Wrench}
        title="XecureCode is under maintenance"
        subtitle={message || "We're making a few updates and will be back shortly."}
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          className="flex flex-col items-center gap-3"
        >
          <Logo className="size-12" />
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Systems updating
          </p>
        </motion.div>
      </PlatformStatusCard>
    </PlatformStatusShell>
  );
}

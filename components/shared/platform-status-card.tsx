"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import AnimatedGridPattern from "@/components/marketing/landing/background-grid-pattern";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type PlatformStatusVariant = "launch-major" | "launch-minor" | "maintenance";

const variantConfig = {
  "launch-major": {
    badge: "Major Launch",
    iconClass: "bg-primary/10 text-primary ring-primary/20",
    glow: "from-primary/25 via-primary/5 to-transparent",
    accent: "bg-primary",
  },
  "launch-minor": {
    badge: "Coming Soon",
    iconClass: "bg-primary/10 text-primary ring-primary/20",
    glow: "from-primary/20 via-primary/5 to-transparent",
    accent: "bg-primary",
  },
  maintenance: {
    badge: "Maintenance",
    iconClass: "bg-muted text-muted-foreground ring-border",
    glow: "from-muted-foreground/15 via-muted/30 to-transparent",
    accent: "bg-muted-foreground/60",
  },
} as const;

export function PlatformStatusShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />
      <AnimatedGridPattern
        className="mask-[radial-gradient(600px_circle_at_center,white,transparent)] inset-x-0 h-full opacity-60"
        duration={4}
        maxOpacity={0.12}
        numSquares={24}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 size-72 translate-x-1/4 translate-y-1/4 rounded-full bg-primary/6 blur-3xl" />
      <div className="relative z-10 w-full">{children}</div>
    </main>
  );
}

export function PlatformStatusCard({
  variant,
  icon: Icon,
  title,
  subtitle,
  features,
  children,
  footer,
  className,
  size = "default",
}: {
  variant: PlatformStatusVariant;
  icon: LucideIcon;
  title: string;
  subtitle?: string | null;
  features?: string[];
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  size?: "default" | "compact";
}) {
  const config = variantConfig[variant];
  const isCompact = size === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-2xl bg-card/80 text-card-foreground shadow-xl ring-1 ring-foreground/10 backdrop-blur-sm",
        isCompact ? "max-w-lg" : "max-w-2xl",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b",
          config.glow
        )}
      />
      <div className={cn("pointer-events-none absolute inset-x-8 top-0 h-px", config.accent, "opacity-40")} />

      <div className={cn("relative flex flex-col items-center text-center", isCompact ? "gap-5 p-8" : "gap-6 p-10 sm:p-12")}>
        <Badge variant="outline" className="rounded-full px-3 py-1 font-medium tracking-wide">
          {config.badge}
        </Badge>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 260, damping: 20 }}
          className={cn(
            "flex items-center justify-center rounded-2xl ring-1",
            config.iconClass,
            isCompact ? "size-14" : "size-16"
          )}
        >
          <Icon className={isCompact ? "size-7" : "size-8"} />
        </motion.div>

        <div className="flex flex-col gap-3">
          <h1
            className={cn(
              "font-semibold tracking-tight text-balance",
              isCompact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={cn("text-muted-foreground text-balance", isCompact ? "text-sm sm:text-base" : "text-base sm:text-lg")}>
              {subtitle}
            </p>
          )}
        </div>

        {children}

        {features && features.length > 0 && (
          <div className="w-full rounded-xl border bg-muted/40 p-5 text-left">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              What&apos;s coming
            </p>
            <ul className={cn("grid gap-3", !isCompact && "sm:grid-cols-2")}>
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-start gap-3 text-sm"
                >
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {footer && (
          <>
            <Separator className="w-full" />
            <div className="flex w-full justify-center">{footer}</div>
          </>
        )}
      </div>
    </motion.div>
  );
}

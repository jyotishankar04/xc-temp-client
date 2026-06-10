"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import AnimatedGridPattern from "@/components/marketing/landing/background-grid-pattern";
import { LaunchHeroCountdown } from "@/components/shared/launch-hero-countdown";
import { LaunchWaitlistForm } from "@/components/shared/launch-waitlist-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import type { PublicLaunch } from "@/lib/api/platform";
import { cn } from "@/lib/utils";
import { markLiveLaunchSeen } from "@/lib/utils/launch-seen";

const sparkles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 23) % 84)}%`,
  top: `${10 + ((index * 31) % 76)}%`,
  delay: (index % 9) * 0.12,
  size: 6 + (index % 4) * 3,
}));

const subtleSparkles = sparkles.slice(0, 12);

export function MajorLaunchPage({
  launch,
  signupEnabled = true,
}: {
  launch: PublicLaunch;
  signupEnabled?: boolean;
}) {
  const router = useRouter();
  const targetDate = new Date(launch.targetDate);
  const [isLive, setIsLive] = useState(() => targetDate.getTime() <= Date.now());
  const [isSplitting, setIsSplitting] = useState(false);

  const handleVisitDashboard = useCallback(() => {
    if (isSplitting) {
      return;
    }

    markLiveLaunchSeen(launch.id);
    setIsSplitting(true);
    window.setTimeout(() => {
      router.push(ROUTES.HOME);
    }, 820);
  }, [isSplitting, launch.id, router]);

  useEffect(() => {
    if (isLive) {
      markLiveLaunchSeen(launch.id);
    }
  }, [isLive, launch.id]);

  return (
    <motion.main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground"
      animate={{
        x: isSplitting ? "-110%" : "0%",
        opacity: isSplitting ? 0.82 : 1,
      }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <AnimatedGridPattern
        className={cn(
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 h-full skew-y-12"
        )}
        duration={3}
        maxOpacity={0.08}
        numSquares={30}
      />
      <AnimatePresence mode="wait" initial={false}>
        {isLive ? (
          <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden opacity-50" aria-hidden="true">
            {subtleSparkles.map((sparkle) => (
              <motion.span
                key={sparkle.id}
                className="absolute rounded-full bg-primary/70"
                style={{
                  left: sparkle.left,
                  top: sparkle.top,
                  width: Math.max(4, sparkle.size - 4),
                  height: Math.max(4, sparkle.size - 4),
                }}
                initial={{ opacity: 0, scale: 0.3, y: 18 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0.3, 1, 0.4],
                  y: [-6, -34, -52],
                }}
                exit={{ opacity: 0, scale: 0.3, y: 10 }}
                transition={{
                  duration: 1.5,
                  delay: sparkle.delay,
                  repeat: Infinity,
                  repeatDelay: 1.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </div>
        ) : null}
      </AnimatePresence>

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl border bg-card shadow-sm">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <span className="text-2xl font-semibold tracking-normal text-foreground">
            XecureCode
          </span>
        </div>

        <Badge variant="secondary" className="mt-10 rounded-full border-border px-4 py-1">
          <Rocket data-icon="inline-start" />
          {isLive ? "Now live" : launch.type === "MAJOR" ? "Major launch" : "Coming soon"}
        </Badge>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl md:text-6xl md:leading-[1.12] lg:text-7xl">
          {isLive ? (
            <>
              XecureCode is <span className="text-primary">live.</span>
            </>
          ) : (
            launch.title
          )}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-foreground/80 md:text-lg">
          {isLive
            ? `${launch.title} is now available. Continue to the landing page.`
            : launch.subtitle}
        </p>

        <div className="mt-12 w-full max-w-2xl">
          <LaunchHeroCountdown
            targetDate={targetDate}
            onLiveChange={setIsLive}
          />
        </div>

        {isLive ? (
          <div className="mt-10 flex flex-col items-center gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full px-8 text-base"
              onClick={handleVisitDashboard}
              disabled={isSplitting}
            >
              View Landing Page
              <ArrowRight data-icon="inline-end" />
            </Button>
            <p className="text-sm text-foreground/60">
              This launch message will only be shown once on this browser.
            </p>
          </div>
        ) : signupEnabled ? (
          <LaunchWaitlistForm className="mt-10" />
        ) : null}
      </section>
    </motion.main>
  );
}

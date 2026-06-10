"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { X, Rocket, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { LaunchCountdownCompact } from "@/components/shared/launch-countdown";
import { LaunchDialog } from "@/components/shared/launch-dialog";
import AnimatedGridPattern from "@/components/marketing/landing/background-grid-pattern";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import type { PublicAnnouncement, PublicLaunch } from "@/lib/api/platform";
import { cn } from "@/lib/utils";
import { hasSeenLiveLaunch, isLaunchLive, markLiveLaunchSeen } from "@/lib/utils/launch-seen";

const liveSparkles = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: `${10 + ((index * 29) % 80)}%`,
  top: `${12 + ((index * 19) % 74)}%`,
  delay: (index % 7) * 0.13,
  size: 5 + (index % 4) * 3,
}));

const subtleLiveSparkles = liveSparkles.slice(0, 10);

export function AnnouncementBar({
  announcement,
  activeLaunch,
}: {
  announcement: PublicAnnouncement | null;
  activeLaunch: PublicLaunch | null;
}) {
  const router = useRouter();
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const [launchVisible, setLaunchVisible] = useState(false);
  const [launchIsLive, setLaunchIsLive] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const showingLiveLaunchRef = useRef(false);

  useEffect(() => {
    if (!announcement) {
      setAnnouncementVisible(false);
      return;
    }
    const dismissed = window.localStorage.getItem(`announcement:${announcement.id}`);
    setAnnouncementVisible(dismissed !== "dismissed");
  }, [announcement]);

  useEffect(() => {
    if (!activeLaunch || activeLaunch.type !== "MINOR" || !activeLaunch.active) {
      showingLiveLaunchRef.current = false;
      setLaunchVisible(false);
      setLaunchIsLive(false);
      return;
    }

    const updateLaunchState = () => {
      const live = isLaunchLive(activeLaunch);
      const seen = hasSeenLiveLaunch(activeLaunch.id);

      setLaunchIsLive(live);

      if (!live) {
        showingLiveLaunchRef.current = false;
        setLaunchVisible(true);
        return;
      }

      if (seen && !showingLiveLaunchRef.current) {
        setLaunchVisible(false);
        return;
      }

      showingLiveLaunchRef.current = true;
      markLiveLaunchSeen(activeLaunch.id);
      setLaunchVisible(true);
    };

    updateLaunchState();
    const id = window.setInterval(updateLaunchState, 1000);

    return () => window.clearInterval(id);
  }, [activeLaunch]);

  const dismissAnnouncement = () => {
    if (!announcement) return;
    window.localStorage.setItem(`announcement:${announcement.id}`, "dismissed");
    setAnnouncementVisible(false);
  };

  const showLaunch = activeLaunch && activeLaunch.type === "MINOR" && activeLaunch.active && launchVisible && !launchIsLive;
  const showLiveLaunch = activeLaunch && activeLaunch.type === "MINOR" && activeLaunch.active && launchVisible && launchIsLive;
  const showAnnouncement = announcement && announcementVisible;

  const visitDashboard = () => {
    if (!activeLaunch || isSplitting) {
      return;
    }

    markLiveLaunchSeen(activeLaunch.id);
    showingLiveLaunchRef.current = false;
    setLaunchVisible(false);
    setIsSplitting(true);
    window.setTimeout(() => {
      router.push(ROUTES.HOME);
    }, 820);
  };

  if (!showLaunch && !showLiveLaunch && !showAnnouncement) return null;

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {showLiveLaunch ? (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: isSplitting ? 0.82 : 1, x: isSplitting ? "-110%" : "0%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: isSplitting ? 0.8 : 0.35, ease: isSplitting ? [0.76, 0, 0.24, 1] : [0.22, 1, 0.36, 1] }}
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
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70" aria-hidden="true">
              {subtleLiveSparkles.map((sparkle) => (
                <motion.span
                  key={sparkle.id}
                  className="absolute rounded-full bg-primary/70"
                  style={{
                    left: sparkle.left,
                    top: sparkle.top,
                    width: Math.max(4, sparkle.size - 3),
                    height: Math.max(4, sparkle.size - 3),
                  }}
                  initial={{ opacity: 0, scale: 0.3, y: 18 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0.3, 1, 0.35],
                    y: [-4, -32, -50],
                  }}
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
            <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl border bg-card shadow-sm">
                  <ShieldCheck className="size-6 text-primary" />
                </div>
                <span className="text-2xl font-semibold tracking-normal text-foreground">
                  XecureCode
                </span>
              </div>

              <BadgeLike className="mt-10">
                <Sparkles className="size-4" />
                Now live
              </BadgeLike>
              <h2 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl md:text-6xl md:leading-[1.12]">
                {activeLaunch.title}
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-foreground/80 md:text-lg">
                {activeLaunch.subtitle ?? "The launch is now available for users."}
              </p>
              <Button
                size="lg"
                className="mt-10 h-12 rounded-full px-8 text-base"
                onClick={visitDashboard}
                disabled={isSplitting}
              >
                View Landing Page
                <ArrowRight data-icon="inline-end" />
              </Button>
              <p className="mt-4 text-sm text-foreground/60">
                This launch message will only be shown once on this browser.
              </p>
            </section>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {(showLaunch || showAnnouncement) && (
        <motion.div
          initial={{ y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-primary-foreground/10 bg-primary/95 px-4 py-3 text-primary-foreground shadow-lg backdrop-blur-md"
        >
          <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm">
            {showLaunch && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
                  <Sparkles className="size-3" />
                  Coming Soon
                </span>
                <span className="inline-flex items-center gap-2 font-semibold">
                  <Rocket className="size-4" />
                  {activeLaunch.title}
                </span>
                <LaunchCountdownCompact targetDate={new Date(activeLaunch.targetDate)} />
                <LaunchDialog launch={activeLaunch} />
              </div>
            )}

            {showAnnouncement && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="font-semibold">{announcement.title}</span>
                <span className="text-primary-foreground/85">{announcement.message}</span>
                <button
                  onClick={dismissAnnouncement}
                  className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full p-1.5 opacity-70 transition-opacity hover:bg-primary-foreground/10 hover:opacity-100"
                  aria-label="Dismiss announcement"
                >
                  <X className="size-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}

function BadgeLike({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-primary shadow-sm ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

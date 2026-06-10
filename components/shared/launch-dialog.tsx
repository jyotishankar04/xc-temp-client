"use client";

import { Rocket } from "lucide-react";
import { LaunchCountdown } from "@/components/shared/launch-countdown";
import { PlatformStatusCard } from "@/components/shared/platform-status-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PublicLaunch } from "@/lib/api/platform";

export function LaunchDialog({ launch }: { launch: PublicLaunch }) {
  const targetDate = new Date(launch.targetDate);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-full bg-primary-foreground/15 px-3 text-xs font-medium text-primary-foreground hover:bg-primary-foreground/25 hover:text-primary-foreground"
        >
          <Rocket data-icon="inline-start" />
          View Launch
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{launch.title}</DialogTitle>
        <PlatformStatusCard
          variant="launch-minor"
          icon={Rocket}
          title={launch.title}
          subtitle={launch.subtitle}
          features={launch.features}
          size="compact"
          className="shadow-2xl"
        >
          <LaunchCountdown targetDate={targetDate} variant="display" label="Countdown" />
        </PlatformStatusCard>
      </DialogContent>
    </Dialog>
  );
}

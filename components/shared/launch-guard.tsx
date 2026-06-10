"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MajorLaunchPage } from "@/components/shared/major-launch-page";
import type { PublicLaunch } from "@/lib/api/platform";
import { hasSeenLiveLaunch, isLaunchLive } from "@/lib/utils/launch-seen";

const EXEMPT_PREFIXES = ["/admin", "/app", "/auth", "/api", "/docs"];

function isExempt(pathname: string) {
  return EXEMPT_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function LaunchGuard({
  activeLaunch,
  signupEnabled = true,
  children,
}: {
  activeLaunch: PublicLaunch | null;
  signupEnabled?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [seenLiveLaunch, setSeenLiveLaunch] = useState(false);

  useEffect(() => {
    if (!activeLaunch || !isLaunchLive(activeLaunch)) {
      setSeenLiveLaunch(false);
      return;
    }

    setSeenLiveLaunch(hasSeenLiveLaunch(activeLaunch.id));
  }, [activeLaunch, pathname]);

  if (!activeLaunch || activeLaunch.type !== "MAJOR" || !activeLaunch.active) {
    return children;
  }

  if (isExempt(pathname) || (isLaunchLive(activeLaunch) && seenLiveLaunch)) {
    return children;
  }

  return <MajorLaunchPage launch={activeLaunch} signupEnabled={signupEnabled} />;
}

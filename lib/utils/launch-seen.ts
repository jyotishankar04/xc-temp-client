import type { PublicLaunch } from "@/lib/api/platform";

export function isLaunchLive(launch: Pick<PublicLaunch, "targetDate">) {
  return new Date(launch.targetDate).getTime() <= Date.now();
}

export function getLaunchSeenKey(id: string) {
  return `launch-live-seen:${id}`;
}

export function hasSeenLiveLaunch(id: string) {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(getLaunchSeenKey(id)) === "seen";
}

export function markLiveLaunchSeen(id: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getLaunchSeenKey(id), "seen");
}

"use client";

import { usePathname } from "next/navigation";
import { MaintenancePage } from "@/components/marketing/landing/maintenance-page";

const BLOCKED_PREFIXES = ["/auth", "/app", "/onboard", "/launch"];

function isBlocked(pathname: string) {
  return BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function MaintenanceGuard({
  maintenanceMessage,
  children,
}: {
  maintenanceMessage?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (isBlocked(pathname)) {
    return <MaintenancePage message={maintenanceMessage} />;
  }

  return children;
}

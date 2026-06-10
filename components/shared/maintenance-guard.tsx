"use client";

import { usePathname } from "next/navigation";
import { MaintenancePage } from "@/components/marketing/landing/maintenance-page";

const EXEMPT_PREFIXES = ["/admin", "/docs"];

function isExempt(pathname: string) {
  return EXEMPT_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function MaintenanceGuard({
  maintenanceMessage,
  children,
}: {
  maintenanceMessage?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (isExempt(pathname)) {
    return children;
  }

  return <MaintenancePage message={maintenanceMessage} />;
}

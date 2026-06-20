"use client";

import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AppShell } from "@/components/dashboard/app-shell";

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {mounted ? (
          <DashboardSidebar />
        ) : (
          <div className="hidden w-[16rem] shrink-0 md:block" aria-hidden="true" />
        )}
        <AppShell>{children}</AppShell>
      </div>
    </SidebarProvider>
  );
}

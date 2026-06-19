"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Boxes, LayoutDashboard, Settings2, Key, Users, ChevronRight, RotateCcw, Package } from "lucide-react";
import { useServiceById } from "@/lib/hooks";
import { Loader2 } from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", href: "/overview", icon: LayoutDashboard },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings2 },
  { id: "deployments", label: "Deployments", href: "/deployments", icon: Package },
  { id: "api-keys", label: "API Keys", href: "/api-keys", icon: Key },
  { id: "rollback", label: "Rollback", href: "/rollback", icon: RotateCcw },
  { id: "members", label: "Members", href: "/members", icon: Users },
];

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const serviceId = params?.serviceId as string;
  const pathname = usePathname();

  const { data: service, isLoading } = useServiceById(serviceId);

  const currentTab = tabs.find((tab) => pathname.endsWith(tab.href))?.id || "overview";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/app/dashboard/services"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Boxes className="size-4" />
            Services
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground font-medium">
            {service?.name || "Service"}
          </span>
          <ChevronRight className="size-4" />
          <span className="text-foreground capitalize">{currentTab}</span>
        </div>

        <Tabs value={currentTab} className="w-full" orientation="horizontal">
          <TabsList variant="line" className="h-auto p-0 border-b bg-transparent gap-1">
            {tabs.map((tab) => {
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  asChild
                  className="px-3 py-2 border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-2"
                >
                  <Link href={`/app/dashboard/services/${serviceId}${tab.href}`}>
                    <tab.icon className="size-4" />
                    {tab.label}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div>{children}</div>
    </div>
  );
}

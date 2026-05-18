"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, LayoutDashboard, AlertTriangle, Brain, Zap, Boxes, Settings2, Users, FileText, Cog, Activity, FileSearch } from "lucide-react";

export type Route = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  link: string;
  badge?: string;
  subs?: {
    title: string;
    link: string;
    icon?: React.ReactNode;
  }[];
};

const defaultRoutes: Route[] = [
  {
    id: "overview",
    title: "Overview",
    icon: <LayoutDashboard className="size-4" />,
    link: "/app/dashboard",
  },
  {
    id: "failures",
    title: "Failures",
    icon: <AlertTriangle className="size-4" />,
    link: "/app/dashboard/failures",
  },
  {
    id: "analysis",
    title: "Analysis",
    icon: <Brain className="size-4" />,
    link: "/app/dashboard/analysis",
  },
  {
    id: "actions",
    title: "Actions",
    icon: <Zap className="size-4" />,
    link: "/app/dashboard/actions",
  },
  {
    id: "services",
    title: "Services",
    icon: <Boxes className="size-4" />,
    link: "/app/dashboard/services",
    subs: [
      { title: "All Services", link: "/app/dashboard/services" },
    ],
  },
  {
    id: "events",
    title: "Events",
    icon: <Activity className="size-4" />,
    link: "/app/dashboard/events",
  },
  {
    id: "rca",
    title: "RCA",
    icon: <FileSearch className="size-4" />,
    link: "/app/dashboard/rca",
  },
  {
    id: "team",
    title: "Team",
    icon: <Users className="size-4" />,
    link: "/app/dashboard/team",
  },
  {
    id: "audit",
    title: "Audit Log",
    icon: <FileText className="size-4" />,
    link: "/app/dashboard/audit",
  },
  {
    id: "setup",
    title: "Setup",
    icon: <Settings2 className="size-4" />,
    link: "/app/dashboard/setup",
  },
];

const bottomRoutes: Route[] = [
  {
    id: "settings",
    title: "Settings",
    icon: <Cog className="size-4" />,
    link: "/app/dashboard/settings",
  },
];

export default function DashboardNavigation({
  routes = defaultRoutes,
}: {
  routes?: Route[];
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();
  const [openCollapsible, setOpenCollapsible] = React.useState<string | null>(null);

  const renderMenuItem = (route: Route, isSub = false) => {
    // Exact-match for the overview route to avoid false highlights on all sub-pages
    const isActive =
      route.link === "/app/dashboard"
        ? pathname === route.link
        : pathname === route.link || pathname.startsWith(route.link + "/");
    const hasSubRoutes = !!route.subs?.length;
    const isOpen = !isCollapsed && openCollapsible === route.id;

    if (hasSubRoutes) {
      return (
        <Collapsible
          key={route.id}
          open={isOpen}
          onOpenChange={(open) =>
            setOpenCollapsible(open ? route.id : null)
          }
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={route.title}
              className={cn(
                "w-full",
                isCollapsed && "justify-center"
              )}
            >
              {route.icon}
              {!isCollapsed && (
                <span className="flex-1 text-sm font-medium">{route.title}</span>
              )}
              {route.badge && !isCollapsed && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-primary/10 px-1 text-xs font-medium text-primary">
                  {route.badge}
                </span>
              )}
              {!isCollapsed && (
                <span className="ml-auto">
                  {isOpen ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </span>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {!isCollapsed && (
            <CollapsibleContent>
              <SidebarMenuSub className="my-1">
                {route.subs?.map((sub) => (
                  <SidebarMenuSubItem key={sub.title}>
                    <SidebarMenuSubButton asChild isActive={pathname === sub.link}>
                      <Link href={sub.link} prefetch>
                        {sub.icon}
                        {sub.title}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }

    return (
      <SidebarMenuItem key={route.id}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={route.title}
          className={cn(isCollapsed && "justify-center")}
        >
          <Link href={route.link} prefetch>
            {route.icon}
            {!isCollapsed && <span className="text-sm font-medium">{route.title}</span>}
            {route.badge && !isCollapsed && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-primary/10 px-1 text-xs font-medium text-primary">
                {route.badge}
              </span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <SidebarMenu>
        {routes.map((route) => renderMenuItem(route))}
      </SidebarMenu>

      <SidebarMenu>
        {bottomRoutes.map((route) => renderMenuItem(route))}
      </SidebarMenu>
    </div>
  );
}

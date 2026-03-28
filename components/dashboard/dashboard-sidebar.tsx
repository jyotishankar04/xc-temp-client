"use client";

import * as React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Building2,
  ChevronDown,
  LogOut,
  Moon,
  PanelLeftClose,
  PanelLeftIcon,
  PanelLeftOpen,
  Plus,
  Settings,
  Sun,
  User,
} from "lucide-react";
import DashboardNavigation from "./nav-main";
import { NotificationsPopover } from "./nav-notifications";

const sampleNotifications = [
  {
    id: "1",
    fallback: "AI",
    text: "AI analysis completed for Case #142",
    time: "2 min ago",
  },
  {
    id: "2",
    fallback: "SY",
    text: "System health score dropped to 82%",
    time: "5 min ago",
  },
  {
    id: "3",
    fallback: "RP",
    text: "Recovery action approved: Rollback",
    time: "10 min ago",
  },
];

type Team = {
  id: string;
  name: string;
  slug: string;
  plan: string;
};

const defaultTeams: Team[] = [
  { id: "1", name: "Acme Inc.", slug: "acme", plan: "Free" },
  { id: "2", name: "Beta Corp.", slug: "beta", plan: "Free" },
  { id: "3", name: "Gamma Tech", slug: "gamma", plan: "Pro" },
];

const currentUser = {
  name: "Rahul Verma",
  role: "Founder",
  email: "rahul@acme.com",
  initials: "RV",
};

export function DashboardSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [activeTeam, setActiveTeam] = React.useState(defaultTeams[0]);
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  return (
    <Sidebar variant="floating" collapsible="icon" className="border-r-0">
      <SidebarHeader className="flex flex-row items-center justify-between px-3 pt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-auto p-1.5 hover:bg-sidebar-accent w-full justify-start data-[state=open]:bg-sidebar-accent"
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                <Building2 className="size-4" />
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    <span className="text-sm font-semibold truncate max-w-[120px]">
                      {activeTeam.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                      {activeTeam.plan}
                    </span>
                  </div>
                  <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-lg" align="start">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch organization
            </DropdownMenuLabel>
            {defaultTeams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-background shrink-0">
                  <Building2 className="size-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">{team.name}</span>
                  <span className="text-[10px] text-muted-foreground">{team.plan}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background shrink-0">
                <Plus className="size-3.5" />
              </div>
              <span className="text-sm text-muted-foreground">Create new org</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </SidebarHeader>

      <SidebarContent className="gap-4 px-3 py-4">
        <DashboardNavigation />
      </SidebarContent>

      <SidebarFooter className="px-3 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
              tabIndex={0}
            >
              {isCollapsed ? (
                <div className="flex items-center gap-2 justify-center">
                  <PanelLeftOpen className="size-4" />
                  <span className="">Open sidebar</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <PanelLeftClose className="size-4" />
                  <span className="">Collapse sidebar</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-auto py-2"
                >
                  <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {currentUser.initials}
                  </div>
                  {!isCollapsed && (
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                      <span className="truncate font-medium">
                        {currentUser.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {currentUser.role}
                      </span>
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 rounded-lg"
                align="end"
                side="right"
                sideOffset={8}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {currentUser.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                  <User className="size-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                  <Building2 className="size-4" />
                  Organization
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 p-2 cursor-pointer"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                  <Settings className="size-4" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 p-2 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

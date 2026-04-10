"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import DashboardNavigation from "./nav-main";
import { NotificationsPopover } from "./nav-notifications";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/hooks/use-auth";
import { OrgSwitcher } from "./org-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function DashboardSidebar() {
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { user } = useAuth();
  const { theme: currentTheme, setTheme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar variant="floating" collapsible="icon" className="border-r-0">
      <SidebarHeader className="flex flex-row items-center justify-between px-3 pt-3">
        <OrgSwitcher isCollapsed={isCollapsed} />
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
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name || user?.email || "User"} />
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : user?.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                      <span className="truncate font-medium">
                        {user?.name || user?.username || "User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email || ""}
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
                  {user?.email || ""}
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
                  onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                >
                  {currentTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
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

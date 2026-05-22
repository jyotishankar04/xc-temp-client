"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  Building2,
  ChevronDown,
  Plus,
  Loader2,
  Settings,
} from "lucide-react";
import { useOrgs, useCurrentOrg, useSwitchOrg } from "@/lib/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface OrgSwitcherProps {
  isCollapsed?: boolean;
}

export function OrgSwitcher({ isCollapsed = false }: OrgSwitcherProps) {
  const router = useRouter();
  const { data: orgs = [], isLoading: isOrgsLoading } = useOrgs();
  const { data: currentOrg, isLoading: isCurrentOrgLoading } = useCurrentOrg();
  const switchOrg = useSwitchOrg();

  const queryClient = useQueryClient();
  const [isSwitching, setIsSwitching] = React.useState(false);

  const isLoading = isOrgsLoading || isCurrentOrgLoading;
  const activeOrg = currentOrg || orgs[0];

  const handleSwitchOrg = async (orgId: string) => {
    if (orgId === currentOrg?.id) return;
    setIsSwitching(true);
    try {
      await switchOrg.mutateAsync(orgId);
      // Invalidate all queries so components refetch data for the new org
      await queryClient.invalidateQueries();
      router.refresh();
    } catch (error) {
      console.error("Failed to switch org:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-1.5 hover:bg-sidebar-accent w-full justify-start data-[state=open]:bg-sidebar-accent"
        >
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Building2 className="size-4" />
            )}
          </div>
          {!isCollapsed && (
            <>
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="text-sm font-semibold truncate max-w-[120px]">
                  {activeOrg?.name || "No organization"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {activeOrg?.slug || ""}
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
        {isSwitching && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        {!isSwitching && orgs.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitchOrg(org.id)}
            className="gap-2 p-2 cursor-pointer"
          >
            <div className="flex size-6 items-center justify-center rounded-sm border bg-background shrink-0">
              <Building2 className="size-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm">{org.name}</span>
              <span className="text-[10px] text-muted-foreground">{org.slug}</span>
            </div>
            {org.id === currentOrg?.id && (
              <span className="ml-auto text-[10px] text-primary">Current</span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 p-2 cursor-pointer"
          onClick={() => router.push("/app/orgs/create")}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-background shrink-0">
            <Plus className="size-3.5" />
          </div>
          <span className="text-sm">Create new org</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 p-2 cursor-pointer"
          onClick={() => router.push("/app/orgs")}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-background shrink-0">
            <Settings className="size-3.5" />
          </div>
          <span className="text-sm">Manage orgs</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

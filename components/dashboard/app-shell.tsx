"use client";

import { BellIcon, SearchIcon, LogOut, Settings, Building2, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/use-auth";
import { adminApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const segmentLabels: Record<string, string> = {
  app: "App",
  dashboard: "Dashboard",
  events: "Events",
  failures: "Failure Cases",
  rca: "RCA Reports",
  actions: "Recovery Actions",
  analysis: "Analysis",
  audit: "Audit Log",
  services: "Services",
  settings: "Settings",
  team: "Team",
  setup: "Setup",
  orgs: "Organizations",
  create: "Create",
  overview: "Overview",
  members: "Members",
  "api-keys": "API Keys",
  correlation: "Correlation",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments
    .map((segment, index) => ({
      href: `/${segments.slice(0, index + 1).join("/")}`,
      label:
        segmentLabels[segment] ??
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
    }))
    .filter((crumb) => crumb.label !== "App");

  return crumbs.length > 0 ? crumbs : [{ href: ROUTES.DASHBOARD, label: "Dashboard" }];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const initials = getInitials(user?.name);
  const displayName = user?.name ?? user?.email ?? "User";
  const avatarSrc = user?.avatarUrl ?? user?.avatar;
  const breadcrumbs = getBreadcrumbs(pathname);
  const adminAccessQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: adminApi.me,
    retry: false,
    enabled: !!user,
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              aria-label="Search failures and services"
              placeholder="Search failures, services..."
              className="pl-9 h-9 bg-muted/50 border-0 w-full max-w-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
              >
                <BellIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="py-6 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative gap-2 px-2 h-9" aria-label="User menu">
                <Avatar className="size-7">
                  {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-sm font-medium max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown className="hidden lg:block size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 shrink-0">
                    {avatarSrc && <AvatarImage src={avatarSrc} alt={displayName} />}
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{displayName}</p>
                    {user?.email && (
                      <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD_PROFILE)}>
                <User className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(ROUTES.DASHBOARD_SETTINGS)}>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(ROUTES.ORGS)}>
                <Building2 className="mr-2 size-4" />
                Organizations
              </DropdownMenuItem>
              {adminAccessQuery.data && (
                <DropdownMenuItem onClick={() => router.push(ROUTES.ADMIN)}>
                  <User className="mr-2 size-4" />
                  Master Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-6">
        <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 && <span>/</span>}
                {isLast ? (
                  <span className="font-medium text-foreground">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
        {children}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { BellIcon, SearchIcon, LogOut, Settings, Building2, User, ChevronDown, ArrowRight, Loader2, AlertTriangle, Activity, Search } from "lucide-react";
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
import { adminApi, dashboardApi, notificationsApi } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { useDebounce } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { useNotificationsRealtime } from "@/lib/hooks";

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
  deployments: "Deployments",
  incidents: "Incidents",
  notifications: "Notifications",
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

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hr ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = getInitials(user?.name);
  const displayName = user?.name ?? user?.email ?? "User";
  const avatarSrc = user?.avatarUrl ?? user?.avatar;
  const breadcrumbs = getBreadcrumbs(pathname);
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 250);
  const adminAccessQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: adminApi.me,
    retry: false,
    enabled: !!user,
  });
  const searchResultsQuery = useQuery({
    queryKey: ["dashboard", "search", debouncedSearchQuery],
    queryFn: async () => {
      const res = await dashboardApi.search(debouncedSearchQuery);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch search results");
      }
      return res.data;
    },
    enabled: !!user && debouncedSearchQuery.length >= 2,
  });
  const notificationsQuery = useQuery({
    queryKey: ["notifications", "recent"],
    queryFn: async () => {
      const res = await notificationsApi.list(5);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch notifications");
      }
      return res.data ?? [];
    },
    enabled: !!user,
  });
  const queryClient = useQueryClient();
  useNotificationsRealtime();

  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/app/dashboard/search?q=${encodeURIComponent(trimmed)}`);
  };

  const showSearchPanel =
    mounted && searchFocused && searchQuery.trim().length >= 2;
  const searchData = searchResultsQuery.data;
  const unreadNotifications = notificationsQuery.data?.filter((item) => !item.read).length ?? 0;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-sm">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              aria-label="Search incidents, services, and deployments"
              placeholder="Search incidents, services..."
              className="pl-9 h-9 bg-muted/50 border-0 w-full max-w-sm"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => {
                window.setTimeout(() => setSearchFocused(false), 120);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearchSubmit();
                }
              }}
            />
            {showSearchPanel && (
              <div
                className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-2xl border bg-popover shadow-2xl"
                onMouseDown={(event) => event.preventDefault()}
              >
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Search className="size-3.5" />
                    Search results
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={handleSearchSubmit}
                  >
                    View all
                    <ArrowRight className="ml-1 size-3.5" />
                  </Button>
                </div>
                {searchResultsQuery.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                ) : searchResultsQuery.isError ? (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    Search failed. Try again.
                  </div>
                ) : searchData ? (
                  <div className="max-h-[24rem] overflow-y-auto p-2">
                    {searchData.services.length === 0 &&
                    searchData.failureCases.length === 0 &&
                    searchData.failureEvents.length === 0 ? (
                      <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                        No matches for “{debouncedSearchQuery}”.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {searchData.services.length > 0 && (
                          <div>
                            <div className="mb-2 flex items-center justify-between px-2 text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Activity className="size-3.5" />
                                Services
                              </span>
                              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                {searchData.services.length}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {searchData.services.map((service) => (
                                <Link
                                  key={service.id}
                                  href={service.href}
                                  className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-muted/60"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">{service.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                      {service.env} · {service.status}
                                    </p>
                                  </div>
                                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchData.failureCases.length > 0 && (
                          <div>
                            <div className="mb-2 flex items-center justify-between px-2 text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <AlertTriangle className="size-3.5" />
                                Incidents
                              </span>
                              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                {searchData.failureCases.length}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {searchData.failureCases.map((failureCase) => (
                                <Link
                                  key={failureCase.id}
                                  href={failureCase.href}
                                  className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-muted/60"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                      {failureCase.service.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                      {failureCase.severity} · {failureCase.status} ·{" "}
                                      {failureCase.fingerprint.slice(0, 8)}
                                    </p>
                                  </div>
                                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchData.failureEvents.length > 0 && (
                          <div>
                            <div className="mb-2 flex items-center justify-between px-2 text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Search className="size-3.5" />
                                Events
                              </span>
                              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                {searchData.failureEvents.length}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {searchData.failureEvents.map((event) => (
                                <Link
                                  key={event.id}
                                  href={event.href}
                                  className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-muted/60"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                      {event.service.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                      {event.errorMessage}
                                    </p>
                                  </div>
                                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchData.deployments.length > 0 && (
                          <div>
                            <div className="mb-2 flex items-center justify-between px-2 text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Activity className="size-3.5" />
                                Deployments
                              </span>
                              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                {searchData.deployments.length}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {searchData.deployments.map((deployment) => (
                                <Link
                                  key={deployment.id}
                                  href={deployment.href}
                                  className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-muted/60"
                                >
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                      {deployment.version || deployment.release || deployment.commitHash || "Deployment"}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                      {deployment.service.name} · {deployment.environment} · {deployment.status}
                                    </p>
                                  </div>
                                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mounted ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Notifications"
                  >
                    <BellIcon className="size-4" />
                    {unreadNotifications > 0 && (
                      <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notificationsQuery.isLoading ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Loading notifications...
                    </div>
                  ) : notificationsQuery.data && notificationsQuery.data.length > 0 ? (
                    notificationsQuery.data.map((notification) => (
                      <DropdownMenuItem key={notification.id} asChild>
                        <Link
                          href={notification.href}
                          onClick={() => {
                            void notificationsApi.markRead(notification.id).then(() => {
                              void queryClient.invalidateQueries({ queryKey: ["notifications", "recent"] });
                            });
                          }}
                          className="flex items-start gap-3 py-3"
                        >
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-[10px] font-semibold uppercase">
                            {notification.type.slice(0, 1)}
                          </div>
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <span
                              className={`text-sm font-medium leading-tight ${notification.read ? "text-muted-foreground" : ""}`}
                            >
                              {notification.title}
                            </span>
                            <span className="text-xs text-muted-foreground leading-tight">
                              {notification.description}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No new notifications
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.DASHBOARD_NOTIFICATIONS} className="w-full">
                      View all notifications
                    </Link>
                  </DropdownMenuItem>
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
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl border border-transparent bg-muted/30" />
              <div className="h-9 w-[8.5rem] rounded-2xl border border-transparent bg-muted/30" />
            </div>
          )}
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

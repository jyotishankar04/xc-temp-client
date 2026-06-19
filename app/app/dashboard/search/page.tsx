"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardApi } from "@/lib/api";

export default function DashboardSearchPage() {
  const searchParams = useSearchParams();
  const query = useMemo(() => searchParams.get("q")?.trim() ?? "", [searchParams]);

  const searchQuery = useQuery({
    queryKey: ["dashboard", "search", query],
    queryFn: async () => {
      const res = await dashboardApi.search(query);
      if (!res.success) {
        throw new Error(res.message || "Failed to search");
      }
      return res.data;
    },
    enabled: query.length > 0,
  });

  const data = searchQuery.data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance text-2xl font-bold tracking-tight">Search results</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {query
            ? `Searching for "${query}" across services, cases, and events.`
            : "Use the header search bar to look up failures and services."}
        </p>
      </div>

      {!query ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Start a search from the dashboard header.
          </CardContent>
        </Card>
      ) : searchQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : searchQuery.isError ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Search failed. Try another query.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="size-4" />
                Services
                <Badge variant="secondary" className="ml-auto">
                  {data?.services.length ?? 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.services.length ? (
                data.services.map((service) => (
                  <Link
                    key={service.id}
                    href={service.href}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.env}</p>
                      </div>
                      <Badge variant="outline" className="text-[11px] uppercase">
                        {service.status}
                      </Badge>
                    </div>
                    {service.description && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {service.description}
                      </p>
                    )}
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No matching services.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="size-4" />
                Failure Cases
                <Badge variant="secondary" className="ml-auto">
                  {data?.failureCases.length ?? 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.failureCases.length ? (
                data.failureCases.map((failureCase) => (
                  <Link
                    key={failureCase.id}
                    href={failureCase.href}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{failureCase.service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {failureCase.fingerprint.slice(0, 12)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[11px] uppercase">
                        {failureCase.severity}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground uppercase">
                      {failureCase.status}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No matching cases.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="size-4" />
                Events
                <Badge variant="secondary" className="ml-auto">
                  {data?.failureEvents.length ?? 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.failureEvents.length ? (
                data.failureEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={event.href}
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{event.service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {event.errorMessage}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No matching events.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { RecentCases } from "@/components/dashboard/recent-cases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Loader2, Boxes } from "lucide-react";
import { useServices } from "@/lib/hooks";
import Link from "next/link";

export default function DashboardPage() {
  const { data: services = [], isLoading } = useServices();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your production system reliability
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimeline />

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Service Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : services.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No services configured
                </p>
              ) : (
                services.slice(0, 5).map((service) => (
                  <Link
                    key={service.id}
                    href={`/dashboard/services/${service.id}/overview`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="size-3.5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">Healthy</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">100%</span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <RecentCases />
        </div>
      </div>
    </div>
  );
}
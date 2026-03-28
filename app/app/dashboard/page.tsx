import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { RecentCases } from "@/components/dashboard/recent-cases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const serviceHealth = [
  { name: "payments-api", status: "healthy" as const, uptime: "99.9%" },
  { name: "api-gateway", status: "degraded" as const, uptime: "98.2%" },
  { name: "auth-service", status: "healthy" as const, uptime: "100%" },
  { name: "notification-service", status: "healthy" as const, uptime: "99.7%" },
];

const statusConfig = {
  healthy: { icon: <CheckCircle className="size-3.5 text-green-600" />, label: "Healthy" },
  degraded: { icon: <AlertTriangle className="size-3.5 text-amber-600" />, label: "Degraded" },
  down: { icon: <XCircle className="size-3.5 text-red-600" />, label: "Down" },
};

export default function DashboardPage() {
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
              {serviceHealth.map((service) => {
                const config = statusConfig[service.status];
                return (
                  <div
                    key={service.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      {config.icon}
                      <div>
                        <p className="text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {config.label}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {service.uptime}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <RecentCases />
        </div>
      </div>
    </div>
  );
}

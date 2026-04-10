"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, Activity, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/lib/hooks/use-dashboard-stats";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  isLoading?: boolean;
};

function StatCard({ title, value, subtitle, icon, trend, className, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-primary/80">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Loading...</span>
          </div>
        </CardContent>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
      </Card>
    );
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary/80">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <p
            className={cn(
              "mt-1 text-xs font-medium",
              trend.positive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.positive ? "+" : "-"}
            {trend.value} from last hour
          </p>
        )}
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 to-primary/5" />
    </Card>
  );
}

export function StatsCards() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  const displayStats = stats
    ? [
        {
          title: "Active Incidents",
          value: stats.activeIncidents ?? 0,
          subtitle: stats.services ? `Across ${stats.services} services` : "No active incidents",
          icon: <AlertTriangle className="size-5" />,
        },
        {
          title: "Open Failure Cases",
          value: stats.openCases ?? stats.totalIncidents ?? 0,
          subtitle: "Open cases need attention",
          icon: <Activity className="size-5" />,
        },
        {
          title: "Recovery Actions Pending",
          value: stats.pendingActions ?? 0,
          subtitle: "Actions awaiting approval",
          icon: <Clock className="size-5" />,
        },
        {
          title: "System Health Score",
          value: stats.healthScore ?? stats.uptime ?? 0,
          subtitle: stats.uptime 
            ? (stats.uptime >= 99 ? "Excellent" : stats.uptime >= 95 ? "Good" : "Needs attention")
            : "No data",
          icon: <CheckCircle className="size-5" />,
        },
      ]
    : [
        {
          title: "Active Incidents",
          value: "-",
          subtitle: "No data",
          icon: <AlertTriangle className="size-5" />,
        },
        {
          title: "Open Failure Cases",
          value: "-",
          subtitle: "No data",
          icon: <Activity className="size-5" />,
        },
        {
          title: "Recovery Actions Pending",
          value: "-",
          subtitle: "No data",
          icon: <Clock className="size-5" />,
        },
        {
          title: "System Health Score",
          value: "-",
          subtitle: "No data",
          icon: <CheckCircle className="size-5" />,
        },
      ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {displayStats.map((stat) => (
        <StatCard key={stat.title} {...stat} isLoading={isLoading || isError} />
      ))}
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, Activity } from "lucide-react";

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
};

function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
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

const stats = [
  {
    title: "Active Incidents",
    value: "3",
    subtitle: "Across 2 services",
    icon: <AlertTriangle className="size-5" />,
    trend: { value: "1", positive: false },
  },
  {
    title: "Open Failure Cases",
    value: "12",
    subtitle: "3 high severity",
    icon: <Activity className="size-5" />,
    trend: { value: "2", positive: false },
  },
  {
    title: "Recovery Actions Pending",
    value: "2",
    subtitle: "Awaiting approval",
    icon: <Clock className="size-5" />,
  },
  {
    title: "System Health Score",
    value: "82%",
    subtitle: "Good",
    icon: <CheckCircle className="size-5" />,
    trend: { value: "5%", positive: false },
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const recentCases = [
  {
    id: "#142",
    title: "Database Connection Timeout",
    service: "payments-api",
    severity: "high" as const,
    status: "open" as const,
    lastSeen: "2 min ago",
    occurrences: 37,
    confidence: 72,
  },
  {
    id: "#141",
    title: "API Gateway Timeout",
    service: "api-gateway",
    severity: "medium" as const,
    status: "resolved" as const,
    lastSeen: "1 hr ago",
    occurrences: 12,
    confidence: 85,
  },
  {
    id: "#140",
    title: "Auth Service Latency",
    service: "auth-service",
    severity: "low" as const,
    status: "resolved" as const,
    lastSeen: "3 hrs ago",
    occurrences: 5,
    confidence: 91,
  },
];

const severityColors = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
} as const;

const statusColors = {
  open: "default",
  resolved: "outline",
} as const;

export function RecentCases() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Recent Failure Cases</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.DASHBOARD_FAILURES}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentCases.map((c) => (
          <Link
            key={c.id}
            href={`${ROUTES.DASHBOARD_FAILURES}/${c.id.replace("#", "")}`}
            className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">{c.id}</span>
                <Badge variant={severityColors[c.severity]} className="text-xs capitalize">
                  {c.severity}
                </Badge>
                <Badge variant={statusColors[c.status]} className="text-xs capitalize">
                  {c.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{c.title}</p>
              <p className="text-xs text-muted-foreground">
                {c.service} &middot; {c.occurrences} occurrences &middot; {c.confidence}% confidence
              </p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{c.lastSeen}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

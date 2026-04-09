"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCases } from "@/lib/hooks";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { Loader2 } from "lucide-react";

const severityColors: Record<string, "destructive" | "secondary" | "outline"> = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

const statusColors: Record<string, "default" | "outline"> = {
  OPEN: "default",
  RESOLVED: "outline",
  MERGED: "outline",
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHrs < 24) return `${diffHrs} hr ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function RecentCases() {
  const { data: cases = [], isLoading } = useCases({ limit: 5 });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Failure Cases</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (cases.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Failure Cases</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.DASHBOARD_FAILURES}>View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No recent cases</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Recent Failure Cases</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.DASHBOARD_FAILURES}>View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {cases.map((c) => (
          <Link
            key={c.id}
            href={`${ROUTES.DASHBOARD_FAILURES}/${c.id}`}
            className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold">{c.id.slice(0, 8)}...</span>
                <Badge variant={severityColors[c.severity] || "outline"} className="text-xs capitalize">
                  {c.severity.toLowerCase()}
                </Badge>
                <Badge variant={statusColors[c.status] || "outline"} className="text-xs capitalize">
                  {c.status.toLowerCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{c.service.name}</p>
              <p className="text-xs text-muted-foreground">
                {c.service.name} &middot; {c._count?.events || 0} events
              </p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatRelativeTime(c.createdAt)}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
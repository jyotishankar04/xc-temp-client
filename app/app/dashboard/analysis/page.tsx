"use client";

import Link from "next/link";
import { Brain, Loader2, TrendingUp, Calendar, AlertTriangle, CheckCircle, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalysis } from "@/lib/hooks";

// ── Severity ──────────────────────────────────────────────────────────────────
const severityConfig = {
  HIGH: {
    badge: "bg-severity-high/15 text-severity-high border-severity-high/30",
    dot: "bg-severity-high",
    bar: "bg-severity-high",
    icon: AlertTriangle,
    label: "High",
  },
  MEDIUM: {
    badge: "bg-severity-medium/15 text-severity-medium border-severity-medium/30",
    dot: "bg-severity-medium",
    bar: "bg-severity-medium",
    icon: AlertTriangle,
    label: "Medium",
  },
  LOW: {
    badge: "bg-severity-low/15 text-severity-low border-severity-low/30",
    dot: "bg-severity-low",
    bar: "bg-severity-low",
    icon: CheckCircle,
    label: "Low",
  },
} as const;

// ── Category ──────────────────────────────────────────────────────────────────
const categoryConfig: Record<string, { color: string; bg: string }> = {
  INFRASTRUCTURE: { color: "text-chart-1",          bg: "bg-chart-1/10 border-chart-1/20" },
  APPLICATION:    { color: "text-chart-5",          bg: "bg-chart-5/10 border-chart-5/20" },
  CONFIGURATION:  { color: "text-chart-4",          bg: "bg-chart-4/10 border-chart-4/20" },
  NETWORK:        { color: "text-chart-2",          bg: "bg-chart-2/10 border-chart-2/20" },
  DEPENDENCY:     { color: "text-chart-3",          bg: "bg-chart-3/10 border-chart-3/20" },
  EXTERNAL:       { color: "text-muted-foreground", bg: "bg-muted border-border" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function AnalysisPage() {
  const { data, isLoading, error } = useAnalysis({ limit: 50 });
  const patterns = data?.patterns ?? [];
  const summary = data?.summary;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-powered insights and patterns across failures
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Failed to load analysis patterns.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary stats */}
          {summary && (
            <div className="grid gap-4 md:grid-cols-3">
              <SummaryStat
                label="Total patterns"
                value={summary.totalPatterns}
                color="text-foreground"
              />
              <SummaryStat
                label="High severity"
                value={summary.highSeverityCount}
                color="text-severity-high"
              />
              <SummaryStat
                label="Avg confidence"
                value={`${summary.avgConfidence}%`}
                color="text-status-open"
              />
            </div>
          )}

          {/* Pattern cards */}
          <div className="grid gap-4 lg:grid-cols-2">
            {patterns.length === 0 ? (
              <Card className="lg:col-span-2">
                <CardContent className="p-12 text-center">
                  <Info className="size-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No analysis patterns detected yet. Errors need to be captured and processed first.
                  </p>
                </CardContent>
              </Card>
            ) : (
              patterns.map((pattern) => {
                const sev = severityConfig[pattern.severity] ?? severityConfig.LOW;
                const SevIcon = sev.icon;
                const cat = categoryConfig[pattern.category] ?? categoryConfig.EXTERNAL;

                return (
                  <Card
                    key={pattern.id}
                    className="relative overflow-hidden transition-shadow hover:shadow-md"
                  >
                    {/* Severity left-border stripe */}
                    <div className={`absolute left-0 inset-y-0 w-1 ${sev.dot}`} />

                    <CardHeader className="pl-5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <Brain className="size-4 text-primary shrink-0 mt-0.5" />
                          <CardTitle className="text-sm font-semibold leading-snug">
                            {pattern.title}
                          </CardTitle>
                        </div>
                        {/* Severity badge */}
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${sev.badge}`}
                        >
                          <SevIcon className="size-3" />
                          {sev.label}
                        </span>
                      </div>

                      {/* Category + services */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {pattern.category && (
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded border ${cat.bg} ${cat.color}`}
                          >
                            {pattern.category}
                          </span>
                        )}
                        {pattern.services.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs font-normal">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>

                    <CardContent className="pl-5 space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pattern.description}
                      </p>

                      {/* Confidence bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="size-3" />
                            Confidence
                          </span>
                          <span className="text-xs font-semibold tabular-nums">
                            {pattern.confidence}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-[width] ${sev.bar}`}
                            style={{ width: `${pattern.confidence}%` }}
                          />
                        </div>
                      </div>

                      {/* Date range + occurrences */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {pattern.firstSeenAt ? formatDate(pattern.firstSeenAt) : "—"}
                          {" → "}
                          {pattern.lastSeenAt ? formatDate(pattern.lastSeenAt) : "—"}
                        </span>
                        <span className="font-medium">
                          {pattern.occurrences} occurrence{pattern.occurrences !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <Link
                        href={`/app/dashboard/failures?search=${encodeURIComponent(pattern.title)}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View related cases →
                      </Link>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

"use client";

import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  CheckCircle,
  Clock,
  GitBranch,
  Lightbulb,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

type FailureCase = {
  id: string;
  caseId: string;
  title: string;
  service: string;
  severity: "high" | "medium" | "low";
  status: "open" | "resolved";
  environment: string;
  lastSeen: string;
  occurrences: number;
  confidence: number;
  summary: string;
  timeline: { time: string; event: string; type: "alert" | "analysis" | "action" | "system" }[];
  rootCause: {
    cause: string;
    reasoning: string;
    confidence: number;
    uncertainty: string;
  };
  logs: string[];
  recommendation: {
    action: string;
    riskLevel: "low" | "medium" | "high";
    explanation: string;
    version?: string;
  };
};

const cases: Record<string, FailureCase> = {
  "142": {
    id: "142",
    caseId: "#142",
    title: "Database Connection Timeout",
    service: "payments-api",
    severity: "high",
    status: "open",
    environment: "production",
    lastSeen: "2 min ago",
    occurrences: 37,
    confidence: 72,
    summary:
      "This failure is likely caused by database connection pool exhaustion following increased traffic after the latest deployment. The connection pool has reached its maximum capacity, causing new requests to timeout while waiting for available connections.",
    timeline: [
      { time: "10:42", event: "First failure detected", type: "alert" },
      { time: "10:43", event: "Spike in error rate (47% error rate)", type: "alert" },
      { time: "10:44", event: "Failure grouped into Case #142", type: "system" },
      { time: "10:45", event: "AI analysis generated", type: "analysis" },
      { time: "10:46", event: "Recovery recommendation generated", type: "action" },
    ],
    rootCause: {
      cause: "Database connection pool exhaustion",
      reasoning:
        "Repeated timeout errors across multiple requests, increased load observed post deployment. Connection pool metrics show all 20 connections in use with queue buildup.",
      confidence: 72,
      uncertainty:
        "No DB metrics available. Correlation is based on timing coincidence with deployment.",
    },
    logs: [
      "[10:42:01] ERROR: timeout exceeded - operation took 30001ms",
      "[10:42:01] ERROR: at db.connect (pool.js:142)",
      "[10:42:03] WARN: connection pool at 95% capacity",
      "[10:42:15] ERROR: Connection refused - pool exhausted",
      "[10:42:15] ERROR: at PaymentService.processOrder (orders.ts:89)",
      "[10:43:00] ERROR: Failed to acquire connection within 30s",
      "[10:43:12] WARN: Retrying connection attempt 1/3",
      "[10:43:45] ERROR: Unhandled rejection - ETIMEDOUT",
    ],
    recommendation: {
      action: "Rollback last deployment",
      riskLevel: "medium",
      explanation:
        "Failures started immediately after version v1.4.2 release. The new version introduced a connection leak that has exhausted the pool. Rolling back to v1.4.1 should restore normal operation while the issue is investigated.",
      version: "v1.4.2",
    },
  },
};

const severityVariants = {
  high: "destructive" as const,
  medium: "secondary" as const,
  low: "outline" as const,
};

const riskColors = {
  low: "text-green-600 bg-green-500/10 border-green-500/20",
  medium: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  high: "text-red-600 bg-red-500/10 border-red-500/20",
};

const timelineIcons = {
  alert: <AlertTriangle className="size-4 text-amber-600" />,
  analysis: <Brain className="size-4 text-purple-600" />,
  action: <Zap className="size-4 text-blue-600" />,
  system: <CheckCircle className="size-4 text-green-600" />,
};

export default function FailureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = {
    id: "142",
  };

  const failureCase = cases[resolvedParams.id];

  if (!failureCase) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.DASHBOARD_FAILURES}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              Case {failureCase.caseId} — {failureCase.title}
            </h1>
            <Badge variant={severityVariants[failureCase.severity]} className="capitalize">
              {failureCase.severity}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {failureCase.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {failureCase.service} &middot; {failureCase.environment} &middot;{" "}
            {failureCase.occurrences} occurrences &middot; Last seen{" "}
            {failureCase.lastSeen}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lightbulb className="size-4" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {failureCase.summary}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {failureCase.timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{timelineIcons[item.type]}</div>
                  <div className="flex flex-col gap-0.5 flex-1">
                    <p className="text-sm">{item.event}</p>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Brain className="size-4" />
                AI Root Cause Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Likely Cause</p>
                <p className="text-sm text-muted-foreground">
                  {failureCase.rootCause.cause}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-1">Reasoning</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {failureCase.rootCause.reasoning}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Confidence</p>
                  <p className="text-2xl font-bold">{failureCase.rootCause.confidence}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Uncertainty</p>
                  <p className="text-sm text-muted-foreground">
                    {failureCase.rootCause.uncertainty}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GitBranch className="size-4" />
                Logs / Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                <div className="font-mono text-xs p-4 space-y-1">
                  {failureCase.logs.map((log, i) => (
                    <p
                      key={i}
                      className={
                        log.includes("ERROR")
                          ? "text-red-500"
                          : log.includes("WARN")
                          ? "text-amber-500"
                          : "text-muted-foreground"
                      }
                    >
                      {log}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Recommended Action</p>
                <p className="text-sm font-semibold">
                  {failureCase.recommendation.action}
                </p>
                {failureCase.recommendation.version && (
                  <Badge variant="outline" className="mt-1 text-xs font-mono">
                    {failureCase.recommendation.version}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Risk Level</p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                    riskColors[failureCase.recommendation.riskLevel]
                  }`}
                >
                  {failureCase.recommendation.riskLevel}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Explanation</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {failureCase.recommendation.explanation}
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full">Approve Rollback</Button>
                <Button variant="outline" className="w-full">Reject</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Occurrences", value: failureCase.occurrences.toString() },
                { label: "Confidence", value: `${failureCase.confidence}%` },
                { label: "Duration", value: "4 min" },
                { label: "Affected Users", value: "~230" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-sm">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

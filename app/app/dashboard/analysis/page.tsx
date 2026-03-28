"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const patterns = [
  {
    id: "1",
    title: "Deployment-related failures",
    description: "Failures consistently correlate with recent deployments, suggesting potential issues in the release pipeline.",
    occurrences: 8,
    services: ["payments-api", "orders-service"],
    confidence: 78,
    severity: "medium" as const,
  },
  {
    id: "2",
    title: "Database connection pool exhaustion",
    description: "Multiple services experiencing connection pool issues during peak traffic hours.",
    occurrences: 5,
    services: ["payments-api", "auth-service"],
    confidence: 72,
    severity: "high" as const,
  },
  {
    id: "3",
    title: "Auth token refresh race condition",
    description: "Concurrent token refresh requests causing authentication failures.",
    occurrences: 3,
    services: ["auth-service"],
    confidence: 65,
    severity: "low" as const,
  },
];

const severityColors = {
  high: "destructive" as const,
  medium: "secondary" as const,
  low: "outline" as const,
};

export default function AnalysisPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-powered insights and patterns across failures
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {patterns.map((pattern) => (
          <Card key={pattern.id} className="hover:border-primary/30 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="size-4 text-purple-600" />
                  <CardTitle className="text-base">{pattern.title}</CardTitle>
                </div>
                <Badge variant={severityColors[pattern.severity]} className="capitalize">
                  {pattern.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {pattern.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {pattern.services.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs font-normal">
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {pattern.occurrences} occurrences
                </span>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">{pattern.confidence}% confidence</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CheckCircle className="size-4 text-green-600" />
            System Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-3xl font-bold">16</p>
            <p className="text-sm text-muted-foreground mt-1">Total patterns detected</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">3</p>
            <p className="text-sm text-muted-foreground mt-1">Active high-severity patterns</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-3xl font-bold text-green-600">71%</p>
            <p className="text-sm text-muted-foreground mt-1">Avg. pattern confidence</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

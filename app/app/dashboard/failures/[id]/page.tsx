"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCaseById, useUpdateCase } from "@/lib/hooks";
import { 
  ArrowLeft, 
  Loader2, 
  Boxes, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  GitBranch,
  Lightbulb,
  Zap
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const severityVariants: Record<string, "destructive" | "secondary" | "outline"> = {
  HIGH: "destructive",
  MEDIUM: "secondary",
  LOW: "outline",
};

const statusVariants: Record<string, "default" | "outline"> = {
  OPEN: "default",
  RESOLVED: "outline",
  MERGED: "outline",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

export default function FailureDetailPage() {
  const params = useParams();
  const caseId = params?.id as string;

  const { data: failureCase, isLoading, error } = useCaseById(caseId);
  const updateCase = useUpdateCase();

  const handleStatusChange = async (newStatus: "OPEN" | "RESOLVED") => {
    try {
      await updateCase.mutateAsync({ caseId, data: { status: newStatus } });
    } catch (e) {
      console.error("Failed to update case:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !failureCase) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.DASHBOARD_FAILURES}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Case Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Failed to load case details. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
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
              Case — {failureCase.id.slice(0, 8)}...
            </h1>
            <Badge variant={severityVariants[failureCase.severity] || "outline"} className="capitalize">
              {failureCase.severity.toLowerCase()}
            </Badge>
            <Badge variant={statusVariants[failureCase.status] || "outline"} className="capitalize">
              {failureCase.status.toLowerCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {failureCase.service.name} &middot; {failureCase.environment || "Unknown environment"} &middot;{" "}
            {failureCase._count?.events || 0} events &middot; Created {formatDate(failureCase.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Boxes className="size-4" />
                Case Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Case ID</p>
                  <p className="text-sm font-mono">{failureCase.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fingerprint</p>
                  <p className="text-xs font-mono truncate">{failureCase.fingerprint}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <Link 
                    href={`/app/dashboard/services/${failureCase.service.id}/overview`}
                    className="text-sm hover:underline flex items-center gap-1"
                  >
                    <Boxes className="size-3.5" />
                    {failureCase.service.name}
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Environment</p>
                  <p className="text-sm capitalize">{failureCase.environment || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(failureCase.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Updated</p>
                  <p className="text-sm">{formatDate(failureCase.updatedAt)}</p>
                </div>
              </div>
              {failureCase._count && (
                <>
                  <Separator />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{failureCase._count.events || 0}</p>
                      <p className="text-xs text-muted-foreground">Events</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{failureCase._count.possibleCauses || 0}</p>
                      <p className="text-xs text-muted-foreground">Possible Causes</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted">
                      <p className="text-2xl font-bold">{failureCase._count.followUps || 0}</p>
                      <p className="text-xs text-muted-foreground">Follow-ups</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Root Cause Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No AI analysis available for this case yet. Generate an RCA report to analyze this case.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href={`/app/dashboard/rca?caseId=${failureCase.id}`}>
                  <Zap className="size-4 mr-2" />
                  Generate RCA
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GitBranch className="size-4" />
                Events Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No events recorded for this case yet.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {failureCase.status === "OPEN" ? (
                <Button 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange("RESOLVED")}
                  disabled={updateCase.isPending}
                >
                  <CheckCircle className="size-4 mr-2" />
                  Mark as Resolved
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleStatusChange("OPEN")}
                  disabled={updateCase.isPending}
                >
                  <AlertTriangle className="size-4 mr-2" />
                  Reopen Case
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/rca?caseId=${failureCase.id}`}>
                  <Zap className="size-4 mr-2" />
                  Generate RCA
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Case Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Case ID</span>
                <span className="font-mono text-xs">{failureCase.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={statusVariants[failureCase.status] || "outline"} className="text-xs">
                  {failureCase.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severity</span>
                <Badge variant={severityVariants[failureCase.severity] || "outline"} className="text-xs">
                  {failureCase.severity}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(failureCase.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(failureCase.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
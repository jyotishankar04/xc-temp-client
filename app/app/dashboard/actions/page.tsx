"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  Clock3,
  ExternalLink,
  Loader2,
  RotateCcw,
  ShieldAlert,
  User,
  XCircle,
  Zap,
} from "lucide-react";

import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActions, useApproveAction, useRejectAction } from "@/lib/hooks";
import type { Action } from "@/lib/api";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  Action["status"],
  { variant: "default" | "secondary" | "outline" | "destructive"; label: string }
> = {
  PENDING: { variant: "secondary", label: "Pending" },
  APPROVED: { variant: "default", label: "Approved" },
  REJECTED: { variant: "outline", label: "Rejected" },
  EXECUTED: { variant: "outline", label: "Executed" },
  FAILED: { variant: "destructive", label: "Failed" },
};

const typeIcons: Record<Action["actionType"], React.ReactNode> = {
  ROLLBACK: <RotateCcw className="size-3.5" />,
  WAIT: <Zap className="size-3.5" />,
  SCALE: <Zap className="size-3.5" />,
  MANUAL: <User className="size-3.5" />,
};

function formatDate(date?: string | null) {
  if (!date) return "Not executed";
  return new Date(date).toLocaleString();
}

function getApprovalStatus(action: Action) {
  if (action.status === "PENDING" && action.actionType === "ROLLBACK") {
    return { variant: "secondary" as const, label: "Approval required" };
  }

  return statusConfig[action.status];
}

function getRcaContext(action: Action) {
  const reports = action.case?.reports ?? [];
  const report =
    reports.find((candidate) => candidate.metadata?.rollbackActionId === action.id) ??
    reports[0];

  if (!report) return null;

  return {
    reportId: report.id,
    confidence: report.metadata?.normalizedConfidence ?? report.confidenceScore,
    threshold: report.metadata?.rollbackThreshold,
    rationale: report.metadata?.rollbackRationale,
  };
}

function getRiskClass(risk?: Action["recommendation"]["riskLevel"]) {
  if (risk === "HIGH") return "border-red-500/30 bg-red-500/10 text-red-200";
  if (risk === "MEDIUM") return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
}

function getConfidenceWidth(confidence?: unknown) {
  const numericConfidence =
    typeof confidence === "number"
      ? confidence
      : typeof confidence === "string"
        ? Number(confidence)
        : 0;

  if (!Number.isFinite(numericConfidence)) return 0;
  return Math.max(0, Math.min(100, numericConfidence));
}

function DecisionSummary({ action }: { action: Action }) {
  if (action.status === "APPROVED" && action.approver) {
    return (
      <>
        <User className="size-3.5" />
        Approved by {action.approver.name}
      </>
    );
  }

  if (action.status === "REJECTED" && action.approver) {
    return (
      <>
        <User className="size-3.5" />
        Rejected by {action.approver.name}
      </>
    );
  }

  return (
    <>
      <Bot className="size-3.5" />
      RCA recommendation
    </>
  );
}

export default function ActionsPage() {
  const { data, isLoading, error } = useActions({ limit: 50 });
  const approveAction = useApproveAction();
  const rejectAction = useRejectAction();
  const [approvalTarget, setApprovalTarget] = useState<Action | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const actions = data?.actions ?? [];
  const pendingRollbackActions = actions.filter(
    (action) => action.status === "PENDING" && action.actionType === "ROLLBACK"
  );

  const handleApprove = async () => {
    if (!approvalTarget) return;

    try {
      await approveAction.mutateAsync(approvalTarget.id);
      setFeedback({
        type: "success",
        message:
          approvalTarget.actionType === "ROLLBACK"
            ? "Rollback approval saved. The rollback job was queued."
            : "Action approved.",
      });
      setApprovalTarget(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to approve action.",
      });
    }
  };

  const handleReject = async (action: Action) => {
    try {
      await rejectAction.mutateAsync(action.id);
      setFeedback({ type: "success", message: "Action rejected. No rollback job was queued." });
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to reject action.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance text-2xl font-bold tracking-tight">Recovery Actions</h1>
        <p className="text-pretty text-muted-foreground text-sm mt-1">
          Manage and track recovery actions across your services
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-primary/20 bg-primary/5 text-primary"
          }`}
        >
          {feedback.type === "error" ? (
            <XCircle className="size-4 shrink-0" />
          ) : (
            <CheckCircle className="size-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="flex min-h-64 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Failed to load recovery actions.
          </CardContent>
        </Card>
      ) : actions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No recovery actions found.
          </CardContent>
        </Card>
      ) : (
        <>
          {pendingRollbackActions.length > 0 && (
            <Card className="gap-4 border-cyan-500/20 bg-cyan-500/[0.03] py-0">
              <CardHeader className="border-b border-cyan-500/15 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-md border border-cyan-400/25 bg-cyan-400/10 text-cyan-200">
                    <ShieldAlert className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Approval queue
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Rollback execution is paused until an owner or admin approves it.
                    </CardDescription>
                  </div>
                </div>
                <CardAction>
                  <Badge variant="outline" className="border-cyan-400/25 bg-cyan-400/10 text-cyan-100">
                    {pendingRollbackActions.length} pending
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-3 p-4">
                {pendingRollbackActions.map((action) => {
                  const rcaContext = getRcaContext(action);
                  const confidenceWidth = getConfidenceWidth(rcaContext?.confidence);
                  const isMutating = approveAction.isPending || rejectAction.isPending;

                  return (
                    <div
                      key={action.id}
                      className="grid gap-4 rounded-lg border border-border/70 bg-background/70 p-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] xl:grid-cols-[minmax(0,1fr)_260px]"
                    >
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="bg-cyan-400/15 text-cyan-100">
                            Approval required
                          </Badge>
                          <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", getRiskClass(action.recommendation?.riskLevel))}>
                            {action.recommendation?.riskLevel ?? "Unknown"} risk
                          </span>
                          {action.case?.service && (
                            <Button variant="link" className="h-auto p-0 text-xs text-cyan-300" asChild>
                              <Link href={`/app/dashboard/services/${action.case.service.id}/overview`}>
                                {action.case.service.name}
                                <ExternalLink className="ml-1 size-3" />
                              </Link>
                            </Button>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium leading-5">
                            {action.recommendation?.rationale || "Rollback recommended by RCA"}
                          </p>
                          {typeof rcaContext?.rationale === "string" && rcaContext.rationale !== action.recommendation?.rationale && (
                            <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
                              {rcaContext.rationale}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-3 text-xs text-muted-foreground md:grid-cols-3">
                          <div className="rounded-md border border-border/60 bg-muted/20 p-3">
                            <p className="mb-1 flex items-center gap-1.5 text-foreground">
                              <Bot className="size-3.5" />
                              RCA confidence
                            </p>
                            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-cyan-400"
                                style={{ width: `${confidenceWidth}%` }}
                              />
                            </div>
                            <p className="mt-1">
                              {String(rcaContext?.confidence ?? "Unknown")}
                              {rcaContext?.threshold ? ` / threshold ${String(rcaContext.threshold)}` : ""}
                            </p>
                          </div>
                          <div className="rounded-md border border-border/60 bg-muted/20 p-3">
                            <p className="mb-1 flex items-center gap-1.5 text-foreground">
                              <Clock3 className="size-3.5" />
                              Created
                            </p>
                            <p>{formatDate(action.createdAt)}</p>
                          </div>
                          <div className="rounded-md border border-border/60 bg-muted/20 p-3">
                            <p className="mb-1 flex items-center gap-1.5 text-foreground">
                              <AlertTriangle className="size-3.5" />
                              Execution
                            </p>
                            <p>Approval queues rollback immediately.</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col justify-between gap-3 rounded-md border border-border/60 bg-muted/20 p-3">
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between gap-3">
                            <span>Case</span>
                            <Button variant="link" className="h-auto p-0 font-mono text-xs" asChild>
                              <Link href={`/app/dashboard/failures/${action.caseId}`}>
                                {action.caseId.slice(0, 8)}...
                              </Link>
                            </Button>
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span>Approver</span>
                            <span className="text-foreground">Not assigned</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(action)}
                            disabled={isMutating}
                            className="border-border/70"
                          >
                            <XCircle className="mr-1 size-3.5" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setApprovalTarget(action)}
                            disabled={isMutating}
                            className="bg-cyan-500 text-cyan-950 hover:bg-cyan-400"
                          >
                            <CheckCircle className="mr-1 size-3.5" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <Card className="gap-0 py-0">
            <CardHeader className="border-b px-5 py-4">
              <CardTitle className="text-sm font-semibold">Action ledger</CardTitle>
              <CardDescription className="text-xs">
                Completed decisions and non-rollback recovery recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-0 p-0">
              {actions.map((action) => {
                const status = getApprovalStatus(action);
                const rcaContext = getRcaContext(action);
                const isPending = action.status === "PENDING";
                const isMutating =
                  approveAction.isPending || rejectAction.isPending;

                return (
                  <div
                    key={action.id}
                    className={cn(
                      "grid gap-4 border-b p-4 last:border-b-0 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] xl:grid-cols-[minmax(0,1fr)_360px_220px]",
                      isPending && "bg-cyan-500/[0.025]"
                    )}
                  >
                    <div className="flex min-w-0 gap-3">
                      <div className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border",
                        isPending
                          ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
                          : "border-border bg-muted/30 text-muted-foreground"
                      )}>
                        {typeIcons[action.actionType]}
                      </div>
                      <div className="min-w-0 space-y-2">
                        <p className="text-sm font-medium leading-5">
                          {action.recommendation?.rationale || action.actionType}
                        </p>
                        {typeof rcaContext?.rationale === "string" && rcaContext.rationale !== action.recommendation?.rationale && (
                          <p className="max-w-3xl text-xs leading-5 text-muted-foreground">
                            {rcaContext.rationale}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", getRiskClass(action.recommendation?.riskLevel))}>
                            {action.recommendation?.riskLevel ?? "Unknown"} risk
                          </span>
                          <Badge variant={status.variant} className="text-xs">
                            {status.label}
                          </Badge>
                          {rcaContext && (
                            <span className="text-xs text-muted-foreground">
                              RCA {String(rcaContext.confidence)}
                              {rcaContext.threshold ? ` / ${String(rcaContext.threshold)}` : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid min-w-0 gap-3 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-1">
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground/70">
                          Service
                        </p>
                        {action.case?.service ? (
                          <Button variant="link" className="h-auto min-w-0 p-0 text-sm text-cyan-300" asChild>
                            <Link href={`/app/dashboard/services/${action.case.service.id}/overview`}>
                              <span className="truncate">{action.case.service.name}</span>
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unknown</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground/70">
                          Decision
                        </p>
                        <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                          <DecisionSummary action={action} />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground/70">
                          Created
                        </p>
                        <p className="text-sm">{formatDate(action.createdAt)}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground/70">
                          Case
                        </p>
                        <Button variant="link" className="h-auto p-0 font-mono text-xs" asChild>
                          <Link href={`/app/dashboard/failures/${action.caseId}`}>
                            {action.caseId.slice(0, 8)}...
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="flex min-w-0 items-start justify-start xl:justify-end">
                      {isPending ? (
                        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(action)}
                            disabled={isMutating}
                          >
                            <XCircle className="mr-1 size-3.5" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setApprovalTarget(action)}
                            disabled={isMutating}
                          >
                            <CheckCircle className="mr-1 size-3.5" />
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <div className="text-left xl:text-right">
                          <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground/70">
                            Execution
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(action.executedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}

      <ConfirmDialog
        open={approvalTarget !== null}
        onOpenChange={(open) => {
          if (!open) setApprovalTarget(null);
        }}
        title={
          approvalTarget?.actionType === "ROLLBACK"
            ? "Approve rollback execution?"
            : "Approve recovery action?"
        }
        description={
          approvalTarget?.actionType === "ROLLBACK"
            ? "This approval queues the rollback workflow for the related service. Confirm that the RCA evidence and service context have been reviewed."
            : "This marks the recovery action as approved."
        }
        confirmText={approveAction.isPending ? "Approving..." : "Approve"}
        cancelText="Cancel"
        onConfirm={handleApprove}
      />
    </div>
  );
}

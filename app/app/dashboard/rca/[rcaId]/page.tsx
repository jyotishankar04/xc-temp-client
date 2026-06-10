"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Boxes,
  CheckCircle,
  Circle,
  ExternalLink,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateRca, useRcaById, useUpdateRca } from "@/lib/hooks";

function formatMetadataValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function normalizeConfidence(value: unknown) {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : 0;

  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.min(100, Math.round(numeric <= 10 ? numeric * 10 : numeric));
}

function formatConfidence(score: number) {
  if (!score) return "N/A";
  const normalized = normalizeConfidence(score);
  return score <= 10 ? `${score}/10 (${normalized}%)` : `${normalized}%`;
}

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getFailureMessage(value: unknown) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && !Array.isArray(value) && "message" in value) {
    const message = (value as { message?: unknown }).message;
    return typeof message === "string" ? message : formatMetadataValue(message);
  }
  return formatMetadataValue(value);
}

function getStatusBadge(status: string, reviewed: boolean) {
  if (status === "FAILED") {
    return (
      <Badge variant="destructive" className="gap-1.5">
        <XCircle className="size-3.5" />
        Failed
      </Badge>
    );
  }

  if (status === "IN_PROGRESS" || status === "PENDING") {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Loader2 className="size-3.5 animate-spin" />
        Processing
      </Badge>
    );
  }

  if (status === "INSUFFICIENT_EVIDENCE") {
    return (
      <Badge variant="outline" className="gap-1.5 border-amber-500/40 text-amber-300">
        <AlertTriangle className="size-3.5" />
        Insufficient evidence
      </Badge>
    );
  }

  return (
    <Badge variant={reviewed ? "default" : "secondary"} className="gap-1.5">
      {reviewed ? <CheckCircle className="size-3.5" /> : <Circle className="size-3.5" />}
      {reviewed ? "Reviewed" : "Unreviewed"}
    </Badge>
  );
}

export default function RcaDetailPage() {
  const params = useParams();
  const reportId = params?.rcaId as string;

  const { data: report, isLoading, error } = useRcaById(reportId);
  const updateRca = useUpdateRca();
  const generateRca = useGenerateRca();

  const [notes, setNotes] = useState(report?.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(report?.notes || "");
  }, [report?.notes]);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await updateRca.mutateAsync({ reportId, data: { notes } });
    } catch (e) {
      console.error("Failed to save notes:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleReviewed = async () => {
    try {
      await updateRca.mutateAsync({ reportId, data: { reviewed: !report?.reviewed } });
    } catch (e) {
      console.error("Failed to update reviewed status:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[25rem] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/app/dashboard/rca" aria-label="Back to RCA list">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Report Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load RCA report. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metadata = report.metadata ?? {};
  const graphStatus = String(metadata.graphStatus ?? report.status);
  const status = graphStatus === "COMPLETED" ? report.status : graphStatus;
  const failureMessage = getFailureMessage(metadata.failureDetails);
  const normalizedConfidence = normalizeConfidence(
    metadata.normalizedConfidence ?? report.confidenceScore,
  );
  const rollbackThreshold =
    typeof metadata.rollbackThreshold === "number" ? metadata.rollbackThreshold : undefined;
  const approvalGenerated = Boolean(metadata.rollbackApprovalGenerated);
  const hasRollbackApproval = Boolean(metadata.rollbackActionId);
  const confidenceBarWidth = normalizedConfidence || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Button variant="ghost" size="icon" asChild className="mt-0.5 shrink-0">
            <Link href="/app/dashboard/rca" aria-label="Back to RCA list">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {getStatusBadge(status, report.reviewed)}
              {report.severity && (
                <Badge variant="outline" className="capitalize">
                  {report.severity.toLowerCase()} severity
                </Badge>
              )}
              {hasRollbackApproval && (
                <Badge variant="outline" className="gap-1 border-cyan-500/40 text-cyan-300">
                  <ShieldCheck className="size-3" />
                  Approval linked
                </Badge>
              )}
            </div>
            <h1 className="text-pretty text-2xl font-bold tracking-tight">{report.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Case{" "}
              <Link href={`/app/dashboard/failures/${report.caseId}`} className="font-mono hover:underline">
                {report.caseId.slice(0, 8)}
              </Link>
              {report.serviceName ? ` · ${report.serviceName}` : ""}
            </p>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 xl:w-[34rem]">
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Graph</p>
            <p className="mt-1 truncate text-sm font-medium">{formatStatus(graphStatus)}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Confidence</p>
            <p className="mt-1 text-sm font-medium">{formatConfidence(report.confidenceScore)}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Rollback score</p>
            <p className="mt-1 text-sm font-medium">
              {normalizedConfidence ? `${normalizedConfidence}%` : "N/A"}
              {rollbackThreshold ? ` / ${rollbackThreshold}%` : ""}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Approval</p>
            <p className="mt-1 truncate text-sm font-medium">
              {hasRollbackApproval
                ? "Pending action"
                : approvalGenerated
                  ? "Generated"
                  : "Not generated"}
            </p>
          </div>
        </div>
      </div>

      {(status === "IN_PROGRESS" || status === "PENDING") && (
        <div className="flex items-center gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm">
          <Loader2 className="size-4 shrink-0 animate-spin text-cyan-300" />
          <span>RCA generation is still running. Refresh this page to see the completed report.</span>
        </div>
      )}

      {status === "FAILED" && (
        <div className="flex flex-col gap-3 rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 text-sm text-destructive">
            <XCircle className="mt-0.5 size-4 shrink-0" />
            <span className="break-words">
              {failureMessage ?? "RCA generation failed. Retry the analysis after reviewing the failure details."}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => generateRca.mutate(report.caseId)}
            disabled={generateRca.isPending}
            className="shrink-0"
          >
            {generateRca.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 size-4" />
            )}
            Retry
          </Button>
        </div>
      )}

      {status === "INSUFFICIENT_EVIDENCE" && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            The worker completed, but the evidence was not strong enough for a reliable RCA. Treat this as an
            investigation record instead of a finished diagnosis.
          </span>
        </div>
      )}

      {report.status === "COMPLETED" && status !== "FAILED" && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Bot className="size-3.5" />
          <span>
            AI-generated analysis · {String(metadata.modelName ?? report.modelVersion)} · Verify evidence before
            approving recovery action.
          </span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.summary && (
                <section className="rounded-lg border bg-muted/20 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Summary</p>
                  <p className="text-sm leading-6">{report.summary}</p>
                </section>
              )}

              {report.rootCause && (
                <section className="rounded-lg border bg-muted/20 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Mechanism
                  </p>
                  <p className="text-sm leading-6">{report.rootCause}</p>
                </section>
              )}

              {report.explanation && (
                <section
                  className={`rounded-lg border p-4 ${
                    status === "FAILED"
                      ? "border-destructive/25 bg-destructive/5 text-destructive"
                      : "bg-muted/20"
                  }`}
                >
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {status === "FAILED" ? "Error" : "Explanation"}
                  </p>
                  <p className="break-words text-sm leading-6">{report.explanation}</p>
                </section>
              )}

              {failureMessage && status !== "FAILED" && (
                <section className="rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-destructive">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide">Failure Details</p>
                  <p className="break-words text-sm leading-6">{failureMessage}</p>
                </section>
              )}

              {!report.summary && !report.rootCause && !report.explanation && !failureMessage && (
                <p className="rounded-lg border bg-muted/20 p-4 text-sm text-muted-foreground">
                  No RCA analysis content is available for this report yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Operator Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Private review notes stored with this report.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveNotes}
                  disabled={isSaving || notes === report.notes}
                >
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="mr-1 size-4" />}
                  Save
                </Button>
              </div>
              <Textarea
                placeholder="Add investigation notes, verification steps, or reviewer context..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="min-h-[9rem]"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Confidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Model score</p>
                  <p className="text-2xl font-semibold">{formatConfidence(report.confidenceScore)}</p>
                </div>
                <Badge variant="outline">0-10 model scale</Badge>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${confidenceBarWidth}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Threshold checks use the normalized percentage score. A model score of 9 becomes 90%.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Rollback Approval</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Generated</span>
                <span>{formatMetadataValue(metadata.rollbackApprovalGenerated)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Creation status</span>
                <span>{formatMetadataValue(metadata.rollbackApprovalCreationStatus)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Score</span>
                <span>
                  {normalizedConfidence ? `${normalizedConfidence}%` : "N/A"}
                  {rollbackThreshold ? ` / ${rollbackThreshold}%` : ""}
                </span>
              </div>
              {metadata.rollbackActionId && (
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="mb-1 text-xs text-muted-foreground">Action ID</p>
                  <p className="break-all font-mono text-xs">{metadata.rollbackActionId}</p>
                </div>
              )}
              {metadata.rollbackRationale && (
                <div className="rounded-lg border bg-muted/20 p-3">
                  <p className="mb-1 text-xs text-muted-foreground">Rationale</p>
                  <p className="text-xs leading-5">{String(metadata.rollbackRationale)}</p>
                </div>
              )}
              <Button variant={hasRollbackApproval ? "default" : "outline"} className="w-full justify-start" asChild>
                <Link href="/app/dashboard/actions">
                  <RotateCcw className="mr-2 size-4" />
                  Open Recovery Actions
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/app/dashboard/failures/${report.caseId}`}>
                  <ExternalLink className="mr-2 size-4" />
                  View Related Case
                </Link>
              </Button>
              {report.serviceId && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/app/dashboard/services/${report.serviceId}/overview`}>
                    <Boxes className="mr-2 size-4" />
                    View Service
                  </Link>
                </Button>
              )}
              <Button
                variant={report.reviewed ? "outline" : "default"}
                className="w-full justify-start"
                onClick={handleToggleReviewed}
                disabled={updateRca.isPending || report.status !== "COMPLETED"}
              >
                {report.reviewed ? <Circle className="mr-2 size-4" /> : <CheckCircle className="mr-2 size-4" />}
                {report.reviewed ? "Mark as Unreviewed" : "Mark as Reviewed"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Run Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Report</span>
                <span className="font-mono text-xs">{report.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Case</span>
                <span className="font-mono text-xs">{report.caseId.slice(0, 8)}...</span>
              </div>
              {report.caseFingerprint && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Fingerprint</span>
                  <span className="break-all text-right font-mono text-xs">
                    {report.caseFingerprint.slice(0, 12)}...
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Model</span>
                <span className="break-all text-right font-mono text-xs">
                  {formatMetadataValue(metadata.modelName ?? report.modelVersion)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Thread</span>
                <span className="break-all text-right font-mono text-xs">{formatMetadataValue(metadata.threadId)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Created</span>
                <span>{report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}</span>
              </div>
              {report.affectedServices.length > 0 && (
                <div>
                  <span className="mb-1 block text-muted-foreground">Affected services</span>
                  <div className="flex flex-wrap gap-1">
                    {report.affectedServices.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

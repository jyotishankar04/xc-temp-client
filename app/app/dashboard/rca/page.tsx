"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  CheckCircle,
  Circle,
  ExternalLink,
  FileSearch,
  Loader2,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRcaReports, useServices } from "@/lib/hooks";

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
  return score <= 10 ? `${score}/10` : `${normalized}%`;
}

function getDisplayStatus(report: { status: string; metadata?: { graphStatus?: string } }) {
  const graphStatus = report.metadata?.graphStatus;
  if (graphStatus === "FAILED" || graphStatus === "INSUFFICIENT_EVIDENCE") return graphStatus;
  return report.status;
}

function statusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function StatusBadge({ status, reviewed }: { status: string; reviewed: boolean }) {
  if (status === "FAILED") {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="size-3" />
        Failed
      </Badge>
    );
  }

  if (status === "IN_PROGRESS" || status === "PENDING") {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="size-3 animate-spin" />
        Processing
      </Badge>
    );
  }

  if (status === "INSUFFICIENT_EVIDENCE") {
    return (
      <Badge variant="outline" className="gap-1 border-amber-500/40 text-amber-300">
        <AlertTriangle className="size-3" />
        Insufficient
      </Badge>
    );
  }

  return (
    <Badge variant={reviewed ? "default" : "secondary"} className="gap-1">
      {reviewed ? <CheckCircle className="size-3" /> : <Circle className="size-3" />}
      {reviewed ? "Reviewed" : "Unreviewed"}
    </Badge>
  );
}

export default function RcaPage() {
  const { data: reports = [], isLoading } = useRcaReports();
  const { data: services = [] } = useServices();

  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredReports = reports.filter((report) => {
    const status = getDisplayStatus(report);
    const normalizedSearch = search.trim().toLowerCase();

    if (serviceFilter !== "all" && report.serviceId !== serviceFilter) return false;
    if (statusFilter === "reviewed" && !report.reviewed) return false;
    if (statusFilter === "unreviewed" && report.reviewed) return false;
    if (statusFilter === "failed" && status !== "FAILED") return false;
    if (statusFilter === "processing" && status !== "IN_PROGRESS" && status !== "PENDING") return false;
    if (statusFilter === "insufficient" && status !== "INSUFFICIENT_EVIDENCE") return false;
    if (statusFilter === "approval" && !report.metadata?.rollbackActionId) return false;
    if (
      normalizedSearch &&
      ![
        report.title,
        report.summary,
        report.rootCauseTitle,
        report.serviceName,
        report.caseId,
      ].some((value) => String(value ?? "").toLowerCase().includes(normalizedSearch))
    ) {
      return false;
    }

    return true;
  });

  const approvalCount = reports.filter((report) => report.metadata?.rollbackActionId).length;
  const failedCount = reports.filter((report) => getDisplayStatus(report) === "FAILED").length;
  const insufficientCount = reports.filter(
    (report) => getDisplayStatus(report) === "INSUFFICIENT_EVIDENCE",
  ).length;
  const avgConfidence = reports.length
    ? Math.round(
        reports.reduce((sum, report) => sum + normalizeConfidence(report.confidenceScore), 0) /
          reports.length,
      )
    : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[25rem] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RCA Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Root cause analysis runs, confidence, and approval-gated recovery decisions.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:w-[34rem]">
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Reports</p>
            <p className="mt-1 text-xl font-semibold">{reports.length}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Avg confidence</p>
            <p className="mt-1 text-xl font-semibold">{avgConfidence || 0}%</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Needs attention</p>
            <p className="mt-1 text-xl font-semibold">{failedCount + insufficientCount}</p>
          </div>
          <div className="rounded-lg border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Approvals</p>
            <p className="mt-1 text-xl font-semibold">{approvalCount}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-[minmax(12rem,1fr)_minmax(12rem,1fr)_minmax(16rem,2fr)]">
            <div>
              <Label className="text-xs text-muted-foreground">Service</Label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">State</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="insufficient">Insufficient evidence</SelectItem>
                  <SelectItem value="approval">Rollback approval linked</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="unreviewed">Unreviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input
                placeholder="Search title, service, summary, or case..."
                aria-label="Search RCA"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <FileSearch className="mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No RCA reports found</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                {search || serviceFilter !== "all" || statusFilter !== "all"
                  ? "No reports match the current filters."
                  : "Generate an RCA report from a failure case to see analysis here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[28rem]">Report</TableHead>
                    <TableHead className="min-w-[12rem]">Service</TableHead>
                    <TableHead className="min-w-[11rem]">State</TableHead>
                    <TableHead className="min-w-[12rem]">Confidence</TableHead>
                    <TableHead className="min-w-[12rem]">Rollback</TableHead>
                    <TableHead className="min-w-[10rem]">Created</TableHead>
                    <TableHead className="w-20 text-right">Open</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => {
                    const status = getDisplayStatus(report);
                    const confidence = normalizeConfidence(report.confidenceScore);
                    const threshold = report.metadata?.rollbackThreshold;

                    return (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex min-w-0 flex-col gap-2">
                            <Link
                              href={`/app/dashboard/rca/${report.id}`}
                              className="line-clamp-2 font-medium hover:underline"
                            >
                              {report.title}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <Link
                                href={`/app/dashboard/failures/${report.caseId}`}
                                className="font-mono text-cyan-300 hover:underline"
                              >
                                {report.caseId.slice(0, 8)}...
                              </Link>
                              {report.severity && (
                                <Badge variant="outline" className="h-5 capitalize">
                                  {report.severity.toLowerCase()}
                                </Badge>
                              )}
                              {report.rootCauseCategory && (
                                <Badge variant="outline" className="h-5 capitalize">
                                  {report.rootCauseCategory.toLowerCase()}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.serviceName && report.serviceId ? (
                            <Link
                              href={`/app/dashboard/services/${report.serviceId}/overview`}
                              className="flex items-center gap-1 text-sm text-cyan-300 hover:underline"
                            >
                              <Boxes className="size-3.5" />
                              {report.serviceName}
                            </Link>
                          ) : (
                            <span className="text-sm text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            <StatusBadge status={status} reviewed={report.reviewed} />
                            <span className="text-xs text-muted-foreground">
                              Graph: {statusLabel(String(report.metadata?.graphStatus ?? report.status))}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-3 text-sm">
                              <span>{formatConfidence(report.confidenceScore)}</span>
                              <span className="text-xs text-muted-foreground">{confidence || 0}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-cyan-400"
                                style={{ width: `${confidence}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {report.metadata?.rollbackActionId ? (
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className="w-fit gap-1 border-cyan-500/40 text-cyan-300">
                                <ShieldCheck className="size-3" />
                                Approval required
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {report.metadata.normalizedConfidence ?? confidence}
                                {threshold ? ` / ${threshold}` : ""} threshold
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <RotateCcw className="size-3.5" />
                              No approval
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/app/dashboard/rca/${report.id}`} aria-label="Open RCA details">
                              <ExternalLink className="size-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

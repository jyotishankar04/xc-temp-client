"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { useCases } from "@/lib/hooks";
import { SearchIcon, Loader2, Boxes, Fingerprint } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

// ── Severity ──────────────────────────────────────────────────────────────────
const severityBadge: Record<string, string> = {
  HIGH:   "bg-severity-high/15 text-severity-high border border-severity-high/30",
  MEDIUM: "bg-severity-medium/15 text-severity-medium border border-severity-medium/30",
  LOW:    "bg-severity-low/15 text-severity-low border border-severity-low/30",
};

const severityRowBorder: Record<string, string> = {
  HIGH:   "border-l-2 border-l-severity-high",
  MEDIUM: "border-l-2 border-l-severity-medium",
  LOW:    "border-l-2 border-l-severity-low",
};

const statusBadge: Record<string, string> = {
  OPEN:     "bg-status-open/15 text-status-open border border-status-open/30",
  RESOLVED: "bg-status-resolved/15 text-status-resolved border border-status-resolved/30",
};

// ── Time formatting ───────────────────────────────────────────────────────────
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function FailuresPage() {
  const [search, setSearch] = useState("");
  const [environment, setEnvironment] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const { data: casesResponse, isLoading } = useCases({
    search: search || undefined,
    environment: environment === "all" ? undefined : environment,
    severity: severity === "all" ? undefined : severity,
    status: status === "all" ? undefined : status,
  });
  const cases = casesResponse?.cases ?? [];
  const pagination = casesResponse?.pagination;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance text-2xl font-bold tracking-tight">Failure Cases</h1>
        <p className="text-pretty text-muted-foreground text-sm mt-1">
          Track and manage all detected failure cases
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
                aria-label="Search failures"
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={environment} onValueChange={setEnvironment}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All environments</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severity</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {pagination && (
            <div className="border-b px-4 py-2 text-xs text-muted-foreground">
              Showing <span className="tabular-nums">{cases.length}</span> of <span className="tabular-nums">{pagination.total}</span> cases
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 pl-4">Case ID</TableHead>
                <TableHead>Error / Fingerprint</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="w-28">Severity</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-24">Env</TableHead>
                <TableHead className="w-24 text-right">Events</TableHead>
                <TableHead className="w-28 text-right">Last seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No cases found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((c) => (
                  <TableRow
                    key={c.id}
                    className={`cursor-pointer hover:bg-muted/50 ${severityRowBorder[c.severity] ?? ""}`}
                  >
                    {/* Case ID */}
                    <TableCell className="pl-4">
                      <Link
                        href={`${ROUTES.DASHBOARD_FAILURES}/${c.id}`}
                        className="font-mono text-xs font-semibold text-primary hover:underline"
                      >
                        {c.id.slice(0, 8)}…
                      </Link>
                    </TableCell>

                    {/* Fingerprint / error snippet */}
                    <TableCell className="max-w-xs">
                      <div className="flex flex-col gap-0.5">
                        {c.fingerprint && (
                          <span className="inline-flex items-center gap-1 text-xs font-mono text-fingerprint">
                            <Fingerprint className="size-3 shrink-0" />
                            <span className="truncate max-w-[220px]">{c.fingerprint}</span>
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Service */}
                    <TableCell>
                      <Link
                        href={`/app/dashboard/services/${c.service.id}/overview`}
                        className="text-sm hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Boxes className="size-3.5 shrink-0" />
                        {c.service.name}
                      </Link>
                    </TableCell>

                    {/* Severity */}
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${severityBadge[c.severity] ?? ""}`}>
                        <span className={`size-1.5 rounded-full ${
                          c.severity === "HIGH" ? "bg-severity-high" :
                          c.severity === "MEDIUM" ? "bg-severity-medium" : "bg-severity-low"
                        }`} />
                        {c.severity}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[c.status] ?? ""}`}>
                        {c.status}
                      </span>
                    </TableCell>

                    {/* Environment */}
                    <TableCell className="text-xs text-muted-foreground capitalize">
                      {c.environment || "—"}
                    </TableCell>

                    {/* Events */}
                    <TableCell className="text-right">
                      <span className="text-xs font-mono font-semibold tabular-nums">
                        {c._count?.events ?? 0}
                      </span>
                    </TableCell>

                    {/* Last seen — use lastSeenAt, fall back to updatedAt/createdAt */}
                    <TableCell className="text-right text-xs text-muted-foreground tabular-nums">
                      {formatRelativeTime(c.lastSeenAt ?? c.updatedAt ?? c.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

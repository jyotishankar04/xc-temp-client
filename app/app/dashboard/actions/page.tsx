"use client";

import Link from "next/link";
import { Bot, CheckCircle, Loader2, RotateCcw, User, XCircle, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActions, useApproveAction, useRejectAction } from "@/lib/hooks";
import type { Action } from "@/lib/api";

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

export default function ActionsPage() {
  const { data, isLoading, error } = useActions({ limit: 50 });
  const approveAction = useApproveAction();
  const rejectAction = useRejectAction();

  const actions = data?.actions ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recovery Actions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage and track recovery actions across your services
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-destructive">
              Failed to load recovery actions.
            </div>
          ) : actions.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No recovery actions found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Case</TableHead>
                  <TableHead className="text-right">Approval</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.map((action) => {
                  const status = statusConfig[action.status];
                  const isPending = action.status === "PENDING";
                  const isMutating =
                    approveAction.isPending || rejectAction.isPending;

                  return (
                    <TableRow key={action.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {typeIcons[action.actionType]}
                          <div>
                            <p className="text-sm font-medium">
                              {action.recommendation?.rationale || action.actionType}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Risk: {action.recommendation?.riskLevel ?? "Unknown"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {action.case?.service ? (
                          <Button variant="link" className="h-auto p-0 text-sm" asChild>
                            <Link href={`/app/dashboard/services/${action.case.service.id}/overview`}>
                              {action.case.service.name}
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="text-xs">
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          {action.approver ? (
                            <>
                              <User className="size-3.5" />
                              {action.approver.name}
                            </>
                          ) : (
                            <>
                              <Bot className="size-3.5" />
                              AI recommendation
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(action.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="link" className="h-auto p-0 font-mono text-xs" asChild>
                          <Link href={`/app/dashboard/failures/${action.caseId}`}>
                            {action.caseId.slice(0, 8)}...
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        {isPending ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectAction.mutate(action.id)}
                              disabled={isMutating}
                            >
                              <XCircle className="mr-1 size-3.5" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => approveAction.mutate(action.id)}
                              disabled={isMutating}
                            >
                              <CheckCircle className="mr-1 size-3.5" />
                              Approve
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(action.executedAt)}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

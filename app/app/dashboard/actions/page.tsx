"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RotateCcw, Bot, CheckCircle, User, XCircle, Zap } from "lucide-react";

type Action = {
  id: string;
  action: string;
  type: "rollback" | "restart" | "scale" | "alert";
  service: string;
  status: "pending" | "approved" | "executed" | "failed";
  triggeredBy: "user" | "ai";
  time: string;
  caseId?: string;
};

const actions: Action[] = [
  {
    id: "1",
    action: "Rollback payments-api",
    type: "rollback",
    service: "payments-api",
    status: "pending",
    triggeredBy: "ai",
    time: "10:52",
    caseId: "#142",
  },
  {
    id: "2",
    action: "Restart api-gateway",
    type: "restart",
    service: "api-gateway",
    status: "executed",
    triggeredBy: "ai",
    time: "10:40",
    caseId: "#141",
  },
  {
    id: "3",
    action: "Scale auth-service",
    type: "scale",
    service: "auth-service",
    status: "approved",
    triggeredBy: "user",
    time: "09:15",
    caseId: "#138",
  },
  {
    id: "4",
    action: "Rollback orders-service",
    type: "rollback",
    service: "orders-service",
    status: "executed",
    triggeredBy: "user",
    time: "08:30",
    caseId: "#139",
  },
  {
    id: "5",
    action: "Restart cache-service",
    type: "restart",
    service: "cache-service",
    status: "failed",
    triggeredBy: "ai",
    time: "07:45",
    caseId: "#138",
  },
];

const statusConfig: Record<Action["status"], { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
  pending: { variant: "secondary", label: "Pending" },
  approved: { variant: "default", label: "Approved" },
  executed: { variant: "outline", label: "Executed" },
  failed: { variant: "destructive", label: "Failed" },
};

const typeIcons = {
  rollback: <RotateCcw className="size-3.5" />,
  restart: <Zap className="size-3.5" />,
  scale: <Zap className="size-3.5" />,
  alert: <Zap className="size-3.5" />,
};

export default function ActionsPage() {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Triggered By</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Case</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => {
                const status = statusConfig[action.status];
                return (
                  <TableRow key={action.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {typeIcons[action.type]}
                        <span className="text-sm font-medium">{action.action}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal">
                        {action.service}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="text-xs capitalize">
                        {action.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        {action.triggeredBy === "ai" ? (
                          <Bot className="size-3.5" />
                        ) : (
                          <User className="size-3.5" />
                        )}
                        {action.triggeredBy === "ai" ? "AI" : "User"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {action.time}
                    </TableCell>
                    <TableCell>
                      {action.caseId && (
                        <span className="font-mono text-xs text-primary">
                          {action.caseId}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  AlertTriangle,
  SearchIcon,
  SlidersHorizontal,
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
  lastSeen: string;
  occurrences: number;
  confidence: number;
  environment: "production" | "staging";
};

const cases: FailureCase[] = [
  {
    id: "142",
    caseId: "#142",
    title: "Database Connection Timeout",
    service: "payments-api",
    severity: "high",
    status: "open",
    lastSeen: "2 min ago",
    occurrences: 37,
    confidence: 72,
    environment: "production",
  },
  {
    id: "141",
    caseId: "#141",
    title: "API Gateway Timeout",
    service: "api-gateway",
    severity: "medium",
    status: "open",
    lastSeen: "15 min ago",
    occurrences: 12,
    confidence: 85,
    environment: "production",
  },
  {
    id: "140",
    caseId: "#140",
    title: "Auth Service Latency",
    service: "auth-service",
    severity: "low",
    status: "open",
    lastSeen: "1 hr ago",
    occurrences: 5,
    confidence: 91,
    environment: "production",
  },
  {
    id: "139",
    caseId: "#139",
    title: "Order Processing Delay",
    service: "orders-service",
    severity: "medium",
    status: "resolved",
    lastSeen: "3 hrs ago",
    occurrences: 8,
    confidence: 78,
    environment: "staging",
  },
  {
    id: "138",
    caseId: "#138",
    title: "Redis Cache Miss Rate",
    service: "cache-service",
    severity: "low",
    status: "resolved",
    lastSeen: "5 hrs ago",
    occurrences: 22,
    confidence: 65,
    environment: "production",
  },
];

const severityVariants = {
  high: "destructive" as const,
  medium: "secondary" as const,
  low: "outline" as const,
};

const statusVariants = {
  open: "default" as const,
  resolved: "outline" as const,
};

export default function FailuresPage() {
  const [search, setSearch] = useState("");
  const [environment, setEnvironment] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.service.toLowerCase().includes(search.toLowerCase()) ||
      c.caseId.toLowerCase().includes(search.toLowerCase());
    const matchesEnv =
      environment === "all" || c.environment === environment;
    const matchesSev = severity === "all" || c.severity === severity;
    const matchesStatus = status === "all" || c.status === status;
    return matchesSearch && matchesEnv && matchesSev && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Failure Cases</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage all detected failure cases
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
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
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Case ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Occurrences</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No cases found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow
                      key={c.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <Link
                          href={`${ROUTES.DASHBOARD_FAILURES}/${c.id}`}
                          className="font-mono text-sm font-semibold text-primary hover:underline"
                        >
                          {c.caseId}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm max-w-48 truncate">
                        {c.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-normal">
                          {c.service}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={severityVariants[c.severity]} className="text-xs capitalize">
                          {c.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[c.status]} className="text-xs capitalize">
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.lastSeen}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {c.occurrences}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-medium">{c.confidence}%</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

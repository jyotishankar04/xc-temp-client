"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useRcaReports, useGenerateRca } from "@/lib/hooks";
import { useServices } from "@/lib/hooks";
import { Loader2, FileSearch, CheckCircle, Circle, ExternalLink, Boxes, XCircle } from "lucide-react";

export default function RcaPage() {
  const { data: reports = [], isLoading } = useRcaReports();
  const { data: services = [] } = useServices();
  const generateRca = useGenerateRca();

  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredReports = reports.length > 0 ? reports.filter((report) => {
    if (serviceFilter !== "all" && report.serviceId !== serviceFilter) return false;
    if (statusFilter === "reviewed" && !report.reviewed) return false;
    if (statusFilter === "pending" && report.reviewed) return false;
    if (search && !report.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }): [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">RCA Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Root cause analysis reports for incidents and failures
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-50">
              <Label className="text-xs text-muted-foreground">Service</Label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-50">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="pending">Unreviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-50">
              <Label className="text-xs text-muted-foreground">Search</Label>
              <Input 
                placeholder="Search reports..." 
                aria-label="Search RCA"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileSearch className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No RCA reports found</h3>
              <p className="text-muted-foreground text-sm">
                {search || serviceFilter !== "all" || statusFilter !== "all"
                  ? "No reports match your current filters."
                  : "Generate an RCA report from a case or failure."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Case ID</TableHead>
                  <TableHead className="w-30">Status</TableHead>
                  <TableHead className="w-45">Created</TableHead>
                  <TableHead className="w-25 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>
                      {report.serviceName ? (
                        <Link 
                          href={`/app/dashboard/services/${report.serviceId}/overview`}
                          className="text-sm hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Boxes className="size-3.5" />
                          {report.serviceName}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/app/dashboard/failures/${report.caseId}`}
                        className="text-sm hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {report.caseId.slice(0, 8)}...
                      </Link>
                    </TableCell>
                    <TableCell>
                      {report.status === "FAILED" ? (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="size-3" />
                          Failed
                        </Badge>
                      ) : report.status === "IN_PROGRESS" ? (
                        <Badge variant="secondary" className="gap-1">
                          <Loader2 className="size-3 animate-spin" />
                          Processing
                        </Badge>
                      ) : (
                        <Badge variant={report.reviewed ? "default" : "secondary"} className="gap-1">
                          {report.reviewed ? (
                            <>
                              <CheckCircle className="size-3" />
                              Reviewed
                            </>
                          ) : (
                            <>
                              <Circle className="size-3" />
                              Unreviewed
                            </>
                          )}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/app/dashboard/rca/${report.id}`} aria-label="Open RCA details">
                          <ExternalLink className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRcaById, useUpdateRca, useGenerateRca } from "@/lib/hooks";
import { Loader2, ArrowLeft, ExternalLink, Boxes, CheckCircle, Circle, Save, XCircle, RefreshCw, AlertTriangle, Bot } from "lucide-react";
import { JsonViewer } from "@/components/ui/json-viewer";

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
      <div className="flex items-center justify-center min-h-[400px]">
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/app/dashboard/rca" aria-label="Back to RCA list">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
          <p className="text-muted-foreground text-sm">
            Root Cause Analysis Report
          </p>
        </div>
        <Badge
          variant={report.status === "FAILED" ? "destructive" : report.reviewed ? "default" : "secondary"}
          className="gap-1.5"
        >
          {report.status === "FAILED" ? (
            <>
              <XCircle className="size-3.5" />
              Failed
            </>
          ) : report.status === "IN_PROGRESS" ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Processing
            </>
          ) : report.reviewed ? (
            <>
              <CheckCircle className="size-3.5" />
              Reviewed
            </>
          ) : (
            <>
              <Circle className="size-3.5" />
              Unreviewed
            </>
          )}
        </Badge>
      </div>

      {report.status === "IN_PROGRESS" && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          <Loader2 className="size-4 animate-spin text-primary shrink-0" />
          <span>AI analysis is in progress. This page refreshes automatically.</span>
        </div>
      )}

      {report.status === "FAILED" && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
          <div className="flex items-center gap-3 text-sm text-destructive">
            <XCircle className="size-4 shrink-0" />
            <span>RCA generation failed. You can retry the analysis below.</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => generateRca.mutate(report.caseId)}
            disabled={generateRca.isPending}
          >
            {generateRca.isPending ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="size-4 mr-2" />
            )}
            Retry
          </Button>
        </div>
      )}

      {report.status === "COMPLETED" && report.confidenceScore > 0 && report.confidenceScore < 5 && (
        <div className="flex items-center gap-3 rounded-lg border border-severity-medium/20 bg-severity-medium/5 px-4 py-3 text-sm">
          <AlertTriangle className="size-4 text-severity-medium shrink-0" />
          <span className="text-severity-medium">
            Low confidence score ({report.confidenceScore}/10). This analysis is based on limited evidence — review findings carefully before acting.
          </span>
        </div>
      )}

      {report.status === "COMPLETED" && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Bot className="size-3.5" />
          <span>AI-generated analysis · {report.modelVersion ?? "AI model"} · Always verify before taking action</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {report.serviceName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Service</p>
                    <Link 
                      href={`/app/dashboard/services/${report.serviceId}/overview`}
                      className="font-medium hover:underline flex items-center gap-1"
                    >
                      <Boxes className="size-3.5" />
                      {report.serviceName}
                    </Link>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Related Case</p>
                  <Link 
                    href={`/app/dashboard/failures/${report.caseId}`}
                    className="font-medium hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="size-3.5" />
                    View Case
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm">
                    {report.updatedAt ? new Date(report.updatedAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>

              {report.summary && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Summary</p>
                  <p className="text-sm p-3 bg-muted rounded-lg">{report.summary}</p>
                </div>
              )}

              {report.explanation && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {report.status === "FAILED" ? "Error" : "Explanation"}
                  </p>
                  <p className={`text-sm p-3 rounded-lg ${report.status === "FAILED" ? "bg-destructive/10 text-destructive" : "bg-muted"}`}>
                    {report.explanation}
                  </p>
                </div>
              )}

              {report.rootCause && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Root Cause</p>
                  <p className="text-sm p-3 bg-muted rounded-lg">{report.rootCause}</p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSaveNotes}
                    disabled={isSaving || notes === report.notes}
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
                <Textarea 
                  placeholder="Add your notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {report.status === "FAILED" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => generateRca.mutate(report.caseId)}
                  disabled={generateRca.isPending}
                >
                  {generateRca.isPending ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="size-4 mr-2" />
                  )}
                  Retry RCA Generation
                </Button>
              )}

              <Button
                variant={report.reviewed ? "outline" : "default"}
                className="w-full justify-start"
                onClick={handleToggleReviewed}
                disabled={updateRca.isPending || report.status !== "COMPLETED"}
              >
                {report.reviewed ? (
                  <>
                    <Circle className="size-4 mr-2" />
                    Mark as Unreviewed
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4 mr-2" />
                    Mark as Reviewed
                  </>
                )}
              </Button>
              
              {report.caseId && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/app/dashboard/failures/${report.caseId}`}>
                    <ExternalLink className="size-4 mr-2" />
                    View Related Case
                  </Link>
                </Button>
              )}
              
              {report.serviceId && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/app/dashboard/services/${report.serviceId}/overview`}>
                    <Boxes className="size-4 mr-2" />
                    View Service
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Report Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Report ID</span>
                <span className="font-mono text-xs">{report.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Case ID</span>
                <span className="font-mono text-xs">{report.caseId.slice(0, 8)}...</span>
              </div>
              {report.serviceName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span>{report.serviceName}</span>
                </div>
              )}
              {report.severity && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Severity</span>
                  <span className="capitalize">{report.severity.toLowerCase()}</span>
                </div>
              )}
              {report.modelVersion && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span className="text-xs font-mono">{report.modelVersion}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Confidence</span>
                <span>{report.confidenceScore > 0 ? `${report.confidenceScore}/10` : "N/A"}</span>
              </div>
              {report.affectedServices && report.affectedServices.length > 0 && (
                <div>
                  <span className="text-muted-foreground block mb-1">Affected Services</span>
                  <div className="flex flex-wrap gap-1">
                    {report.affectedServices.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {report.createdAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {report.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{new Date(report.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

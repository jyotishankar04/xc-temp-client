"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RCAReport {
  id: string;
  caseId: string;
  summary: string;
  rootCause: string;
  confidence: number;
  createdAt: string;
}

export default function RCAPage() {
  const [reports, setReports] = useState<RCAReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/rca`,
          { credentials: "include" }
        );
        const data = await response.json();
        
        if (data.success) {
          setReports(data.data || []);
        } else {
          setError(data.message || "Failed to load RCA reports");
        }
      } catch (err) {
        setError("Failed to load RCA reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">RCA Reports</h1>
        <p className="text-muted-foreground mt-1">
          Root Cause Analysis reports for incidents
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No RCA reports available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Reports are generated when you create an incident case
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Case: {report.caseId.slice(0, 8)}</CardTitle>
                  <Badge variant={report.confidence > 70 ? "default" : "secondary"}>
                    {report.confidence}% confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Summary</h4>
                    <p className="text-sm text-muted-foreground">{report.summary}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Root Cause</h4>
                    <p className="text-sm text-muted-foreground">{report.rootCause}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generated: {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
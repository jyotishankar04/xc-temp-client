"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Loader2, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RollbackHistory {
  id: string;
  serviceId: string;
  caseId: string | null;
  triggeredAt: string;
  stableCommit: string;
  status: "INITIATED" | "COMPLETED" | "FAILED";
  completedAt: string | null;
}

export default function RollbackPage() {
  const [history, setHistory] = useState<RollbackHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services`,
          { credentials: "include" }
        );
        const data = await response.json();
        
        if (data.success && data.data?.length > 0) {
          const serviceId = data.data[0].id;
          const historyResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/services/${serviceId}/rollback-history`,
            { credentials: "include" }
          );
          const historyData = await historyResponse.json();
          setHistory(historyData.data || []);
        }
      } catch (err) {
        setError("Failed to load rollback history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Initiated</Badge>;
    }
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Rollback History</h1>
        <p className="text-muted-foreground mt-1">
          View and manage rollback operations
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-lg">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ArrowLeftRight className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No rollback history</p>
            <p className="text-sm text-muted-foreground mt-1">
              Rollback history will appear when incidents trigger automatic rollbacks
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Rollback to {item.stableCommit.slice(0, 7)}</CardTitle>
                  {getStatusBadge(item.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Triggered: </span>
                    <span>{new Date(item.triggeredAt).toLocaleString()}</span>
                  </div>
                  {item.caseId && (
                    <div>
                      <span className="text-muted-foreground">Case: </span>
                      <span className="font-mono">{item.caseId.slice(0, 8)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
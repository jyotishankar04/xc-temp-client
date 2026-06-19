"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Package, Loader2, GitCommit, ShieldCheck, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { servicesApi } from "@/lib/api";

function formatDate(value: string | null) {
  if (!value) return "Not set";
  return new Date(value).toLocaleString();
}

export default function ServiceDeploymentsPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;

  const deploymentsQuery = useQuery({
    queryKey: ["services", serviceId, "deployments"],
    queryFn: async () => {
      const res = await servicesApi.getDeployments(serviceId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch deployments");
      }
      return res.data ?? [];
    },
    enabled: !!serviceId,
  });

  if (deploymentsQuery.isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Deployments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Deployment history, release context, and stable version tracking for this service.
        </p>
      </div>

      {deploymentsQuery.data?.length ? (
        <div className="grid gap-4">
          {deploymentsQuery.data.map((deployment) => (
            <Card key={deployment.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Package className="size-4" />
                    {deployment.version || deployment.release || deployment.commitHash || "Deployment"}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {deployment.branch || "main"} · {deployment.environment}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{deployment.status}</Badge>
                  {deployment.isStable && (
                    <Badge variant="outline" className="gap-1">
                      <ShieldCheck className="size-3.5" />
                      Stable
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Commit</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <GitCommit className="size-4 text-muted-foreground" />
                    {deployment.commitHash ? deployment.commitHash.slice(0, 12) : "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Deployed</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <Clock3 className="size-4 text-muted-foreground" />
                    {formatDate(deployment.deployedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Completed</p>
                  <p className="mt-1 text-sm font-medium">{formatDate(deployment.completedAt)}</p>
                </div>
                {deployment.metadata && (
                  <div className="md:col-span-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Metadata</p>
                    <pre className="mt-2 overflow-x-auto rounded-xl border bg-muted/30 p-3 text-xs">
                      {JSON.stringify(deployment.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No deployments recorded yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

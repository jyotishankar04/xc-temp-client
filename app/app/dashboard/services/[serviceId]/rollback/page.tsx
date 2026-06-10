"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useRollbackConfig,
  useRollbackHistory,
  useUpdateRollbackConfig,
  useTriggerRollback,
} from "@/lib/hooks";
import { AlertTriangle, ExternalLink, Loader2, RotateCcw, Save, XCircle } from "lucide-react";
import { handleApiError } from "@/lib/api";

export default function ServiceRollbackPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;
  const { data: config, isLoading } = useRollbackConfig(serviceId);
  const { data: history = [] } = useRollbackHistory(serviceId, 10);
  const updateConfig = useUpdateRollbackConfig();
  const triggerRollback = useTriggerRollback();
  const [draft, setDraft] = useState<{
    enabled?: boolean;
    threshold?: number;
    workflow?: string;
  }>({});
  const [caseId, setCaseId] = useState("");

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidUuid = !caseId || UUID_REGEX.test(caseId);

  const enabled = draft.enabled ?? config?.autoRollbackEnabled ?? false;
  const threshold = draft.threshold ?? config?.autoRollbackThreshold ?? 85;
  const workflow = draft.workflow ?? config?.rollbackWorkflow ?? "";

  const saveConfig = async () => {
    await updateConfig.mutateAsync({
      serviceId,
      data: {
        autoRollbackEnabled: enabled,
        autoRollbackThreshold: threshold,
        rollbackWorkflow: workflow || null,
      },
    });
    setDraft({});
  };

  const runRollback = async () => {
    await triggerRollback.mutateAsync({ serviceId, caseId });
    setCaseId("");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Rollback Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {!config?.hasRepoMapping && (
              <div className="flex items-start gap-3 rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                Repository mapping is required before rollback can run.
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="workflow">Rollback workflow</Label>
                <Input
                id="workflow"
                value={workflow}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, workflow: event.target.value }))
                }
                placeholder=".github/workflows/rollback.yml"
              />
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Auto-rollback signal</p>
                  <p className="text-pretty mt-1 text-xs text-muted-foreground">
                    Keeps production rollback gated by approval.
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(value) =>
                    setDraft((current) => ({ ...current, enabled: value }))
                  }
                />
              </div>
              <div className="mt-4 grid gap-2">
                <Label htmlFor="threshold">Confidence threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  min={0}
                  max={100}
                  value={threshold}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, threshold: Number(event.target.value) }))
                  }
                />
              </div>
            </div>

            {updateConfig.isError && (
              <p className="text-xs text-destructive">{handleApiError(updateConfig.error)}</p>
            )}
            <Button onClick={saveConfig} disabled={updateConfig.isPending}>
              {updateConfig.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              Save Policy
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rollback History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No rollback executions yet.
              </p>
            ) : (
              <div className="divide-y rounded-md border">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.status === "FAILED" ? "destructive" : "secondary"}>
                          {item.status}
                        </Badge>
                        <span className="font-mono text-xs text-muted-foreground">
                          {item.stableCommit.slice(0, 8)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(item.triggeredAt).toLocaleString()}
                      </p>
                    </div>
                    {item.workflowUrl && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={item.workflowUrl} target="_blank" rel="noreferrer" aria-label="Open workflow URL">
                          <ExternalLink className="size-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Manual Rollback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-pretty text-sm text-muted-foreground">
            Trigger rollback for a specific case after approval.
          </p>

          {triggerRollback.isError && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="mt-0.5 size-4 shrink-0" />
              <span>{handleApiError(triggerRollback.error)}</span>
            </div>
          )}

          {triggerRollback.isSuccess && (
            <div className="rounded-md border border-success/30 bg-success/10 p-3 text-sm text-success">
              Rollback triggered successfully. Check the workflow URL in history below.
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="case-id">Case ID</Label>
            <Input
              id="case-id"
              value={caseId}
              onChange={(event) => setCaseId(event.target.value)}
              placeholder="Failure case UUID"
              className={!isValidUuid ? "border-destructive" : ""}
            />
            {!isValidUuid && (
              <p className="text-xs text-destructive">Must be a valid UUID</p>
            )}
          </div>
          <Button
            className="w-full"
            variant="destructive"
            onClick={runRollback}
            disabled={!caseId || !isValidUuid || triggerRollback.isPending}
          >
            {triggerRollback.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <RotateCcw className="mr-2 size-4" />
            )}
            Trigger Rollback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useRollbackConfig,
  useRollbackHistory,
  useUpdateRollbackConfig,
  useTriggerRollback,
  useGitHubWorkflows,
} from "@/lib/hooks";
import { AlertTriangle, ExternalLink, Loader2, RotateCcw, Save, ShieldCheck, XCircle } from "lucide-react";
import { handleApiError } from "@/lib/api";
import type { RollbackWorkflowMode } from "@/lib/api/modules/rollbackApi";

export default function ServiceRollbackPage() {
  const params = useParams();
  const serviceId = params?.serviceId as string;
  const { data: config, isLoading } = useRollbackConfig(serviceId);
  const { data: history = [] } = useRollbackHistory(serviceId, 10);
  const { data: repoWorkflows = [] } = useGitHubWorkflows(config?.repoMapping?.repoId ?? undefined);
  const updateConfig = useUpdateRollbackConfig();
  const triggerRollback = useTriggerRollback();
  const [draft, setDraft] = useState<{
    enabled?: boolean;
    threshold?: number;
    workflowMode?: RollbackWorkflowMode;
    workflow?: string;
    templateKey?: string | null;
    customYaml?: string | null;
  }>({});
  const [caseId, setCaseId] = useState("");

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidUuid = !caseId || UUID_REGEX.test(caseId);

  const enabled = draft.enabled ?? config?.autoRollbackEnabled ?? false;
  const threshold = draft.threshold ?? config?.autoRollbackThreshold ?? 85;
  const workflowMode = draft.workflowMode ?? config?.rollbackWorkflowMode ?? "TEMPLATE";
  const workflow = draft.workflow ?? config?.rollbackWorkflow ?? "";
  const templateKey = draft.templateKey ?? config?.rollbackTemplateKey ?? config?.templates?.[0]?.key ?? "";
  const customYaml = draft.customYaml ?? config?.rollbackCustomYaml ?? "";
  const selectedTemplate = config?.templates?.find((template) => template.key === templateKey);
  const isCustomPathValid = !workflow || /^\.github\/workflows\/[A-Za-z0-9._-]+\.(ya?ml)$/.test(workflow);

  const saveConfig = async () => {
    await updateConfig.mutateAsync({
      serviceId,
      data: {
        autoRollbackEnabled: enabled,
        autoRollbackThreshold: threshold,
        rollbackWorkflowMode: workflowMode,
        rollbackTemplateKey: workflowMode === "TEMPLATE" ? templateKey || null : null,
        rollbackWorkflow: workflowMode === "CUSTOM" ? workflow || null : null,
        rollbackCustomYaml: workflowMode === "CUSTOM" && customYaml.trim() ? customYaml : null,
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

            <div className="grid gap-3">
              <Label>Workflow source</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={workflowMode === "TEMPLATE" ? "default" : "outline"}
                  onClick={() => setDraft((current) => ({ ...current, workflowMode: "TEMPLATE" }))}
                >
                  Template workflow
                </Button>
                <Button
                  type="button"
                  variant={workflowMode === "CUSTOM" ? "default" : "outline"}
                  onClick={() => setDraft((current) => ({ ...current, workflowMode: "CUSTOM" }))}
                >
                  Custom workflow
                </Button>
              </div>
            </div>

            {workflowMode === "TEMPLATE" ? (
              <div className="space-y-4 rounded-md border p-4">
                <div className="grid gap-2">
                  <Label htmlFor="rollback-template">Production template</Label>
                  <Select
                    value={templateKey}
                    onValueChange={(value) =>
                      setDraft((current) => ({ ...current, templateKey: value }))
                    }
                  >
                    <SelectTrigger id="rollback-template">
                      <SelectValue placeholder="Select rollback template" />
                    </SelectTrigger>
                    <SelectContent>
                      {(config?.templates ?? []).map((template) => (
                        <SelectItem key={template.key} value={template.key}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate && (
                  <div className="space-y-3 text-sm">
                    <div className="rounded-md bg-muted/50 p-3">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                        <div>
                          <p className="font-medium">{selectedTemplate.workflowPath}</p>
                          <p className="mt-1 text-muted-foreground">{selectedTemplate.description}</p>
                        </div>
                      </div>
                    </div>
                    {selectedTemplate.requiredSecrets.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.requiredSecrets.map((secret) => (
                          <Badge key={secret} variant="outline">
                            {secret}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {selectedTemplate.recommendations.map((recommendation) => (
                        <li key={recommendation}>- {recommendation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 rounded-md border p-4">
                <div className="grid gap-2">
                  <Label htmlFor="workflow">Custom workflow path</Label>
                  {repoWorkflows.length > 0 ? (
                    <Select
                      value={workflow || "manual"}
                      onValueChange={(value) =>
                        setDraft((current) => ({
                          ...current,
                          workflow: value === "manual" ? "" : value,
                        }))
                      }
                    >
                      <SelectTrigger id="workflow">
                        <SelectValue placeholder="Select workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Enter path manually</SelectItem>
                        {repoWorkflows.map((repoWorkflow) => (
                          <SelectItem key={repoWorkflow.id} value={repoWorkflow.path}>
                            {repoWorkflow.name} - {repoWorkflow.path}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                  <Input
                    value={workflow}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, workflow: event.target.value }))
                    }
                    placeholder=".github/workflows/rollback.yml"
                    className={!isCustomPathValid ? "border-destructive" : ""}
                  />
                  {!isCustomPathValid && (
                    <p className="text-xs text-destructive">
                      Use a path like .github/workflows/rollback.yml.
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="custom-yaml">Custom workflow YAML</Label>
                  <Textarea
                    id="custom-yaml"
                    value={customYaml}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, customYaml: event.target.value }))
                    }
                    placeholder={"name: Production rollback\non:\n  workflow_dispatch:\n    inputs:\n      commit_sha:\n        required: true\njobs:\n  rollback:\n    runs-on: ubuntu-latest"}
                    className="min-h-56 font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave YAML empty to dispatch an existing workflow file. Custom YAML must define workflow_dispatch and jobs.
                  </p>
                </div>
              </div>
            )}

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
            <Button
              onClick={saveConfig}
              disabled={updateConfig.isPending || (workflowMode === "CUSTOM" && !isCustomPathValid)}
            >
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

"use client";

import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useGitHubWorkflows } from "@/lib/hooks";
import { useCreateServiceWizard } from "../create-service-provider";

const rollbackDeployments = new Set(["GITHUB_ACTIONS", "KUBERNETES"]);

export function RollbackStep() {
  const { state, updateState, goBack, goNext } = useCreateServiceWizard();
  const { data: workflows = [] } = useGitHubWorkflows(state.selectedRepo?.id);
  const supportsRollback = rollbackDeployments.has(state.deploymentType);

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-lg font-semibold">Rollback configuration</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure the workflow XecureCode can use when recovery needs human-approved rollback.
          </p>
        </div>

        {!supportsRollback ? (
          <div className="rounded-md border bg-muted/40 p-4 text-sm text-muted-foreground">
            Rollback automation is optional for {state.deploymentType.replace("_", " ").toLowerCase()}.
            You can still create the service and configure recovery later.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-2">
              <Label>Rollback workflow</Label>
              {workflows.length > 0 ? (
                <Select
                  value={state.rollbackWorkflow || "none"}
                  onValueChange={(value) =>
                    updateState({ rollbackWorkflow: value === "none" ? "" : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Configure later</SelectItem>
                    {workflows.map((workflow) => (
                      <SelectItem key={workflow.id} value={workflow.path}>
                        {workflow.name} · {workflow.path}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={state.rollbackWorkflow}
                  onChange={(event) => updateState({ rollbackWorkflow: event.target.value })}
                  placeholder=".github/workflows/rollback.yml"
                />
              )}
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Enable auto-rollback signals</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Production rollbacks still require human approval.
                  </p>
                </div>
                <Switch
                  checked={state.autoRollbackEnabled}
                  onCheckedChange={(autoRollbackEnabled) =>
                    updateState({ autoRollbackEnabled })
                  }
                />
              </div>
              {state.autoRollbackEnabled && (
                <div className="mt-4 grid gap-2">
                  <Label htmlFor="rollback-threshold">Confidence threshold</Label>
                  <Input
                    id="rollback-threshold"
                    type="number"
                    min={0}
                    max={100}
                    value={state.autoRollbackThreshold}
                    onChange={(event) =>
                      updateState({
                        autoRollbackThreshold: Number(event.target.value),
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          <p>
            Auto-rollback is stored as policy only. Production execution must still flow
            through approval before destructive changes run.
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={goNext}>
            Continue
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

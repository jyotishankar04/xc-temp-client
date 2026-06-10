"use client";

import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateServiceWizard } from "../create-service-provider";

export function ReviewStep() {
  const { state, setCurrentStep, goBack, createService, isSubmitting, error } =
    useCreateServiceWizard();

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-balance text-lg font-semibold">Review configuration</h2>
          <p className="text-pretty mt-1 text-sm text-muted-foreground">
            Confirm the service mapping before creating the SDK key.
          </p>
        </div>

        <div className="grid gap-4">
          <ReviewSection
            title="GitHub"
            onEdit={() => setCurrentStep(0)}
            rows={[
              ["Repository", state.selectedRepo?.fullName ?? "-"],
              ["Branch", state.defaultBranch],
            ]}
          />
          <ReviewSection
            title="Service"
            onEdit={() => setCurrentStep(1)}
            rows={[
              ["Name", state.name],
              ["Environment", state.env],
              ["Description", state.description || "-"],
            ]}
          />
          <ReviewSection
            title="Deployment"
            onEdit={() => setCurrentStep(2)}
            rows={[
              ["Strategy", state.deploymentType.replace("_", " ")],
              ["Rollback workflow", state.rollbackWorkflow || "Configure later"],
              ["Auto-rollback", state.autoRollbackEnabled ? `${state.autoRollbackThreshold}%` : "Disabled"],
            ]}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-between">
          <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={createService} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Plus className="mr-2 size-4" />
            )}
            Create Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewSection({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: Array<[string, string]>;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-balance text-sm font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
      <Separator className="my-3" />
      <div className="grid gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[140px_1fr] gap-3 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

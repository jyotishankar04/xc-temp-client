"use client";

import {
  ArrowLeft,
  ArrowRight,
  Box,
  Container,
  Github,
  Layers,
  Server,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGitHubBranches } from "@/lib/hooks";
import type { DeploymentType } from "@/lib/types/service";
import { useCreateServiceWizard } from "../create-service-provider";

const deploymentOptions: Array<{
  value: DeploymentType;
  label: string;
  description: string;
  icon: React.ElementType;
}> = [
  { value: "GITHUB_ACTIONS", label: "GitHub Actions", description: "Workflow based deploys", icon: Github },
  { value: "VERCEL", label: "Vercel", description: "Preview and prod deploys", icon: Layers },
  { value: "KUBERNETES", label: "Kubernetes", description: "Cluster rollout controls", icon: Container },
  { value: "DOCKER", label: "Docker", description: "Image based deploys", icon: Box },
  { value: "MANUAL", label: "Manual", description: "Human operated release", icon: Settings2 },
  { value: "OTHER", label: "Other", description: "Custom deployment path", icon: Server },
];

export function DeploymentStep() {
  const { state, updateState, goBack, goNext, canContinue } = useCreateServiceWizard();
  const { data: branches = [], isLoading } = useGitHubBranches(state.selectedRepo?.id);
  const branchOptions = branches.length > 0 ? branches : [{ name: state.defaultBranch }];

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-balance text-lg font-semibold">Branch and deployment</h2>
          <p className="text-pretty mt-1 text-sm text-muted-foreground">
            These settings drive setup docs and rollback configuration.
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium" htmlFor="production-branch">Production branch</label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={state.defaultBranch}
              onValueChange={(defaultBranch) => updateState({ defaultBranch })}
            >
              <SelectTrigger id="production-branch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch.name} value={branch.name}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {deploymentOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = state.deploymentType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateState({ deploymentType: option.value })}
                className={cn(
                  "rounded-md border p-4 text-left transition-colors hover:bg-muted/60",
                  isSelected && "border-primary bg-primary/5 ring-1 ring-primary"
                )}
              >
                <Icon className="size-5 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">{option.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button onClick={goNext} disabled={!canContinue}>
            Continue
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

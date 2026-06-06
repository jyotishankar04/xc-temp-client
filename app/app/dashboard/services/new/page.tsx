"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateServiceProvider, useCreateServiceWizard } from "@/components/dashboard/create-service/create-service-provider";
import { StepIndicator } from "@/components/dashboard/create-service/step-indicator";
import { GitHubConnectStep } from "@/components/dashboard/create-service/steps/github-connect-step";
import { BasicInfoStep } from "@/components/dashboard/create-service/steps/basic-info-step";
import { DeploymentStep } from "@/components/dashboard/create-service/steps/deployment-step";
import { RollbackStep } from "@/components/dashboard/create-service/steps/rollback-step";
import { ReviewStep } from "@/components/dashboard/create-service/steps/review-step";
import { SdkSetupStep } from "@/components/dashboard/create-service/steps/sdk-setup-step";

function StepContent() {
  const { currentStep } = useCreateServiceWizard();

  if (currentStep === 0) return <GitHubConnectStep />;
  if (currentStep === 1) return <BasicInfoStep />;
  if (currentStep === 2) return <DeploymentStep />;
  if (currentStep === 3) return <RollbackStep />;
  if (currentStep === 4) return <ReviewStep />;
  return <SdkSetupStep />;
}

export default function CreateServicePage() {
  return (
    <CreateServiceProvider>
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
              <Link href="/app/dashboard/services">
                <ArrowLeft className="mr-2 size-4" />
                Services
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Create Service</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect a repository, define deployment metadata, and generate an SDK key.
            </p>
          </div>
        </div>

        <StepIndicator />
        <StepContent />
      </div>
    </CreateServiceProvider>
  );
}

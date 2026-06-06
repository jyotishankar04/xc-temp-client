"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateServiceWizard } from "./create-service-provider";

const steps = ["GitHub", "Info", "Deploy", "Rollback", "Review"];

export function StepIndicator() {
  const { currentStep, setCurrentStep } = useCreateServiceWizard();

  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {steps.map((label, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <button
            key={label}
            type="button"
            onClick={() => index <= currentStep && setCurrentStep(index)}
            disabled={index > currentStep}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
              isCurrent && "border-primary bg-primary/5 text-primary",
              isComplete && "border-primary/40 bg-primary/10",
              !isCurrent && !isComplete && "text-muted-foreground",
              index > currentStep && "cursor-not-allowed opacity-60"
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                isCurrent && "border-primary bg-primary text-primary-foreground",
                isComplete && "border-primary bg-primary text-primary-foreground"
              )}
            >
              {isComplete ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className="font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

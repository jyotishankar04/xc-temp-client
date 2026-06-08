"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CheckIcon,
  ChevronRightIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  KeyRoundIcon,
  PlugZapIcon,
  RadioTowerIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SetupGuideStep = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status: "completed" | "pending";
};

const setupGuideSteps: SetupGuideStep[] = [
  {
    title: "Create your first service",
    description: "Register the application that will send reliability events.",
    icon: PlugZapIcon,
    href: "/app/dashboard/services/new",
    status: "pending",
  },
  {
    title: "Generate a service API key",
    description: "Use the key to authenticate SDK ingest requests.",
    icon: KeyRoundIcon,
    href: "/docs/getting-started",
    status: "pending",
  },
  {
    title: "Install the SDK",
    description: "Open the SDK installation guide for supported runtimes.",
    icon: FileTextIcon,
    href: "/docs/sdk/installation",
    status: "pending",
  },
  {
    title: "Choose your framework guide",
    description: "Use FastAPI, Flask, Django, Express, Fastify, or standalone guides.",
    icon: LayoutDashboardIcon,
    href: "/docs/sdk",
    status: "pending",
  },
  {
    title: "Send a test failure event",
    description: "Trigger a test exception and verify ingestion in the dashboard.",
    icon: RadioTowerIcon,
    href: "/docs/sdk/quick-start",
    status: "pending",
  },
];

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-(--breakpoint-md) px-0 py-2 sm:py-6">
      <h1 className="text-2xl font-medium tracking-normal sm:text-3xl">
        Connect your service
      </h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        Use the dashboard and SDK documentation to start sending reliability
        events.
      </p>

      <div className="mt-6 flex flex-col divide-y overflow-hidden rounded-xl border bg-card shadow-lg/[0.03]">
        {setupGuideSteps.map((step) => (
          <div
            className={cn(
              "relative isolate flex items-center gap-5 px-6 py-4 sm:px-8",
              {
                "bg-primary/8": step.status === "completed",
                "transition-colors hover:bg-muted/50": step.status === "pending",
              },
            )}
            key={step.title}
          >
            <div
              className={cn(
                "absolute inset-y-0 -z-1 translate-x-4 border-r border-dashed",
                {
                  "border-primary/20 dark:border-primary/25":
                    step.status === "completed",
                },
              )}
            />

            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full bg-muted",
                {
                  "bg-primary": step.status === "completed",
                  "border border-dashed": step.status === "pending",
                },
              )}
            >
              {step.status === "completed" ? (
                <CheckIcon className="size-4 text-primary-foreground" />
              ) : (
                <step.icon className="size-4" />
              )}
            </div>

            <div className="flex grow flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-5">
              <div className="min-w-0 flex-1">
                <h2 className="font-medium">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>

              <div className="leading-none">
                {step.status === "completed" && <Badge>Completed</Badge>}
                {step.status === "pending" && (
                  <Button
                    asChild
                    className="h-6 sm:ml-0"
                    size="sm"
                    variant="secondary"
                  >
                    <Link href={step.href}>
                      Start <ChevronRightIcon />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { CheckCircle2, Copy, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateServiceWizard } from "../create-service-provider";

export function SdkSetupStep() {
  const { state, resetWizard } = useCreateServiceWizard();
  const service = state.createdService;
  const apiKey = state.apiKey?.key;

  const installCommand = "npm install @xecurecode/sdk";
  const initSnippet = `import { initReliability } from "@xecurecode/sdk";

initReliability({
  apiKey: "${apiKey ?? "create an API key from the API Keys tab"}",
  serviceId: "${service?.id ?? ""}",
  service: "${service?.name ?? ""}",
  environment: "${service?.env ?? "PRODUCTION"}"
});`;

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 size-6 text-primary" />
          <div>
            <h2 className="text-balance text-xl font-semibold">Service created successfully</h2>
            <p className="text-pretty mt-1 text-sm text-muted-foreground">
              Install the SDK and initialize it with the key below.
            </p>
          </div>
        </div>

        <CodeBlock
          title="API key"
          value={apiKey ?? "API key generation failed. Create one from the API Keys tab."}
          onCopy={copy}
        />
        <CodeBlock title="Install SDK" value={installCommand} onCopy={copy} />
        <CodeBlock title="Initialize" value={initSnippet} onCopy={copy} multiline />

        <div className="flex flex-wrap gap-3">
          {service?.id && (
            <Button asChild>
              <Link href={`/app/dashboard/services/${service.id}/overview`}>
                Go to Service
                <ExternalLink className="ml-2 size-4" />
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={resetWizard}>
            <Plus className="mr-2 size-4" />
            Create Another
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CodeBlock({
  title,
  value,
  multiline,
  onCopy,
}: {
  title: string;
  value: string;
  multiline?: boolean;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <p className="text-sm font-medium">{title}</p>
        <Button variant="ghost" size="sm" onClick={() => onCopy(value)}>
          <Copy className="mr-2 size-4" />
          Copy
        </Button>
      </div>
      <pre className={`overflow-x-auto p-4 text-xs ${multiline ? "whitespace-pre" : ""}`}>
        <code>{value}</code>
      </pre>
    </div>
  );
}

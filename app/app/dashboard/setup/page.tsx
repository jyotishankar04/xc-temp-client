"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy, Settings2 } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Install the SDK",
    description: "Add the XecureCode SDK to your project",
    code: "npm install @xecurecode/sdk",
  },
  {
    number: "2",
    title: "Add your API key",
    description: "Configure your service with the API key from your dashboard",
    code: `initReliability({
  apiKey: "sk_live_xxxx",
  service: "payments-api"
});`,
  },
  {
    number: "3",
    title: "Start sending events",
    description: "Automatically capture errors and performance events",
    code: `// Errors are captured automatically
// You can also manually report events:`,
  },
];

export default function SetupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connect your service</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Integrate XecureCode SDK into your service in minutes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <Card key={step.number}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {step.number}
                  </div>
                  <div>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-lg bg-muted p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-muted-foreground whitespace-pre-wrap">
                    {step.code}
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 size-7"
                    onClick={() => navigator.clipboard.writeText(step.code)}
                  >
                    <Copy className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SDK Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Automatic error capturing",
                "Performance monitoring",
                "AI-powered root cause analysis",
                "Real-time alerting",
                "Deployment correlation",
                "Custom event tracking",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="size-4 text-success shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supported Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Node.js", "Python", "Go", "Ruby", "Java", ".NET", "PHP"].map(
                  (lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Need help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Check our documentation for detailed integration guides.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/docs/sdk" target="_blank" rel="noopener noreferrer">
                  <Settings2 className="size-4 mr-2" />
                  View Documentation
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {label && <div className="text-xs text-muted-foreground mb-1">{label}</div>}
      <div className="bg-slate-950 rounded-md p-4 flex items-center justify-between">
        <code className="text-sky-400 font-mono text-sm overflow-x-auto whitespace-pre">{code}</code>
        <Button variant="ghost" size="sm" onClick={copy} className="shrink-0">
          {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

export default function JavaSpringBootPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/go" className="hover:text-foreground">Java</Link>
        <span>/</span>
        <span className="text-foreground">Spring Boot</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Java</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Spring Boot Integration</h1>
      <p className="text-muted-foreground mb-8">
        Zero-configuration error capture for Spring Boot applications via auto-configuration.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Add Maven Dependency</h2>
          <CodeBlock code={`<dependency>
  <groupId>com.xel</groupId>
  <artifactId>reliability-sdk</artifactId>
  <version>0.1.0</version>
</dependency>`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Configure application.properties</h2>
          <CodeBlock code={`reliability.api-key=YOUR_API_KEY
reliability.service-id=your-service-id
reliability.mode=production`} />
          <p className="text-sm text-muted-foreground mt-2">
            The SDK auto-configures itself via Spring Boot's <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">@ConfigurationProperties</code>. No code changes needed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">How it works</h2>
          <p className="text-muted-foreground mb-4">
            The SDK registers a <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">@ControllerAdvice</code> that intercepts all unhandled exceptions from your controllers and automatically captures them with full request context (method, URL, IP).
          </p>
          <CodeBlock code={`// You don't need to write this — it's provided by the SDK automatically.
// Shown here for transparency:

@ControllerAdvice
public class ReliabilityExceptionHandler {
    @ExceptionHandler(Exception.class)
    public void handleException(Exception ex, WebRequest request) {
        reliabilityClient.capture(ex, extractContext(request));
    }
}`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Manual Capture</h2>
          <p className="text-muted-foreground mb-4">
            Inject the client anywhere you need to capture errors manually:
          </p>
          <CodeBlock code={`@Service
public class MyService {
    private final ReliabilityClient reliabilityClient;

    public MyService(ReliabilityClient reliabilityClient) {
        this.reliabilityClient = reliabilityClient;
    }

    public void doWork() {
        try {
            riskyOperation();
        } catch (Exception e) {
            reliabilityClient.capture(e);
        }
    }
}`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Configuration Properties</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Property</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-mono">reliability.api-key</td>
                  <td className="py-2 text-muted-foreground">String</td>
                  <td className="py-2">Your API key (required)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">reliability.service-id</td>
                  <td className="py-2 text-muted-foreground">String</td>
                  <td className="py-2">Your service ID (required)</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">reliability.mode</td>
                  <td className="py-2 text-muted-foreground">String</td>
                  <td className="py-2">"development" or "production" (default: "development")</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/go/basic">← Back to Standalone</Link>
          </Button>
          <Button asChild className="bg-sky-500 hover:bg-sky-600">
            <Link href="/docs/sdk/installation">Back to Docs →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

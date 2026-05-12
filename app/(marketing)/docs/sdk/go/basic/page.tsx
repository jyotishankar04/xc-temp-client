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

export default function JavaBasicPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/go" className="hover:text-foreground">Java</Link>
        <span>/</span>
        <span className="text-foreground">Standalone</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Java</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Java Standalone Client</h1>
      <p className="text-muted-foreground mb-8">
        Use the XecureCode Java client directly in any Java application.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Add Maven Dependency</h2>
          <CodeBlock code={`<dependency>
  <groupId>com.xel</groupId>
  <artifactId>reliability-sdk</artifactId>
  <version>0.1.0</version>
</dependency>`} />
          <p className="text-sm text-muted-foreground mt-3">Or with Gradle:</p>
          <CodeBlock code={`implementation 'com.xel:reliability-sdk:0.1.0'`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Basic Usage</h2>
          <CodeBlock code={`import com.xel.reliability.ReliabilityClient;
import com.xel.reliability.ReliabilityConfig;

ReliabilityConfig config = new ReliabilityConfig.Builder()
    .apiKey("YOUR_API_KEY")
    .serviceId("your-service-id")
    .mode("production")
    .build();

ReliabilityClient client = new ReliabilityClient(config);

try {
    riskyOperation();
} catch (Exception e) {
    client.capture(e);
}`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Graceful Shutdown</h2>
          <p className="text-muted-foreground mb-4">
            Call <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">flush()</code> before your application exits to drain any pending sends:
          </p>
          <CodeBlock code={`Runtime.getRuntime().addShutdownHook(new Thread(() -> {
    client.flush();
}));`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Option</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-mono">apiKey</td>
                  <td className="py-2 text-muted-foreground">String</td>
                  <td className="py-2">Your API key (required)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">serviceId</td>
                  <td className="py-2 text-muted-foreground">String</td>
                  <td className="py-2">Your service ID (required)</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">mode</td>
                  <td className="py-2 text-muted-foreground">String</td>
                  <td className="py-2">"development" or "production" (default: "development")</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/go">← Back to Java</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/sdk/go/gin">Next: Spring Boot →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

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
        <code className="text-sky-400 font-mono text-sm overflow-x-auto">{code}</code>
        <Button variant="ghost" size="sm" onClick={copy} className="shrink-0">
          {copied ? <Check className="size-4 text-green-400" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

export default function PythonStandalonePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/python" className="hover:text-foreground">Python</Link>
        <span>/</span>
        <span className="text-foreground">Standalone</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Python</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Standalone Python Client</h1>
      <p className="text-muted-foreground mb-8">
        Use the XecureCode client directly in any Python application.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Install the SDK</h2>
          <CodeBlock code="pip install xecurecode" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Basic Usage</h2>
          <CodeBlock code={`from xecurecode import ReliabilityClient, ReliabilityConfig

config = ReliabilityConfig(
    api_key="YOUR_API_KEY",
    service_id="your-service-id"
)
client = ReliabilityClient(config)

try:
    # Your code here
    result = risky_operation()
except Exception as e:
    client.capture(e)`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Capture Custom Events</h2>
          <CodeBlock code={`# Capture custom events
client.capture_event(
    event_type="custom_event",
    message="Custom event message",
    metadata={"key": "value"}
)

# Capture with severity
client.capture_event(
    event_type="slow_request",
    message="Request took too long",
    severity="warning",
    metadata={"duration_ms": 5000}
)`} />
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
                  <td className="py-2 font-mono">api_key</td>
                  <td className="py-2 text-muted-foreground">string</td>
                  <td className="py-2">Your API key (required)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">service_id</td>
                  <td className="py-2 text-muted-foreground">string</td>
                  <td className="py-2">Your service ID (required)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">base_url</td>
                  <td className="py-2 text-muted-foreground">string</td>
                  <td className="py-2">Custom server URL (optional)</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">flush_interval</td>
                  <td className="py-2 text-muted-foreground">int</td>
                  <td className="py-2">Seconds between flushes (default: 5)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/python/django">← Back to Django</Link>
          </Button>
          <Button asChild className="bg-sky-500 hover:bg-sky-600">
            <Link href="/docs/sdk/node/express">Next: Node.js Express →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";
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

export default function PythonFastAPIPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/python" className="hover:text-foreground">Python</Link>
        <span>/</span>
        <span className="text-foreground">FastAPI</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Python</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">FastAPI Integration</h1>
      <p className="text-muted-foreground mb-8">
        Automatically capture uncaught exceptions in your FastAPI application.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Install the SDK</h2>
          <CodeBlock code="pip install x-reliability-sdk" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Initialize the Integration</h2>
          <CodeBlock code={`from fastapi import FastAPI
from reliability import ReliabilityClient, ReliabilityConfig
from reliability.fastapi_integration import setup_fastapi

app = FastAPI()

client = ReliabilityClient(ReliabilityConfig(
    api_key="YOUR_API_KEY",
    service_id="your-service-id",
    mode="production"
))

# Add middleware — automatically captures all unhandled exceptions
setup_fastapi(app, client)`} />
          <p className="text-sm text-muted-foreground mt-2">
            Replace <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">YOUR_API_KEY</code> and <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">your-service-id</code> with your actual credentials.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Test It</h2>
          <CodeBlock code={`@app.get("/error")
async def trigger_error():
    # This will be automatically captured
    return 1 / 0`} />
          <p className="text-sm text-muted-foreground mt-2">
            Navigate to <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">/error</code> to trigger an exception.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Configuration Options</h2>
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
                  <td className="py-2 font-mono">mode</td>
                  <td className="py-2 text-muted-foreground">string</td>
                  <td className="py-2">"development" or "production" (default: "development")</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/python/flask">← Back to Flask</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/sdk/python/django">Next: Django →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
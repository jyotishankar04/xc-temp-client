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

export default function PythonDjangoPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/python" className="hover:text-foreground">Python</Link>
        <span>/</span>
        <span className="text-foreground">Django</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Python</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Django Integration</h1>
      <p className="text-muted-foreground mb-8">
        Automatically capture uncaught exceptions in your Django application.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Install the SDK</h2>
          <CodeBlock code="pip install x-reliability-sdk" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Configure settings.py</h2>
          <p className="text-muted-foreground mb-2">Add the following to your <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">settings.py</code>:</p>
          <CodeBlock code={`RELIABILITY_API_KEY = 'YOUR_API_KEY'
RELIABILITY_SERVICE_ID = 'your-service-id'
RELIABILITY_MODE = 'production'  # or 'development'`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Add Middleware</h2>
          <p className="text-muted-foreground mb-2">In your <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">settings.py</code>:</p>
          <CodeBlock code={`MIDDLEWARE = [
    # ...
    'reliability.django_integration.ReliabilityMiddleware',
]`} />
          <p className="text-sm text-muted-foreground mt-2">
            The middleware automatically reads your <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">RELIABILITY_*</code> settings and captures all unhandled exceptions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Configuration Settings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Setting</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-left py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-mono">RELIABILITY_API_KEY</td>
                  <td className="py-2 text-muted-foreground">string</td>
                  <td className="py-2">Your API key (required)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">RELIABILITY_SERVICE_ID</td>
                  <td className="py-2 text-muted-foreground">string</td>
                  <td className="py-2">Your service ID (required)</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">RELIABILITY_MODE</td>
                  <td className="py-2 text-muted-foreground">string</td>
                  <td className="py-2">"development" or "production" (default: "development")</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/python/fastapi">← Back to FastAPI</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/sdk/python/standalone">Next: Standalone →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
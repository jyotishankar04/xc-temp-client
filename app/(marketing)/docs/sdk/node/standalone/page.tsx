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

export default function NodeStandalonePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/node" className="hover:text-foreground">Node.js</Link>
        <span>/</span>
        <span className="text-foreground">Standalone</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Node.js</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Standalone Node.js Client</h1>
      <p className="text-muted-foreground mb-8">
        Use the XecureCode client directly in any Node.js application.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Install the SDK</h2>
          <CodeBlock code="npm install @xecurecode/reliability-sdk" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Basic Usage</h2>
          <CodeBlock code={`const { ReliabilityClient } = require('@xecurecode/reliability-sdk');

const client = new ReliabilityClient({
  apiKey: 'YOUR_API_KEY',
  service_id: 'your-service-id',
  mode: 'production'
});

// Uncaught exceptions and unhandled rejections are captured automatically.
// You can also capture manually:
try {
  await riskyOperation();
} catch (error) {
  client.capture(error);
}`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. Graceful Shutdown</h2>
          <p className="text-muted-foreground mb-4">
            Wait for all pending sends to complete before exiting:
          </p>
          <CodeBlock code={`process.on('SIGTERM', async () => {
  await client.flush();
  process.exit(0);
});`} />
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/node/fastify">← Back to Fastify</Link>
          </Button>
          <Button asChild className="bg-sky-500 hover:bg-sky-600">
            <Link href="/docs/sdk/go/basic">Next: Java →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
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

export default function NodeFastifyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/node" className="hover:text-foreground">Node.js</Link>
        <span>/</span>
        <span className="text-foreground">Fastify</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Node.js</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Fastify Integration</h1>
      <p className="text-muted-foreground mb-8">
        Automatically capture uncaught exceptions in your Fastify application.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Install the SDK</h2>
          <CodeBlock code="npm install @xecurecode/node" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Initialize the Integration</h2>
          <CodeBlock code={`const fastify = require('fastify')({ logger: true });
const { xecurecode } = require('@xecurecode/node');

fastify.register(xecurecode, {
  apiKey: 'YOUR_API_KEY',
  serviceId: 'your-service-id'
});

fastify.get('/error', async (request, reply) => {
  throw new Error('Test error');
});`} />
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/node/express">← Back to Express</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/sdk/node/standalone">Next: Standalone →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
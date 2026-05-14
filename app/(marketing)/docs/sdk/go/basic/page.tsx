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

export default function GoBasicPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/go" className="hover:text-foreground">Go</Link>
        <span>/</span>
        <span className="text-foreground">Basic Usage</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Go</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Go SDK</h1>
      <p className="text-muted-foreground mb-8">
        Use the XecureCode Go client in your Go applications.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Install the SDK</h2>
          <CodeBlock code="go get github.com/xecurecode/go-sdk" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Basic Usage</h2>
          <CodeBlock code={`package main

import (
    "github.com/xecurecode/go-sdk"
)

func main() {
    client := xecurecode.NewClient(
        xecurecode.WithAPIKey("YOUR_API_KEY"),
        xecurecode.WithServiceID("your-service-id"),
    )
    defer client.Close()

    // Your code here
    // Errors will be automatically captured
}`} />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">3. HTTP Middleware</h2>
          <CodeBlock code={`// Use with any HTTP server
handler := xecurecode.HTTPMiddleware(handler, &xecurecode.Config{
    APIKey: "YOUR_API_KEY",
    ServiceID: "your-service-id",
})`} />
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/node/standalone">← Back to Node.js</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/sdk/go/gin">Next: Gin Framework →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
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

export default function GoGinPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <Link href="/docs/sdk/go" className="hover:text-foreground">Go</Link>
        <span>/</span>
        <span className="text-foreground">Gin Framework</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Go</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Gin Framework Integration</h1>
      <p className="text-muted-foreground mb-8">
        Automatically capture exceptions in your Gin web application.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">1. Install the SDK</h2>
          <CodeBlock code="go get github.com/xecurecode/go-sdk" />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">2. Initialize with Gin</h2>
          <CodeBlock code={`package main

import (
    "github.com/gin-gonic/gin"
    "github.com/xecurecode/go-sdk"
)

func main() {
    r := gin.Default()
    
    // Add XecureCode middleware
    r.Use(xecurecode.GinMiddleware(&xecurecode.Config{
        APIKey: "YOUR_API_KEY",
        ServiceID: "your-service-id",
    }))
    
    r.GET("/error", func(c *gin.Context) {
        panic("This will be captured")
    })
    
    r.Run()
}`} />
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/go/basic">← Back to Basic</Link>
          </Button>
          <Button asChild className="bg-sky-500 hover:bg-sky-600">
            <Link href="/docs/sdk/installation">Back to Docs →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Copy, Check, ArrowRight } from "lucide-react";
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

export default function QuickStartPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <span className="text-foreground">Quick Start</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Guide</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Quick Start</h1>
      <p className="text-muted-foreground mb-8">
        Get started with XecureCode in under 5 minutes.
      </p>

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white font-semibold text-sm">1</span>
            <h2 className="text-xl font-semibold">Create a Service</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            First, create a service in your dashboard to get your API key and service ID.
          </p>
          <Button asChild className="bg-sky-500 hover:bg-sky-600">
            <Link href="/app/dashboard/services">
              Create Service <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white font-semibold text-sm">2</span>
            <h2 className="text-xl font-semibold">Install the SDK</h2>
          </div>
          <p className="text-muted-foreground mb-4">Choose your language:</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Python</h3>
              <CodeBlock code="pip install x-reliability-sdk" />
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Node.js</h3>
              <CodeBlock code="npm install @xecurecode/reliability-sdk" />
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Java (Maven)</h3>
              <CodeBlock code="com.xel:reliability-sdk:0.1.0" />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white font-semibold text-sm">3</span>
            <h2 className="text-xl font-semibold">Integrate</h2>
          </div>
          <p className="text-muted-foreground mb-4">Add automatic error capture to your app:</p>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Flask (Python)</h3>
            <CodeBlock code={`from flask import Flask
from reliability import ReliabilityClient, ReliabilityConfig
from reliability.flask_integration import init_flask

app = Flask(__name__)
client = ReliabilityClient(ReliabilityConfig(api_key="YOUR_KEY", service_id="YOUR_ID"))
init_flask(app, client)`} />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Express (Node.js)</h3>
            <CodeBlock code={`const express = require('express');
const { ReliabilityClient } = require('@xecurecode/reliability-sdk');

const app = express();
const reliability = new ReliabilityClient({ apiKey: 'YOUR_KEY', service_id: 'YOUR_ID' });

// ... your routes ...
app.use(reliability.middleware()); // must be last`} />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Spring Boot (Java)</h3>
            <CodeBlock code={`# application.properties
reliability.api-key=YOUR_KEY
reliability.service-id=YOUR_ID
reliability.mode=production`} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white font-semibold text-sm">4</span>
            <h2 className="text-xl font-semibold">View Errors</h2>
          </div>
          <p className="text-muted-foreground">
            That's it! Exceptions in your application will now be automatically captured and sent to XecureCode. Check your dashboard to see them.
          </p>
        </section>

        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href="/docs/sdk/installation">← Installation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/sdk/python/flask">Next: Flask Guide →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
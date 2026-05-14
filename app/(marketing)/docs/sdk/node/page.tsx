"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const frameworks = [
  { name: "Express", description: "Fast, unopinionated web framework", href: "/docs/sdk/node/express" },
  { name: "Fastify", description: "Fast and low overhead web framework", href: "/docs/sdk/node/fastify" },
  { name: "Standalone", description: "Use without a framework", href: "/docs/sdk/node/standalone" },
];

export default function NodeSdkPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <span className="text-foreground">Node.js</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Node.js SDK</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Node.js</h1>
      <p className="text-muted-foreground mb-8">
        Install the Node.js SDK and integrate with your Node.js applications.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {frameworks.map((fw) => (
          <Link
            key={fw.href}
            href={fw.href}
            className="p-4 border rounded-lg hover:border-sky-500 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{fw.name}</h3>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-sky-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{fw.description}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 pt-8">
        <Button asChild variant="outline">
          <Link href="/docs/sdk/python/standalone">← Python</Link>
        </Button>
        <Button asChild className="bg-sky-500 hover:bg-sky-600">
          <Link href="/docs/sdk/go/basic">Go →</Link>
        </Button>
      </div>
    </div>
  );
}
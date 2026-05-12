"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const frameworks = [
  { name: "Standalone", description: "Manual capture in any Java app", href: "/docs/sdk/go/basic" },
  { name: "Spring Boot", description: "Auto-configuration for Spring Boot", href: "/docs/sdk/go/gin" },
];

export default function JavaSdkPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/docs/sdk" className="hover:text-foreground">Docs</Link>
        <span>/</span>
        <span className="text-foreground">Java</span>
      </div>

      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Java SDK</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Java</h1>
      <p className="text-muted-foreground mb-8">
        Install the Java SDK and integrate with your Java applications. Spring Boot auto-configuration included.
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
          <Link href="/docs/sdk/node/standalone">← Node.js</Link>
        </Button>
        <Button asChild className="bg-sky-500 hover:bg-sky-600">
          <Link href="/docs/sdk/installation">Back to Docs →</Link>
        </Button>
      </div>
    </div>
  );
}

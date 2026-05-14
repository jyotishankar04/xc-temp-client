"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Code2, 
  FlaskConical, 
  Terminal, 
  Box, 
  Database, 
  Webhook, 
  Shield,
  ChevronRight,
  Copy,
  Check
} from "lucide-react";

const sections = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs/sdk" },
      { label: "Quick Start", href: "/docs/sdk/quick-start" },
      { label: "Installation", href: "/docs/sdk/installation" },
    ]
  },
  {
    title: "Python SDK",
    items: [
      { label: "Flask", href: "/docs/sdk/python/flask" },
      { label: "FastAPI", href: "/docs/sdk/python/fastapi" },
      { label: "Django", href: "/docs/sdk/python/django" },
      { label: "Standalone", href: "/docs/sdk/python/standalone" },
    ]
  },
  {
    title: "Node.js SDK",
    items: [
      { label: "Express", href: "/docs/sdk/node/express" },
      { label: "Fastify", href: "/docs/sdk/node/fastify" },
      { label: "Standalone", href: "/docs/sdk/node/standalone" },
    ]
  },
  {
    title: "Go SDK",
    items: [
      { label: "Basic Usage", href: "/docs/sdk/go/basic" },
      { label: "Gin Framework", href: "/docs/sdk/go/gin" },
    ]
  },
  {
    title: "API Reference",
    items: [
      { label: "Configuration", href: "/docs/sdk/api/config" },
      { label: "Client Methods", href: "/docs/sdk/api/client" },
    ]
  },
];

export default function SdkDocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r bg-white dark:bg-slate-900 hidden md:block">
          <div className="sticky top-0 p-6">
            <Link href="/docs/sdk" className="flex items-center gap-2 mb-6">
              <BookOpen className="size-5 text-sky-500" />
              <span className="font-semibold">SDK Docs</span>
            </Link>
            <nav className="space-y-6">
              {sections.map((section) => (
                <div key={section.title}>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors",
                              isActive 
                                ? "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300" 
                                : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                          >
                            {isActive && <ChevronRight className="size-3" />}
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
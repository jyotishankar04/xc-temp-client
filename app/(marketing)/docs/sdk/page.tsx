import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FlaskConical, 
  Code2, 
  Terminal, 
  Box, 
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Box, title: "Automatic Error Capture", description: "Automatically capture uncaught exceptions in your application" },
  { icon: FlaskConical, title: "Deduplication", description: "Skip duplicate errors to reduce noise and save resources" },
  { icon: Terminal, title: "Smart Classification", description: "Automatically classify errors into categories (Database, Network, Validation)" },
  { icon: CheckCircle, title: "Health Checks", description: "Monitor service health and get notified when issues arise" },
];

const languages = [
  {
    icon: FlaskConical,
    title: "Python",
    description: "Flask, FastAPI, Django, or standalone",
    href: "/docs/sdk/python/flask",
    badge: "Stable"
  },
  {
    icon: Code2,
    title: "Node.js",
    description: "Express, Fastify, or standalone",
    href: "/docs/sdk/node/express",
    badge: "Stable"
  },
  {
    icon: Terminal,
    title: "Go",
    description: "Any Go application",
    href: "/docs/sdk/go/basic",
    badge: "Beta"
  },
];

export default function SdkDocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">SDK Documentation</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">XecureCode SDKs</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Integrate XecureCode into your application to capture, classify, and analyze errors automatically.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-sky-500 hover:bg-sky-600">
            <Link href="/docs/sdk/installation">
              Get Started <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/sdk/api/config">API Reference</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-12">
        {features.map((feature) => (
          <div key={feature.title} className="flex gap-3 p-4 rounded-lg border bg-white dark:bg-slate-900">
            <feature.icon className="size-5 text-sky-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Supported Languages</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <Link key={lang.title} href={lang.href}>
              <Card className="hover:border-sky-300 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <lang.icon className="size-8 text-sky-500" />
                    <Badge variant="secondary" className="text-xs">{lang.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{lang.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{lang.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Check out our GitHub repository for examples, ask questions, and share feedback.
        </p>
        <Button variant="outline" asChild>
          <Link href="https://github.com/xecurecode" target="_blank">
            View on GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}
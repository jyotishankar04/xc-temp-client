import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Check, Terminal } from "lucide-react";

const pythonCode = `pip install xecurecode`;

const nodeCode = `npm install @xecurecode/sdk`;

const goCode = `go get github.com/xecurecode/go-sdk`;

export default function InstallationPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Badge variant="outline" className="mb-4 border-sky-200 text-sky-600">Installation</Badge>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Install XecureCode SDK</h1>
      <p className="text-muted-foreground mb-8">
        Choose your preferred language and follow the installation steps.
      </p>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🐍</span> Python
            </CardTitle>
            <CardDescription>Flask, FastAPI, Django, or standalone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 rounded-md p-4 mb-4">
              <code className="text-sky-400 font-mono">{pythonCode}</code>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" className="bg-sky-500 hover:bg-sky-600">
                <Link href="/docs/sdk/python/flask">Flask Guide</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/docs/sdk/python/fastapi">FastAPI Guide</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📦</span> Node.js
            </CardTitle>
            <CardDescription>Express, Fastify, or standalone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 rounded-md p-4 mb-4">
              <code className="text-sky-400 font-mono">{nodeCode}</code>
            </div>
            <Button asChild size="sm" className="bg-sky-500 hover:bg-sky-600">
              <Link href="/docs/sdk/node/express">Express Guide</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🔷</span> Go
            </CardTitle>
            <CardDescription>Any Go application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 rounded-md p-4 mb-4">
              <code className="text-sky-400 font-mono">{goCode}</code>
            </div>
            <Button asChild size="sm" className="bg-sky-500 hover:bg-sky-600">
              <Link href="/docs/sdk/go/basic">Go Guide</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-sky-50 dark:bg-sky-950 rounded-lg border border-sky-200 dark:border-sky-800">
        <h3 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">Prerequisites</h3>
        <ul className="space-y-2 text-sm text-sky-600 dark:text-sky-400">
          <li className="flex items-center gap-2">
            <Check className="size-4" /> A XecureCode account
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4" /> A service created in your dashboard
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4" /> An API key from Service Settings
          </li>
        </ul>
      </div>
    </div>
  );
}
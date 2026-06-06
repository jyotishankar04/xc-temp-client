import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex size-14 items-center justify-center rounded-full border bg-muted/40">
          <Home className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">
              <Home className="size-4" />
              Go home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs">
              <ArrowLeft className="size-4" />
              Open docs
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

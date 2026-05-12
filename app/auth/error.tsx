"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-6 text-destructive" />
      </div>
      <h1 className="text-xl font-semibold">Authentication error</h1>
      <p className="text-sm text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={reset}>Try again</Button>
        <Button asChild><Link href="/">Go home</Link></Button>
      </div>
    </div>
  );
}

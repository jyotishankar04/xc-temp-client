"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appConfig } from "@/lib/config/app";
import { cn } from "@/lib/utils";

export function LaunchWaitlistForm({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch(`${appConfig.apiUrl}/api/v1/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "launch" }),
      });
      const body = (await response.json().catch(() => null)) as { message?: string; error?: string } | null;

      if (!response.ok) {
        setStatus("error");
        setMessage(body?.message ?? body?.error ?? "Could not subscribe this email.");
        return;
      }

      setStatus("success");
      setMessage(body?.message ?? "You will receive product updates.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not subscribe this email. Please try again.");
    }
  }

  return (
    <div className={cn("mx-auto w-full max-w-xl", className)}>
      {showLabel ? (
        <p className="mb-5 text-center text-base font-medium text-foreground sm:text-lg">
          Be the first to know when we go live.
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex min-h-11 flex-1 items-center rounded-md border border-input bg-background px-3 shadow-sm">
          <Mail className="mr-3 size-5 shrink-0 text-muted-foreground" />
          <span className="sr-only">Email address</span>
          <Input
            type="email"
            required
            aria-required="true"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            className="h-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </label>
        <Button
          type="submit"
          disabled={!email || status === "submitting"}
          className="min-h-11 rounded-md px-5"
        >
          {status === "submitting" ? "Subscribing..." : "Notify Me"}
        </Button>
      </form>
      <div className="mt-4 min-h-5 text-center text-sm text-muted-foreground">
        {message ? (
          <span className={status === "success" ? "text-primary" : "text-destructive"}>{message}</span>
        ) : (
          <span>No spam. Unsubscribe anytime.</span>
        )}
      </div>
    </div>
  );
}

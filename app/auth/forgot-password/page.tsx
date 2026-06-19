"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, handleApiError } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    setError(null);
    setStatus("sending");

    try {
      await authApi.requestAdminPasswordReset({ email });
      setStatus("sent");
    } catch (err) {
      setError(handleApiError(err));
      setStatus("idle");
    }
  };

  return (
    <>
      <p className="mt-4 text-xl font-semibold tracking-tight">Reset your admin password</p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Enter the email address for your master admin account.
      </p>

      <form className="mt-8 w-full space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2 text-left">
          <Label htmlFor="recovery-email">Admin email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="recovery-email"
              type="email"
              autoComplete="email"
              className="h-11 rounded-lg pl-10"
              placeholder="admin@xecurecode.in"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status === "sent" && (
          <Alert>
            <AlertDescription>
              If the email exists, we sent a reset link. Check your inbox and spam folder.
            </AlertDescription>
          </Alert>
        )}

        <Button className="h-11 w-full rounded-lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send reset link"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-between">
        <Link href={ROUTES.ADMIN_LOGIN} className="text-muted-foreground underline underline-offset-4">
          Back to admin login
        </Link>
        <Link href={ROUTES.AUTH_VERIFY_EMAIL} className="text-muted-foreground underline underline-offset-4">
          Verify email instead
        </Link>
      </div>
    </>
  );
}

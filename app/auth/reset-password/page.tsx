"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, handleApiError } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToken(searchParams.get("token") ?? "");
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "saving") return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    setStatus("saving");

    try {
      await authApi.resetAdminPassword({ token, password });
      setStatus("saved");
    } catch (err) {
      setError(handleApiError(err));
      setStatus("idle");
    }
  };

  return (
    <>
      <p className="mt-4 text-xl font-semibold tracking-tight">Set a new admin password</p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Use the link from your inbox, then choose a new password here.
      </p>

      <form className="mt-8 w-full space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2 text-left">
          <Label htmlFor="reset-token">Reset token</Label>
          <Input
            id="reset-token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Paste token from email link"
            required
          />
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="new-password">New password</Label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              className="h-11 rounded-lg pl-10"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            className="h-11 rounded-lg"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status === "saved" && (
          <Alert>
            <AlertDescription>
              Password reset successfully. You can return to admin login and sign in with the new password.
            </AlertDescription>
          </Alert>
        )}

        <Button className="h-11 w-full rounded-lg" disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : "Reset password"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-between">
        <Link href={ROUTES.ADMIN_LOGIN} className="text-muted-foreground underline underline-offset-4">
          Back to admin login
        </Link>
        <Link href={ROUTES.AUTH_FORGOT_PASSWORD} className="text-muted-foreground underline underline-offset-4">
          Request another link
        </Link>
      </div>
    </>
  );
}

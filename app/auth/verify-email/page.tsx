"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, MailCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, handleApiError } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [autoVerified, setAutoVerified] = useState(false);
  const [status, setStatus] = useState<"idle" | "checking" | "verified" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setToken(searchParams.get("token") ?? "");
    setEmail(searchParams.get("email") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (!token || autoVerified || status !== "idle") return;

    const verify = async () => {
      setStatus("checking");
      try {
        await authApi.verifyAdminEmail(token);
        setAutoVerified(true);
        setStatus("verified");
      } catch (err) {
        setAutoVerified(true);
        setError(handleApiError(err));
        setStatus("idle");
      }
    };

    void verify();
  }, [autoVerified, status, token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "checking") return;

    setError(null);
    setStatus("checking");

    try {
      await authApi.requestAdminEmailVerification({ email });
      setStatus("sent");
    } catch (err) {
      setError(handleApiError(err));
      setStatus("idle");
    }
  };

  return (
    <>
      <p className="mt-4 text-xl font-semibold tracking-tight">Verify your admin email</p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Use the verification link from your inbox, or request a new one below.
      </p>

      <form className="mt-8 w-full space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2 text-left">
          <Label htmlFor="verify-email">Admin email</Label>
          <div className="relative">
            <MailCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="verify-email"
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

        {status === "verified" && (
          <Alert>
            <AlertDescription>
              Email verified successfully. You can return to admin login.
            </AlertDescription>
          </Alert>
        )}

        {status === "sent" && (
          <Alert>
            <AlertDescription>
              If the email exists, we sent a verification link. Check your inbox and spam folder.
            </AlertDescription>
          </Alert>
        )}

        <Button className="h-11 w-full rounded-lg" disabled={status === "checking"}>
          {status === "checking" ? "Working..." : "Send verification link"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-between">
        <Link href={ROUTES.ADMIN_LOGIN} className="text-muted-foreground underline underline-offset-4">
          Back to admin login
        </Link>
        <Link href={ROUTES.AUTH_FORGOT_PASSWORD} className="text-muted-foreground underline underline-offset-4">
          Reset password instead
        </Link>
      </div>
    </>
  );
}

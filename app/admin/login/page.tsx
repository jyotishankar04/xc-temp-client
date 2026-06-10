"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/branding";
import { authApi, handleApiError } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await authApi.loginAdmin({ email, password });
      window.location.assign(ROUTES.ADMIN);
    } catch (err) {
      setError(handleApiError(err));
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_34rem),linear-gradient(135deg,var(--background),var(--muted))]">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border bg-background/75 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <ShieldCheck className="size-3.5 text-primary" />
              Master Admin Console
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-normal text-foreground">
              Operational controls for the people trusted to change the platform.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Sign in with your admin email and password to manage feature flags,
              maintenance windows, announcements, organizations, and master admin access.
            </p>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">
            {["Settings", "Members", "Audit"].map((item) => (
              <div
                key={item}
                className="rounded-lg border bg-background/70 p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {item}
                </p>
                <div className="mt-5 h-1.5 rounded-full bg-primary/20">
                  <div className="h-full w-2/3 rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-xl border bg-card/90 p-7 shadow-xl shadow-primary/5 backdrop-blur">
            <div className="flex items-center gap-3">
              <Logo className="size-10" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  XecureCode
                </p>
                <h2 className="text-2xl font-semibold tracking-normal">
                  Admin sign in
                </h2>
              </div>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@xecurecode.in"
                    className="h-11 rounded-lg pl-10"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter admin password"
                    className="h-11 rounded-lg pl-10"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button className="h-11 w-full rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link
                href={ROUTES.AUTH_LOGIN}
                className="text-muted-foreground underline underline-offset-4"
              >
                User login
              </Link>
              <Link
                href={ROUTES.HOME}
                className="text-muted-foreground underline underline-offset-4"
              >
                Back home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

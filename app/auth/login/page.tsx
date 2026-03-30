"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitHubLogo } from "@/components/shared/branding";
import { ROUTES } from "@/lib/constants/routes";
import { useAuth } from "@/lib/hooks/use-auth";
import { appConfig } from "@/lib/config/app";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <>
      <p className="mt-4 font-semibold text-xl tracking-tight">
        Log in to XecureCode
      </p>

      <Button
        className="mt-8 w-full gap-3"
        onClick={() => {
          window.location.href = `${appConfig.apiUrl}/api/v1/auth/github`;
        }}
      >
        <GitHubLogo className="size-4" />
        Continue with GitHub
      </Button>

      <p className="mt-5 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link className="ml-1 text-muted-foreground underline" href={ROUTES.AUTH_SIGNUP}>
          Create account
        </Link>
      </p>
    </>
  );
}

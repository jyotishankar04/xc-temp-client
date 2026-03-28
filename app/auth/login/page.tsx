"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitHubLogo } from "@/components/shared/branding";
import { ROUTES } from "@/lib/constants/routes";

export default function LoginPage() {
  return (
    <>
      <p className="mt-4 font-semibold text-xl tracking-tight">
        Log in to XecureCode
      </p>

      <Button
        className="mt-8 w-full gap-3"
        onClick={() => {
          window.location.href = "/api/auth/github";
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

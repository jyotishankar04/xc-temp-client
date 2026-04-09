"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitHubLogo } from "@/components/shared/branding";
import { ROUTES } from "@/lib/constants/routes";
import { useAuth } from "@/lib/hooks/use-auth";

export default function SignupPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    if (isLoading) return;
    setIsLoading(true);
    login();
  };

  return (
    <>
      <p className="mt-4 font-semibold text-xl tracking-tight">
        Create your XecureCode account
      </p>

      <Button
        className="mt-8 w-full gap-3"
        onClick={handleSignup}
        disabled={isLoading}
      >
        <GitHubLogo className="size-4" />
        {isLoading ? "Redirecting..." : "Continue with GitHub"}
      </Button>

      <p className="mt-5 text-center text-sm">
        Already have an account?{" "}
        <Link className="ml-1 text-muted-foreground underline" href={ROUTES.AUTH_LOGIN}>
          Log in
        </Link>
      </p>
    </>
  );
}

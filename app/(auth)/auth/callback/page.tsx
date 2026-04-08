"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/me`,
          { credentials: "include" }
        );

        if (response.ok) {
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (err) {
        setError("Authentication failed");
        setLoading(false);
      }
    };

    // Small delay to allow cookie to be set
    const timer = setTimeout(verifySession, 500);
    return () => clearTimeout(timer);
  }, [router]);

  // Also check for error in URL params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    if (errorParam) {
      setError(errorDescription || "Authentication failed");
      setLoading(false);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <a href="/login" className="text-primary hover:underline">
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
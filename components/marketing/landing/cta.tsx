"use client";

import { ArrowUpRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import Link from "next/link";

const CTA = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col px-6 py-24 sm:py-32">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-transparent to-transparent p-12 text-center sm:p-16 lg:p-20">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Be ready before{" "}
            <span className="text-primary">your next outage</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-muted-foreground text-lg sm:text-xl">
            Transform your infrastructure with enterprise-grade reliability
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!isLoading && (
              isAuthenticated ? (
                <Link href="/app/dashboard">
                  <Button size="lg" className="rounded-full px-8 text-base">
                    Go to Dashboard
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button size="lg" className="rounded-full px-8 text-base">
                      Request Early Access
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact?intent=demo">
                    <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Demo
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>

          {/* Optional trust indicator */}
          <p className="mt-8 text-sm text-muted-foreground">
            ✦ No credit card required ✦ Free during beta ✦
          </p>
        </div>
      </div>
    </div>
  );
};

export default CTA;

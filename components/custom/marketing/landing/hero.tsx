import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/custom/marketing/landing/background-grid-pattern";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <AnimatedGridPattern
        className={cn(
          "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 h-full skew-y-12"
        )}
        duration={3}
        maxOpacity={0.1}
        numSquares={30}
      />
      <div className="relative z-10 max-w-3xl text-center">
        <Badge
          className="rounded-full border-border py-1 px-4"
          variant="secondary"
        >
          🚀 AI-Powered Incident Management
        </Badge>

        <h1 className="mt-6 font-semibold text-4xl tracking-tighter sm:text-5xl md:text-6xl md:leading-[1.2] lg:text-7xl">
          AI that explains production failures
          <span className="text-primary"> and guides safe recovery.</span>
        </h1>

        <p className="mt-6 text-foreground/80 md:text-lg max-w-2xl mx-auto">
          X Tech adds an intelligent decision layer between
          observability tools and recovery actions.
        </p>

        <div className="mt-12">
          <Link href="/waitlist">
            <Button
              className="rounded-full text-base h-12 px-8 whitespace-nowrap"
              size="lg"
            >
              Join Early Access <ArrowUpRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>

          {/* Social Proof */}
          <p className="mt-4 text-sm text-foreground/60">
            ⚡️ Join 200+ engineers already on the waitlist
          </p>
        </div>
      </div>
    </div>
  );
}
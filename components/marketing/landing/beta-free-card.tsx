import Link from "next/link";
import { CircleCheck, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BetaFreeCard() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="border bg-card p-8 md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FlaskConical className="size-6" />
            </div>
            <h2 className="text-4xl font-semibold tracking-normal">
              XecureCode is free during beta
            </h2>
            <p className="mt-3 text-lg leading-7 text-muted-foreground">
              Every feature is available while we refine the platform with early teams.
              No plan limits, no hidden costs, no credit card required.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href="/auth/signup">Start free</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {["All production services", "RCA and rollback insights", "Team and admin controls"].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <CircleCheck className="size-4 text-primary" />
              {feature}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

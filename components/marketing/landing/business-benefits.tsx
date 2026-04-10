import {
  Zap,
  ShieldCheck,
  TrendingDown,
  HeartHandshake,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ─── Data ─────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: Zap,
    title: "Faster incident understanding",
    description:
      "AI-powered root cause analysis in seconds — no more war rooms, log spelunking, or guesswork under pressure.",
    tag: "Root cause in seconds",
  },
  {
    icon: ShieldCheck,
    title: "Faster, safer recovery",
    description:
      "Guided recovery paths with built-in safety guardrails so your team moves quickly without making things worse.",
    tag: "Safety guardrails",
  },
  {
    icon: TrendingDown,
    title: "Reduced downtime",
    description:
      "Shorten your mean time to resolution and minimize revenue loss before customers ever notice a problem.",
    tag: "Minimize revenue loss",
  },
  {
    icon: HeartHandshake,
    title: "Less operational stress",
    description:
      "Eliminate firefighting as a full-time job. Give your engineers the headspace to build, not babysit production.",
    tag: "Focus on building",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const BusinessBenefits = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col px-6 py-12 sm:py-14">

      {/* Header */}
      <h2 className="text-pretty text-center font-semibold text-4xl tracking-tight sm:text-5xl">
        Built for teams{" "}
        <span className="text-primary">without SREs</span>
      </h2>
      <p className="mt-3 text-center text-muted-foreground text-xl sm:text-2xl">
        Enterprise-grade reliability, without the enterprise headcount.
      </p>

      {/* Grid — same mosaic border pattern */}
      <div className="mt-16 rounded-lg grid grid-cols-1 gap-1.5 border bg-muted p-1.5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <div
              key={index}
              className="relative -m-px rounded-lg border bg-card px-5 py-7"
            >
              {/* Corner number badge */}
              <Badge
                className="absolute top-2 right-2 rounded-none rounded-tr-lg border-t-0 border-r-0 bg-muted/30 font-mono dark:border-foreground/15 dark:bg-background"
                variant="outline"
              >
                {(index + 1).toString().padStart(2, "0")}
              </Badge>

              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/15">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>

              {/* Title + description */}
              <h3 className="mt-5 font-semibold text-xl tracking-[-0.005em]">
                {benefit.title}
              </h3>
              <p className="mt-2 text-base text-foreground/90">
                {benefit.description}
              </p>

              {/* Tag pill */}
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {benefit.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessBenefits;
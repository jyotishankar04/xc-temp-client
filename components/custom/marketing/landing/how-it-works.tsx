import {
  Eye,
  GitBranch,
  Brain,
  Shield,
  Activity,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: Eye,
    title: "Lightweight SDK observes",
    description:
      "A zero-config SDK instruments your runtime and emits a continuous telemetry stream — no agents, no overhead.",
    tag: "SDK → telemetry stream",
    tagIcon: Activity,
  },
  {
    icon: GitBranch,
    title: "Signals correlated",
    description:
      "Events across services, logs, and traces are joined in real time to surface meaningful cross-system patterns.",
    tag: "Event correlation graph",
    tagIcon: Sparkles,
  },
  {
    icon: Brain,
    title: "AI explains root cause",
    description:
      "The AI decision layer reads correlated signals and produces a plain-language diagnosis — not a raw metric dump.",
    tag: "AI analysis panel",
    tagIcon: Brain,
  },
  {
    icon: Shield,
    title: "Recovery actions guided",
    description:
      "Dependency-aware rollback options are surfaced with impact previews so your team acts fast without guesswork.",
    tag: "Rollback UI",
    tagIcon: RefreshCw,
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const HowItWorks = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col px-6 py-12 sm:py-14">

      {/* Header */}
      <h2 className="text-pretty text-center font-semibold text-4xl tracking-tight sm:text-5xl">
        How <span className="text-primary">Xecurecode AI</span> works
      </h2>
      <p className="mt-3 text-center text-muted-foreground text-xl sm:text-2xl">
        From detection to recovery in four intelligent steps.
      </p>

      {/* Grid — same mosaic border pattern as Features reference */}
      <div className="mt-16 grid grid-cols-1 gap-1.5 border rounded-lg bg-muted p-1.5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const TagIcon = step.tagIcon;

          return (
            <div
              key={index}
              className="relative -m-px border bg-card rounded-lg px-5 py-7"
            >
              {/* Step number badge — top-right corner */}
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
                {step.title}
              </h3>
              <p className="mt-2 text-base text-foreground/90">
                {step.description}
              </p>

              {/* Tag pill */}
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1.5">
                <TagIcon
                  className="h-3.5 w-3.5 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <span className="font-mono text-xs font-medium text-muted-foreground">
                  {step.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom stat pill */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-5 py-2.5">
          <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <span className="text-sm font-medium text-foreground">
            From 4+ hours of downtime to minutes
          </span>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
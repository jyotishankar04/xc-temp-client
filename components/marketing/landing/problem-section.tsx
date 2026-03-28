import {
  Clock,
  RotateCcw,
  Zap,
  Users,
} from "lucide-react";

const problems = [
  {
    title: "Long Downtime",
    description:
      "Extended outages during critical incidents, costing you revenue and customer trust with every minute of downtime.",
    icon: Clock,
  },
  {
    title: "Manual Recovery",
    description:
      "Fumbling through runbooks and dashboards while systems are down, leading to slow and error-prone recovery.",
    icon: RotateCcw,
  },
  {
    title: "High Stress",
    description:
      "On-call burnout from high-pressure incident response, affecting team morale and retention.",
    icon: Zap,
  },
  {
    title: "No SRE Expertise",
    description:
      "Lack of specialized Site Reliability Engineering knowledge when you need it most, especially in growing teams.",
    icon: Users,
  },
];

const Problem = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col px-6 py-24 sm:py-32">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-pretty font-semibold text-3xl tracking-tight sm:text-5xl">
          The real problem isn't bugs —{" "}
          <span className="text-primary">it's recovery</span>
        </h2>
        <p className="mt-3 text-balance text-center text-muted-foreground text-lg sm:text-lg max-w-2xl mx-auto">
          When incidents happen, the clock starts ticking. Here's what's at stake.
        </p>
      </div>

      {/* Problem Cards Grid */}
      <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((problem, index) => (
          <div
            className="group relative rounded-xl border border-border/40 bg-background/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-muted/20 hover:shadow-lg hover:-translate-y-1"
            key={index}
          >
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
              <problem.icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <h3 className="mt-5 font-semibold text-lg tracking-tight">
              {problem.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {problem.description}
            </p>

            {/* Optional subtle accent line */}
            <div className="absolute bottom-0 left-6 right-6 h-0.5 scale-x-0 bg-primary/50 transition-transform duration-300 group-hover:scale-x-100" />
          </div>
        ))}
      </div>

      {/* Optional contextual stat */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground">
          ⏱️ Average incident recovery time: <span className="font-medium text-foreground">4+ hours</span> without automated guidance
        </p>
      </div>
    </div>
  );
};

export default Problem;
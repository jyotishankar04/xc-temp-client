import {
  CheckCircle2,
  ArrowDown,
  Activity,
  Brain,
  Shield,
  RefreshCw,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const FLOW_NODES = [
  {
    id: "monitoring",
    icon: <Activity className="h-5 w-5" />,
    title: "Monitoring tools",
    subtitle: "Datadog, Grafana, Prometheus, New Relic",
    highlight: false,
  },
  {
    id: "xecurecode",
    icon: <Brain className="h-6 w-6" />,
    title: "Xecurecode AI",
    subtitle: "AI-powered decision layer for automated recovery",
    highlight: true,
    badges: ["Real-time analysis", "Context-aware", "Action recommendations"],
  },
  {
    id: "recovery",
    icon: <Shield className="h-5 w-5" />,
    title: "Recovery actions",
    subtitle: "Automated rollbacks, scaling, failover",
    highlight: false,
  },
];

const FEATURES = [
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    variant: "primary",
    title: "Detect production failures",
    description:
      "Instantly identify issues across your stack with intelligent anomaly detection",
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    variant: "primary",
    title: "Explain why failures happened",
    description:
      "Get natural language explanations of root causes, not just raw metrics",
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    variant: "primary",
    title: "Recommend safe recovery steps",
    description:
      "Receive actionable runbooks tailored to your specific incident context",
  },
  {
    icon: <RefreshCw className="h-4 w-4" />,
    variant: "muted",
    title: "Optionally trigger controlled rollback",
    description:
      "One-click or automated safe rollbacks with dependency awareness",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FlowConnector = () => (
  <div className="flex flex-col items-center">
    <div className="h-6 w-px bg-border" />
    <ArrowDown className="h-4 w-4 -mt-1 text-muted-foreground/40" />
  </div>
);

const FlowNodeDefault = ({ icon, title, subtitle }: any) => (
  <div className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-border bg-card px-6 py-4 shadow-sm">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-base text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

const FlowNodeHighlight = ({ icon, title, subtitle, badges }: any) => (
  <div className="relative w-full max-w-md">
    <div className="absolute -inset-2 rounded-3xl bg-primary/10 blur-xl pointer-events-none" />
    <div className="relative flex items-center gap-4 rounded-2xl border-2 border-primary/50 bg-primary/5 px-6 py-5 shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
        {badges?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {badges.map((badge: any) => (
              <span
                key={badge}
                className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

const FlowNode = (node: any) =>
  node.highlight ? <FlowNodeHighlight {...node} /> : <FlowNodeDefault {...node} />;

const FeatureItem = ({ icon, variant, title, description }: any) => (
  <div className="flex items-start gap-3">
    <div
      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${variant === "primary"
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground"
        }`}
    >
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-base text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ProductPositioning = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col px-6 py-24 sm:py-32">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-pretty font-bold text-3xl tracking-tight sm:text-5xl leading-tight">
          A decision layer between{" "}
          <span className="text-primary">observability and action</span>
        </h2>
        <p className="mt-4 text-balance text-center text-muted-foreground text-lg max-w-2xl mx-auto">
          Connect your monitoring tools to automated recovery with intelligent
          decision-making.
        </p>
      </div>

      {/* Flow diagram */}
      <div className="mt-20 flex flex-col items-center">
        {FLOW_NODES.map((node, i) => (
          <div key={node.id} className="flex w-full flex-col items-center">
            <FlowNode {...node} />
            {i < FLOW_NODES.length - 1 && <FlowConnector />}
          </div>
        ))}
      </div>

      {/* Features - Full width with 2-column layout */}
      <div className="mt-24">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
          <h3 className="font-bold text-xl tracking-tight text-card-foreground mb-8 text-center md:text-left">
            What Xecurecode AI does
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {FEATURES.map((feature) => (
              <FeatureItem key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPositioning;
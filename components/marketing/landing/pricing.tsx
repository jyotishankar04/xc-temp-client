import { Box, CircleCheck, Gem, type LucideIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface PricingPlan {
  name: string;
  description: string;
  price: number;
  isRecommended: boolean;
  icon: LucideIcon;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    description: "For early services and small teams validating reliability workflows.",
    price: 29,
    isRecommended: false,
    icon: Box,
    features: [
      "1 production service",
      "Failure grouping",
      "Email support",
      "Basic RCA summaries",
      "Community access",
    ],
  },
  {
    name: "Pro",
    description: "For teams that need automated insight across active systems.",
    price: 79,
    isRecommended: true,
    icon: Gem,
    features: [
      "Unlimited services",
      "Advanced RCA reports",
      "Priority support",
      "Rollback recommendations",
      "Team templates",
    ],
  },
  {
    name: "Team",
    description: "For growing teams standardizing incident response.",
    price: 199,
    isRecommended: false,
    icon: Users,
    features: [
      "Everything in Pro",
      "Team license up to 5 users",
      "Collaboration controls",
      "Extended support",
      "Admin governance",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-center font-medium text-4xl tracking-normal sm:text-[2.75rem]">
        Pricing that makes sense
      </h2>
      <p className="mt-3 text-center text-muted-foreground text-xl tracking-normal md:text-2xl">
        Choose a plan that fits your needs with no hidden costs
      </p>

      <div className="mt-12 grid grid-cols-1 gap-y-8 shadow-xs/2 sm:grid-cols-2 md:mt-16 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={cn("border bg-card", {
        "relative border border-primary bg-card ring ring-primary ring-inset":
          plan.isRecommended,
      })}
    >
      {plan.isRecommended && (
        <Badge className="absolute top-0 right-0 rounded-none">
          Most Popular
        </Badge>
      )}
      <div
        className={cn("p-6", {
          "bg-linear-to-bl from-primary/15": plan.isRecommended,
        })}
      >
        <plan.icon className="mb-5 text-primary" />
        <div className="flex items-center gap-1">
          <h3 className="font-medium text-2xl tracking-normal">{plan.name}</h3>
        </div>
        <p className="my-2 text-muted-foreground">{plan.description}</p>
      </div>
      <Separator />
      <div className="px-6 pt-5 pb-10">
        <p className="mt-4 font-semibold text-4xl">${plan.price}</p>
        <p className="mt-1 text-muted-foreground text-sm tracking-normal">
          one-time payment
        </p>
        <Button className="my-6 w-full" size="lg">
          Get Started
        </Button>
        <ul className="mt-4 space-y-2">
          {plan.features.map((feature) => (
            <li className="flex items-center gap-2" key={feature}>
              <CircleCheck className="size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

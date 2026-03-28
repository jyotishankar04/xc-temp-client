"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/shared/branding";
import { cn } from "@/lib/utils";
import { onboardingSchema, type OnboardingInput } from "@/lib/utils/validators";
import {
  ROUTES,
  ONBOARDING_ROLES,
  ONBOARDING_STACKS,
  ONBOARDING_ENVIRONMENTS,
  ONBOARDING_PAINS,
  ONBOARDING_PRIORITIES,
  ONBOARDING_TEAM_SIZES,
} from "@/lib/constants";

const TOTAL_STEPS = 3;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
};

const gridStyle: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(to right, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--card-foreground) 8%, transparent) 1px, transparent 1px)
  `,
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 0",
  maskImage: `
    repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
    repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
    radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
  `,
  WebkitMaskImage: `
    repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
    repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
    radial-gradient(ellipse 70% 50% at 50% 0%, #000 60%, transparent 100%)
  `,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [slugAuto, setSlugAuto] = useState(true);

  const {
    register,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      orgName: "",
      orgSlug: "",
      teamSize: "",
      role: "",
      stack: [],
      environment: "",
      pain: "",
      priority: "",
      notes: "",
    },
  });

  const orgName = watch("orgName");
  const orgSlug = watch("orgSlug");
  const teamSize = watch("teamSize");
  const role = watch("role");
  const stack = watch("stack");
  const environment = watch("environment");
  const pain = watch("pain");
  const priority = watch("priority");

  useEffect(() => {
    if (slugAuto && orgName) {
      setValue("orgSlug", slugify(orgName));
    }
  }, [orgName, slugAuto, setValue]);

  const toggleStack = useCallback(
    (value: string) => {
      const current = getValues("stack");
      if (current.includes(value)) {
        setValue(
          "stack",
          current.filter((s) => s !== value)
        );
      } else {
        setValue("stack", [...current, value]);
      }
    },
    [getValues, setValue]
  );

  const goNext = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(["orgName", "orgSlug"]);
    else if (step === 2) valid = await trigger(["role"]);
    else if (step === 3) valid = await trigger(["pain"]);

    if (valid && step <= TOTAL_STEPS) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border bg-gradient-to-b from-muted/50 to-card shadow-lg/5 dark:from-transparent dark:shadow-xl">
        <div
          className="absolute inset-0 -top-px -left-px z-0"
          style={gridStyle}
        />

        <div className="relative isolate">
          {/* Top bar: Logo + Step indicator */}
          <div className="flex items-center justify-between px-8 pt-8">
            <Logo className="h-8 w-8" />
            {step <= TOTAL_STEPS && (
              <span className="text-sm text-muted-foreground">
                Step {step} of {TOTAL_STEPS}
              </span>
            )}
          </div>

          {/* Step content */}
          <div className="px-8 pt-6 pb-8">
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Step1
                    register={register}
                    errors={errors}
                    orgSlug={orgSlug}
                    teamSize={teamSize}
                    onSlugEdit={(val) => {
                      setSlugAuto(false);
                      setValue("orgSlug", val);
                    }}
                    onTeamSize={(val) => setValue("teamSize", val)}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Step2
                    role={role}
                    stack={stack}
                    environment={environment}
                    errors={errors}
                    onRole={(val) => setValue("role", val)}
                    onToggleStack={toggleStack}
                    onEnvironment={(val) => setValue("environment", val)}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Step3
                    register={register}
                    errors={errors}
                    pain={pain}
                    priority={priority}
                    onPain={(val) => setValue("pain", val)}
                    onPriority={(val) => setValue("priority", val)}
                  />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Step4 />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {step <= TOTAL_STEPS && (
            <div className="flex items-center justify-between border-t px-8 py-5">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={step === 1}
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              {step < TOTAL_STEPS ? (
                <Button onClick={goNext}>
                  Continue
                  <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={goNext}>
                  Finish Setup
                  <Check className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Create Organization ────────────────────────────────────────────

interface Step1Props {
  register: ReturnType<typeof useForm<OnboardingInput>>["register"];
  errors: Record<string, { message?: string }>;
  orgSlug: string;
  teamSize: string | undefined;
  onSlugEdit: (val: string) => void;
  onTeamSize: (val: string) => void;
}

function Step1({
  register,
  errors,
  orgSlug,
  teamSize,
  onSlugEdit,
  onTeamSize,
}: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-xl tracking-tight">
          Create your workspace
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything in XecureCode is organized under a workspace.
          <br />
          You can invite your team later.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="orgName">Organization Name</Label>
          <Input
            id="orgName"
            placeholder="Acme Inc."
            className="mt-2"
            autoFocus
            {...register("orgName")}
          />
          {errors.orgName && (
            <p className="mt-1 text-sm text-destructive">
              {errors.orgName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="orgSlug">Workspace URL</Label>
          <div className="mt-2 flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted-foreground">
              app.xecurecode.dev/
            </span>
            <Input
              id="orgSlug"
              value={orgSlug}
              onChange={(e) => onSlugEdit(e.target.value)}
              className="flex-1"
            />
          </div>
          {errors.orgSlug && (
            <p className="mt-1 text-sm text-destructive">
              {errors.orgSlug.message}
            </p>
          )}
        </div>

        <div>
          <Label>Team Size</Label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {ONBOARDING_TEAM_SIZES.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => onTeamSize(size.value)}
                className={cn(
                  "rounded-lg border-2 px-3 py-2.5 text-center text-sm transition-all",
                  teamSize === size.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/20"
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Optional — helps us tailor your experience
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Role + Setup ───────────────────────────────────────────────────

interface Step2Props {
  role: string;
  stack: string[];
  environment: string | undefined;
  errors: Record<string, { message?: string }>;
  onRole: (val: string) => void;
  onToggleStack: (val: string) => void;
  onEnvironment: (val: string) => void;
}

function Step2({
  role,
  stack,
  environment,
  errors,
  onRole,
  onToggleStack,
  onEnvironment,
}: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-xl tracking-tight">
          Tell us about your setup
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This helps us configure your environment and recommendations.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-base">Your Role</Label>
          <RadioGroup
            value={role}
            onValueChange={onRole}
            className="mt-2 space-y-2"
          >
            {ONBOARDING_ROLES.map((r) => (
              <label
                key={r.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-all",
                  role === r.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-foreground/20"
                )}
              >
                <RadioGroupItem value={r.value} />
                <span className="text-sm">{r.label}</span>
              </label>
            ))}
          </RadioGroup>
          {errors.role && (
            <p className="mt-1 text-sm text-destructive">
              {errors.role.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-base">Tech Stack</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Select all that apply
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ONBOARDING_STACKS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => onToggleStack(s.value)}
                className={cn(
                  "rounded-lg border-2 px-4 py-2 text-sm transition-all",
                  stack.includes(s.value)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/20"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Deployment Environment</Label>
          <Select value={environment} onValueChange={onEnvironment}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Select your environment" />
            </SelectTrigger>
            <SelectContent>
              {ONBOARDING_ENVIRONMENTS.map((env) => (
                <SelectItem key={env.value} value={env.value}>
                  {env.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Pain + Intent ──────────────────────────────────────────────────

interface Step3Props {
  register: ReturnType<typeof useForm<OnboardingInput>>["register"];
  errors: Record<string, { message?: string }>;
  pain: string;
  priority: string | undefined;
  onPain: (val: string) => void;
  onPriority: (val: string) => void;
}

function Step3({
  register,
  errors,
  pain,
  priority,
  onPain,
  onPriority,
}: Step3Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-xl tracking-tight">
          What are you trying to improve?
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Help us understand your priorities so we can personalize your
          experience.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-base">Biggest Pain</Label>
          <RadioGroup
            value={pain}
            onValueChange={onPain}
            className="mt-2 space-y-2"
          >
            {ONBOARDING_PAINS.map((p) => (
              <label
                key={p.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 transition-all",
                  pain === p.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-foreground/20"
                )}
              >
                <RadioGroupItem value={p.value} />
                <span className="text-sm">{p.label}</span>
              </label>
            ))}
          </RadioGroup>
          {errors.pain && (
            <p className="mt-1 text-sm text-destructive">
              {errors.pain.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-base">Priority</Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {ONBOARDING_PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => onPriority(p.value)}
                className={cn(
                  "rounded-lg border-2 px-3 py-2.5 text-center text-sm transition-all",
                  priority === p.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/20"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Describe your biggest issue</Label>
          <Textarea
            id="notes"
            placeholder="Optional — tell us more about what you're dealing with..."
            className="mt-2 min-h-[80px] resize-none"
            {...register("notes")}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Success ────────────────────────────────────────────────────────

function Step4() {
  return (
    <div className="space-y-6 text-center">
      <div>
        <h2 className="font-semibold text-xl tracking-tight">
          Your workspace is ready
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your organization has been created.
        </p>
      </div>

      <div className="space-y-3 text-left text-sm text-muted-foreground">
        <p>You can now:</p>
        <ul className="space-y-2 pl-4">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            Connect your services
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            Start tracking failures
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            Get AI-driven insights
          </li>
        </ul>
      </div>

      <Button asChild className="w-full">
        <Link href={ROUTES.DASHBOARD_OVERVIEW}>Go to Dashboard</Link>
      </Button>
    </div>
  );
}

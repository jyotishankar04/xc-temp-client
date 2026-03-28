"use client";
import { useState, } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Brain,
  Shield,
  Eye,
  Lock,
  Github,
  Linkedin,
  CheckCircle2,
  ChevronRight,
  Zap,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/branding/logo";
import Link from "next/link";

/* ─── FADE-IN WRAPPER using motion/react ─── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ label, title, subtitle, center = false }: { label: string, title: string, subtitle?: string, center?: boolean }) {
  return (
    <FadeUp className={cn("mb-14", center && "text-center")}>
      <p className={cn("font-mono text-xs font-medium text-muted-foreground mb-3", center && "mx-auto")}>
        {label}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("text-muted-foreground text-base leading-relaxed max-w-xl", center && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </FadeUp>
  );
}

/* ─── DATA ─── */
const PRINCIPLES = [
  {
    icon: Brain,
    name: "Human-in-the-loop",
    desc: "No automatic actions. Engineers approve every critical step.",
    className: "hover:border-primary/40 hover:shadow-primary/5",
    iconClass: "text-primary bg-primary/10",
  },
  {
    icon: Eye,
    name: "Assistive AI",
    desc: "AI explains — it does not take control.",
    className: "hover:border-primary/40 hover:shadow-primary/5",
    iconClass: "text-primary bg-primary/10",
  },
  {
    icon: Shield,
    name: "Safety-first",
    desc: "Every recommendation is designed to reduce risk.",
    className: "hover:border-primary/40 hover:shadow-primary/5",
    iconClass: "text-primary bg-primary/10",
  },
  {
    icon: Lock,
    name: "Transparency",
    desc: "All actions are logged and fully explainable.",
    className: "hover:border-primary/40 hover:shadow-primary/5",
    iconClass: "text-primary bg-primary/10",
  },
];

/* ─── TEAM DATA ─── */
const teamMembers = [
  {
    name: "Sravesh Nandan",
    role: "Founder & CEO",
    description:
      "Backend architect with a passion for scalable systems and real-world production failures. Works on event-driven systems and developer tooling.",
    image: "/sn.jpg",
    github: "https://github.com/sraveshnandan",
    linkedin: "https://linkedin.com/in/sravesh-nandan",
    avatarColor: "bg-violet-50 text-violet-800",
  },
  {
    name: "Jyotishankar Patra",
    role: "Co-Founder & CTO",
    description:
      "Frontend architect building event-driven systems and developer tooling. Brings reliability thinking to the entire stack from UI to infra.",
    image: "/jp.jpg",
    github: "https://github.com/jyotishankar04",
    linkedin: "https://linkedin.com/in/jyotishankar-patra",
    avatarColor: "bg-teal-50 text-teal-800",
  },
  {
    name: "Snehashree Dash",
    role: "Co-Founder · Marketing & Frontend",
    description:
      "Bridges engineering and growth. Builds interfaces that convert and narratives that resonate — at the same time.",
    image: "/sd.jpg",
    github: "https://github.com/snehashree-das",
    linkedin: "https://linkedin.com/in/snehashree-das",
    avatarColor: "bg-pink-50 text-pink-800",
  },
];

const BACKERS = [
  { label: "DPIIT", sub: "Govt. of India" },
  { label: "Startup Bihar", sub: "Ecosystem" },
  { label: "IIT Patna", sub: "Incubated" },
];

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 py-32">

      <div className="relative z-10 max-w-3xl text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Logo className="w-20 h-20 rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="rounded-full border-border px-4 py-1.5 text-xs font-mono tracking-wider mb-8"
          >
            <span className="mr-2 inline-block w-1.5 h-1.5 rounded-full bg-primary align-middle" />
            About XecureCode
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          We believe production systems
          <br />
          should{" "}
          <span className="text-primary">fail safely.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto mb-3"
        >
          Modern software is powerful — but when it fails,
          teams are left <span className="text-foreground font-medium">guessing.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto"
        >
          We're building XecureCode to make failures{" "}
          <span className="text-foreground font-medium">
            understandable, predictable, and recoverable.
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 font-mono text-xs text-muted-foreground/60 tracking-wider"
        >
          Because reliability shouldn't depend on luck or experience.
        </motion.p>
      </div>
    </section>
  );
}

/* ─── PROBLEM ─── */
function Problem() {
  const incidents = [
    { icon: AlertTriangle, text: "Something breaks in production." },
    { icon: Zap, text: "Alerts start firing." },
    { icon: Terminal, text: "Logs flood in." },
  ];

  return (
    <section id="problem" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          label="01 — Why we started"
          title="Why we started"
        />

        <div className="space-y-6 text-muted-foreground text-base leading-relaxed">
          <FadeUp>
            <p>Every engineering team eventually hits the same wall.</p>
          </FadeUp>

          <FadeUp delay={80}>
            <div className="space-y-2 pl-1">
              {incidents.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.45 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <Icon className="w-4 h-4 text-primary/60 shrink-0" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={160}>
            <p>And the hardest question becomes:</p>
            <div className="mt-4 pl-5 py-4 pr-5 border-l-2 border-primary rounded-r-xl bg-primary/5">
              <p className="text-xl text-foreground font-medium italic leading-snug">
                "What actually caused this?"
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={220}>
            <p>
              Engineers jump between logs, dashboards, and deployment history —
              trying to reconstruct the story under pressure.
            </p>
            <p className="mt-4">
              This isn't just a tooling problem.{" "}
              <span className="text-foreground font-medium">It's a decision problem.</span>
            </p>
            <p className="mt-4">And most teams don't have the systems to solve it fast.</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─── BUILDING ─── */
function Building() {
  const pillars = [
    { before: "Showing signals", after: "Analyzing them" },
    { before: "Raw data", after: "Explanation" },
    { before: "Guesswork", after: "Guided recovery" },
  ];

  return (
    <section id="building" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          label="02 — What we're building"
          title="What we're building"
        />

        <div className="space-y-4 text-muted-foreground text-base leading-relaxed mb-12">
          <FadeUp>
            <p>
              XecureCode introduces a new layer in the stack:{" "}
              <span className="text-foreground font-medium">
                a decision layer between observability and action.
              </span>
            </p>
          </FadeUp>
        </div>

        {/* Flow diagram */}
        <FadeUp delay={100}>
          <div className="flex items-center justify-center gap-1 flex-wrap mb-12">
            {[
              { label: "Monitoring", sub: "Signals & Alerts", accent: false },
              null,
              { label: "XecureCode", sub: "Decision Layer", accent: true },
              null,
              { label: "Recovery", sub: "Guided Action", accent: false },
            ].map((node, i) =>
              node === null ? (
                <div key={i} className="flex items-center px-1">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground/20 -ml-2.5" />
                </div>
              ) : (
                <div
                  key={i}
                  className={cn(
                    "px-5 py-3 rounded-xl border transition-all duration-200",
                    node.accent
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card"
                  )}
                >
                  <p className={cn("font-mono text-xs font-semibold tracking-wider", node.accent ? "text-primary" : "text-muted-foreground")}>
                    {node.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground/50 font-mono mt-0.5">{node.sub}</p>
                </div>
              )
            )}
          </div>
        </FadeUp>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map(({ before, after }, i) => (
            <FadeUp key={before} delay={i * 80}>
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-wider mb-2">Instead of</p>
                <p className="text-sm text-muted-foreground line-through mb-3">{before}</p>
                <Separator className="mb-3 bg-border/60" />
                <p className="text-sm text-primary font-medium">{after}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRINCIPLES ─── */
function Principles() {
  return (
    <section id="principles" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          label="03 — Core principles"
          title="Built with strong principles"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PRINCIPLES.map((p, i) => (
            <FadeUp key={p.name} delay={i * 70}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg",
                  p.className
                )}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(ellipse at top left, hsl(var(--primary)/0.04), transparent 65%)",
                  }}
                />
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", p.iconClass)}>
                  <p.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── VISION ─── */
function Vision() {
  return (
    <section id="vision" className="py-24 px-6 bg-muted/30">
      <div className="max-w-2xl mx-auto text-center">
        <SectionHeader
          label="04 — Our vision"
          title="Our vision"
          center
        />
        <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
          <FadeUp>
            <p>
              We believe every engineering team —
              not just those with dedicated SREs —
              should be able to operate{" "}
              <span className="text-foreground font-medium">reliable systems.</span>
            </p>
          </FadeUp>
          <FadeUp delay={80}>
            <p>
              Our goal is to make production reliability{" "}
              <span className="text-foreground font-medium">
                accessible, understandable, and safe by default.
              </span>
            </p>
          </FadeUp>
          <FadeUp delay={150}>
            <p>From startups to large-scale systems, we want to redefine how teams handle failure.</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─── WHY NOW ─── */
function WhyNow() {
  const stats = [
    { num: "3×", label: "More distributed systems vs 5 yrs ago" },
    { num: "74%", label: "Increase in mean time to diagnose" },
    { num: "0", label: "Existing tools for decision intelligence" },
  ];

  return (
    <section id="why-now" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          label="05 — Why now"
          title="Why now"
        />

        <div className="space-y-4 text-muted-foreground text-base leading-relaxed mb-12">
          {[
            <>Systems are becoming more complex. <span className="text-foreground font-medium">Distributed architectures are the norm.</span></>,
            "Failures are harder to diagnose than ever.",
            "But the tools haven't evolved enough.",
            <>We're building XecureCode to close that gap — <span className="text-foreground font-medium">by turning signals into decisions.</span></>,
          ].map((line, i) => (
            <FadeUp key={i} delay={i * 70}>
              <p>{line}</p>
            </FadeUp>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map(({ num, label }, i) => (
            <FadeUp key={label} delay={i * 80}>
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">{num}</p>
                <p className="text-sm text-muted-foreground leading-snug">{label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TEAM ─── */
function Team() {
  return (
    <section className="py-24 px-4">
      <div className="container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 rounded-full text-xs tracking-widest uppercase"
          >
            The team
          </Badge>
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            The people building <span className="text-primary">XecureCode</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Engineers focused on solving real production problems —
            building systems that make reliability simpler and safer.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {teamMembers.map((member, index) => {
            const initials = member.name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((p) => p[0].toUpperCase())
              .join("");

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group bg-background hover:bg-muted/60 transition-all duration-300 p-6 flex flex-col gap-4"
              >
                {/* Avatar + Name block */}
                <div className="flex flex-col items-start gap-2">
                  {/* Image */}
                  <div className="relative rounded-[10px] overflow-hidden border border-border/50 shrink-0 transition-all duration-300 ease-in-out w-16 h-16 group-hover:w-40 group-hover:h-40">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center text-base font-medium",
                          member.avatarColor
                        )}
                      >
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Name + Role — beside image by default, below on hover */}
                  <div className="flex flex-col transition-all duration-300 group-hover:mt-1">
                    <h3 className="text-sm font-medium leading-snug">{member.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Description — always visible */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.description}
                </p>

                {/* Hover-revealed section */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300">
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-3 pt-1">

                      {/* Links */}
                      <div className="flex gap-2 pt-2 border-t border-border/50">
                        <Link
                          href={member.github}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                          aria-label={`${member.name} GitHub`}
                        >
                          <Github className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={member.linkedin}
                          className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                          aria-label={`${member.name} LinkedIn`}
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Join / Opportunities Card */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-primary/5 via-background to-primary/5 p-8 md:p-12">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
            <div className="relative flex flex-col items-center text-center gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-medium">
                  Join the team
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  We're always looking for passionate engineers who want to build
                  the future of secure, reliable code.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  asChild
                >
                  <Link href="/careers">
                    View open positions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  asChild
                >
                  <Link href="/contact">
                    Send spontaneous application
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Remote-first culture</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Flexible work hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Competitive compensation</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div> */}

        <p className="text-center text-xs text-muted-foreground tracking-wide mt-6">
          {teamMembers.length} co-founders · remote-first · flexible work hours
        </p>
      </div>
    </section>
  );
}

/* ─── BACKING ─── */
function Backing() {
  return (
    <section id="backing" className="py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <FadeUp>
          <p className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Supported & incubated by
          </p>
          <p className="text-muted-foreground text-sm mb-10 max-w-md mx-auto leading-relaxed">
            XecureCode is supported by leading institutions and startup ecosystems focused on deep tech innovation.
          </p>
        </FadeUp>
        <FadeUp delay={80}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {BACKERS.map(({ label, sub }) => (
              <div
                key={label}
                className="px-6 py-4 border border-border rounded-xl bg-card flex items-center gap-3 hover:border-border/80 transition-colors duration-200"
              >
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                <div className="text-left">
                  <p className="font-mono text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground/60">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="cta" className="py-32 px-6 text-center relative overflow-hidden">
      {/* bottom glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, hsl(var(--primary)/0.08), transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-xl mx-auto">
        <FadeUp>
          <Badge
            variant="outline"
            className="rounded-full border-border px-4 py-1.5 text-xs font-mono tracking-wider mb-6"
          >
            Early Access
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Join us early
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-md mx-auto">
            We're currently building XecureCode in private. If you care about production reliability,
            incident response, or building resilient systems — we'd love to have you early.
          </p>
        </FadeUp>

        <FadeUp delay={100}>
          {!submitted ? (
            <>
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && email && setSubmitted(true)}
                  className="h-12 rounded-full bg-background border-input px-6 text-base"
                />
                <Button
                  size="lg"
                  className="rounded-full h-12 px-7 whitespace-nowrap text-base font-medium"
                  onClick={() => email && setSubmitted(true)}
                >
                  Join Waitlist <ArrowUpRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground/60 font-mono">
                Join 200+ engineers already on the waitlist
              </p>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-primary"
            >
              <CheckCircle2 className="w-5 h-5" />
              <p className="text-base font-medium">You're on the list. We'll be in touch.</p>
            </motion.div>
          )}
        </FadeUp>
      </div>
    </section>
  );
}

/* ─── ROOT EXPORT ─── */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <Problem />
      <Building />
      <Principles />
      <Vision />
      <WhyNow />
      <Team />
      <Backing />
      <CTA />
    </div>
  );
}
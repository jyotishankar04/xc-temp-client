// components/custom/about/about-page.tsx
"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Github,
  Linkedin,
  Shield,
  Brain,
  Eye,
  Zap,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Team member data with images
const teamMembers = [
  {
    name: "Alex Chen",
    role: "Founder & Backend Engineer",
    description: "Focused on building scalable systems and solving real-world production failures. Previously worked on backend architecture, event-driven systems, and developer tooling.",
    image: "/team/alex.jpg", // Add your image paths
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Sarah Kumar",
    role: "Co-Founder / Frontend & Systems Engineer",
    description: "Designs intuitive interfaces for complex systems and focuses on developer experience. Works on dashboards, interaction design, and system visualization.",
    image: "/team/sarah.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Future Team Member",
    role: "Joining soon",
    description: "We're building a small, focused team. If you care about reliability and systems, we'd love to talk.",
    image: "/team/future.jpg",
    isFuture: true,
  },
];

const principles = [
  {
    icon: Shield,
    title: "Human-in-the-loop",
    description: "No automatic actions. Engineers approve every critical step.",
    color: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: Brain,
    title: "Assistive AI",
    description: "AI explains — it does not take control.",
    color: "from-purple-500/20 to-purple-500/5",
    iconColor: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Safety-first",
    description: "Every recommendation is designed to reduce risk.",
    color: "from-pink-500/20 to-pink-500/5",
    iconColor: "text-pink-500",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "All actions are logged and fully explainable.",
    color: "from-green-500/20 to-green-500/5",
    iconColor: "text-green-500",
  },
];

const partners = [
  {
    name: "DPIIT",
    fullName: "DPIIT (Govt. of India)",
    logo: "/partners/dpiit.svg",
  },
  {
    name: "Startup Bihar",
    fullName: "Startup Bihar",
    logo: "/partners/startup-bihar.svg",
  },
  {
    name: "IIT Patna",
    fullName: "IIT Patna",
    logo: "/partners/iit-patna.svg",
  },
];

export function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* 1️⃣ Hero Section */}
      <section className="py-32 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6">Mission first</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              We believe production systems
              <span className="text-primary block">should fail safely.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Modern software is powerful — but when it fails, teams are left guessing.
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
              We're building X Tech to make failures understandable, predictable, and recoverable.
            </p>
            <div className="mt-8 pt-4 border-t border-border/50 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground italic">
                Because reliability shouldn't depend on luck or experience.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2️⃣ The Problem */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <Badge variant="outline">Why we started</Badge>

            <div className="space-y-6 text-lg">
              <p className="text-muted-foreground">
                Every engineering team eventually hits the same wall.
              </p>

              <p className="text-muted-foreground">
                Something breaks in production.<br />
                Alerts start firing.<br />
                Logs flood in.
              </p>

              <div className="py-6">
                <div className="border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-lg">
                  <p className="text-2xl font-medium italic">
                    “What actually caused this?”
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground">
                Engineers jump between logs, dashboards, and deployment history —
                trying to reconstruct the story under pressure.
              </p>

              <div className="pt-6 border-t border-border/50">
                <p className="text-xl font-medium">
                  This isn't just a tooling problem.
                </p>
                <p className="text-xl font-medium text-primary mt-2">
                  It's a decision problem.
                </p>
                <p className="text-muted-foreground mt-4">
                  And most teams don't have the systems to solve it fast.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3️⃣ What We're Building */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">What we're building</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A new layer in the stack
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-right">
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <h3 className="font-semibold text-lg mb-2">Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Signals and metrics from your systems
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
              </div>
              <div className="p-8 bg-primary/10 rounded-2xl border-2 border-primary/30 text-center relative z-10">
                <h3 className="font-bold text-xl mb-2">X Tech</h3>
                <p className="text-sm">Decision layer between observability and action</p>
              </div>
            </div>

            <div className="text-center md:text-left">
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
                <h3 className="font-semibold text-lg mb-2">Recovery</h3>
                <p className="text-sm text-muted-foreground">
                  Guided actions and safe rollbacks
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-lg font-medium">Instead of just showing signals,</p>
              <p className="text-primary">we analyze them.</p>
            </div>
            <div>
              <p className="text-lg font-medium">Instead of raw data,</p>
              <p className="text-primary">we provide explanation.</p>
            </div>
            <div>
              <p className="text-lg font-medium">Instead of guesswork,</p>
              <p className="text-primary">we guide recovery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ Core Principles */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Trust by design</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built with strong principles
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${principle.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <principle.icon className={`w-6 h-6 ${principle.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                  <p className="text-muted-foreground">{principle.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Vision Section */}
      <section className="py-24 px-4">
        <div className="container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Our vision</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Reliability for every team
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              We believe every engineering team — not just those with dedicated SREs —
              should be able to operate reliable systems.
            </p>
            <p className="text-lg">
              Our goal is to make production reliability{" "}
              <span className="text-primary font-medium">
                accessible, understandable, and safe by default.
              </span>
            </p>
            <p className="text-muted-foreground mt-4">
              From startups to large-scale systems, we want to redefine how teams handle failure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 6️⃣ Why Now */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4">Why now</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The gap is growing
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Systems are becoming more complex. Distributed architectures are the norm.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              Failures are harder to diagnose than ever.
            </p>
            <p className="text-lg">
              But the tools haven't evolved enough.
            </p>
            <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xl font-medium">
                We're building X Tech to close that gap —
                by turning signals into decisions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7️⃣ Team Section */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">The team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The people building X Tech
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're engineers focused on solving real production problems —
              building systems that make reliability simpler and safer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-square bg-muted relative">
                    {member.isFuture ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-4xl opacity-20">✨</span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <span className="text-6xl opacity-20">👤</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold">{member.name}</h3>
                        <p className="text-sm text-primary">{member.role}</p>
                      </div>
                      {!member.isFuture && (
                        <div className="flex gap-2">
                          <Link href={member.github!} className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="w-4 h-4" />
                          </Link>
                          <Link href={member.linkedin!} className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.description}
                    </p>
                    {member.isFuture && (
                      <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                        <Link href="/careers">
                          Join the team
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8️⃣ Backing / Credibility */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4">Backing & support</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supported & incubated by
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              X Tech is supported by leading institutions and startup ecosystems
              focused on deep tech innovation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50"
                >
                  <div className="h-12 mb-3 flex items-center justify-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xl opacity-50">🏛️</span>
                    </div>
                  </div>
                  <p className="font-medium">{partner.fullName}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9️⃣ Final CTA */}
      <section className="py-32 px-4">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6">Join us early</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join us early
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're currently building X Tech in private.
            </p>
            <p className="text-xl mb-10">
              If you care about production reliability, incident response,
              or building resilient systems — we'd love to have you early.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/waitlist">
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
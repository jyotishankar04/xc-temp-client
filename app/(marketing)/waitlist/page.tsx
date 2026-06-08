"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Mail, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/branding/logo";
import { motion } from "motion/react";

const benefits = [
  "Product launch updates",
  "Beta availability notices",
  "Reliability workflow guides",
  "No spam. Unsubscribe anytime",
];

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined, source: "marketing" }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.message || body?.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Logo className="w-20 h-20 rounded-full" />
          </motion.div>

          <span className="text-sm font-mono text-muted-foreground tracking-widest mb-4">
            PRODUCT UPDATES
          </span>

          <h1 className="text-3xl font-semibold tracking-tight mb-3">
            Get XecureCode
            <br />
            <span className="text-primary">launch updates</span>
          </h1>

          <p className="text-muted-foreground text-sm max-w-sm mb-8">
            Subscribe for release notes, launch news, and practical reliability updates.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Label htmlFor="waitlist-name" className="sr-only">Name</Label>
                <Input
                  id="waitlist-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="pl-10 h-12"
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Label htmlFor="waitlist-email" className="sr-only">Email</Label>
                <Input
                  id="waitlist-email"
                  type="email"
                  required
                  aria-required="true"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10 h-12"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={!email || isSubmitting}
              >
                <Zap className="mr-2 h-4 w-4" />
                {isSubmitting ? "Subscribing..." : "Subscribe for Updates"}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <p className="text-xs text-muted-foreground/60">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full p-6 bg-muted/30 border border-border rounded-xl text-center"
            >
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">You are subscribed.</h3>
              <p className="text-sm text-muted-foreground">
                We will email you when there are product updates.
              </p>
            </motion.div>
          )}

          {!isSubmitted && (
            <div className="mt-10 text-left w-full">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                What you get
              </p>
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

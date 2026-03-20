// components/custom/waitlist/waitlist-page.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import { useState } from "react";
import { CheckCircle2, Mail, User, Phone } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!email || !teamSize || !useCase || !firstName || !lastName || !contactNumber) {
      setSubmitError("Please complete all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          contactNumber,
          teamSize,
          useCase,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSubmitError(body?.error || "Failed to submit. Please try again.");
        return;
      }

      setSubmitted(true);
      setEmail("");
      setTeamSize("");
      setUseCase("");
      setFirstName("");
      setLastName("");
      setContactNumber("");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-md px-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-lg font-mono text-muted-foreground tracking-wider">
                EARLY ACCESS
              </span>
            </div>
            <h1 className="text-3xl font-medium mb-2">
              Join the waitlist
            </h1>
            <p className="text-muted-foreground text-sm">
              Be among the first to experience AI-powered reliability for your production systems.
            </p>
          </div>

          {/* Main form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* First name input with icon */}
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                  />
                </InputGroup>

                {/* Last name input with icon */}
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                  />
                </InputGroup>

                {/* Email input with icon */}
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email"
                    required
                  />
                </InputGroup>

                {/* Contact number input with icon */}
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Contact number"
                    required
                  />
                </InputGroup>

                {/* Team size select */}
                <Select value={teamSize} onValueChange={setTeamSize} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1–5 engineers</SelectItem>
                    <SelectItem value="6-20">6–20 engineers</SelectItem>
                    <SelectItem value="21-50">21–50 engineers</SelectItem>
                    <SelectItem value="50+">50+ engineers</SelectItem>
                  </SelectContent>
                </Select>

                {/* Use case select */}
                <Select value={useCase} onValueChange={setUseCase} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Primary use case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="CloudInfrastructure">Cloud Infrastructure</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                Join waitlist
              </Button>

              {submitError ? (
                <p className="text-sm text-red-500 text-center">{submitError}</p>
              ) : null}

              <p className="text-xs text-center text-muted-foreground">
                No spam. Only product updates.
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-muted/30 border border-border rounded-lg text-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium mb-1">You&#39;re on the list!</h3>
              <p className="text-sm text-muted-foreground">
                Thanks for joining. We&#39;ll reach out when we&#39;re ready to onboard new users.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WaitlistPage;
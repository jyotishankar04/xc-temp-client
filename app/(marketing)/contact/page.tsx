"use client";


import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Mail, User, Send, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Logo } from "@/components/shared/branding/logo";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setSubmitError(body?.error || "Failed to submit. Please try again.");
        return;
      }

      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      reset();
    } catch {
      setSubmitError("Network error. Please try again.");
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
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Logo className="w-20 h-20 rounded-full" />
            </motion.div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-lg font-mono text-muted-foreground tracking-wider">
                CONTACT
              </span>
            </div>
            <h1 className="text-3xl font-medium mb-2">
              Get in touch with the
              <span className="text-primary"> XecureCode</span> team
            </h1>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-3">
                {/* Name */}
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Minimum 2 characters",
                      },
                    })}
                    placeholder="Full name"
                  />
                </InputGroup>
                {errors.name && (
                  <p className="text-sm text-red-500 -mt-2">
                    {errors.name.message}
                  </p>
                )}

                {/* Email */}
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                      },
                    })}
                    placeholder="Email address"
                  />
                </InputGroup>
                {errors.email && (
                  <p className="text-sm text-red-500 -mt-2">
                    {errors.email.message}
                  </p>
                )}

                {/* Message */}
                <Textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Minimum 10 characters",
                    },
                  })}
                  placeholder="How can we help?"
                  className="min-h-[120px] resize-none"
                />
                {errors.message && (
                  <p className="text-sm text-red-500 -mt-2">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              {submitError && (
                <p className="text-sm text-red-500 text-center">
                  {submitError}
                </p>
              )}

              <p className="text-xs text-center text-muted-foreground">
                Or reach us directly at{" "}
                <a
                  href="mailto:hello@xecurecode.com"
                  className="text-primary hover:underline"
                >
                  hello@xecurecode.com
                </a>
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-muted/30 border border-border rounded-lg text-center"
            >
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium mb-1">Message sent!</h3>
              <p className="text-sm text-muted-foreground">
                We'll get back to you within 24 hours.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
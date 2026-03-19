// components/custom/coming-soon.tsx
"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Send, X } from "lucide-react";

interface ComingSoonProps {
  page: "solutions" | "blogs" | "about" | "contact";
}

const pageTitles = {
  solutions: {
    title: "Solutions",
    description: "Industry-specific reliability solutions coming soon.",
    waitlist: "Get early access to our solutions",
    contact: "Interested in custom solutions?"
  },
  blogs: {
    title: "Blogs",
    description: "Articles and insights about AI-powered reliability.",
    waitlist: "Be first to know when we publish",
    contact: "Want to contribute?"
  },
  about: {
    title: "About",
    description: "Learn more about our mission and team.",
    waitlist: "Join our journey",
    contact: "Questions about our team?"
  },
  contact: {
    title: "Contact",
    description: "Get in touch with our team.",
    waitlist: "Stay updated",
    contact: "Reach out directly"
  },
};

export const ComingSoon = ({ page }: ComingSoonProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const content = pageTitles[page];


  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Simple back link */}
        <div className="absolute top-6 left-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="container mx-auto max-w-md px-4 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full text-center"
          >
            {/* Simple indicator */}
            <div className="mb-8">
              <span className="text-xs font-mono text-muted-foreground tracking-wider">
                COMING SOON
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-medium mb-3">
              {content.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-8">
              {content.description}
            </p>

            {/* Two-button layout */}
            <div className="flex flex-col gap-2">
              <Link href="/waitlist">
                <Button
                  className="w-full gap-2"
                  size="lg"
                >
                  <Mail className="h-4 w-4" />
                  Join waitlist
                  <span className="text-xs opacity-80 ml-1">→</span>
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                >
                  <Send className="h-4 w-4" />
                  Contact us
                </Button>
              </Link>
            </div>

            {/* Contextual hints */}
            <div className="mt-8 space-y-2">
              <p className="text-xs text-muted-foreground">
                {content.waitlist}
              </p>
              <p className="text-xs text-muted-foreground">
                {content.contact}
              </p>
            </div>

            {/* Simple note */}
            <p className="text-xs text-muted-foreground mt-6">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};
// components/custom/how-it-works/faq.tsx
"use client";

import { motion } from "motion/react";
import { ChevronDown, HelpCircle, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does it take to integrate?",
    answer: "Most users are up and running in under 5 minutes. Our SDK is designed for zero-config setup with automatic instrumentation. Just install the package and initialize with your API key.",
    category: "setup",
  },
  {
    question: "What languages/frameworks do you support?",
    answer: "We support all major languages including JavaScript/TypeScript, Python, Java, Go, Ruby, and PHP. For frameworks, we have native support for React, Next.js, Vue, Node.js, Django, Spring Boot, and more.",
    category: "support",
  },
  {
    question: "How does the AI analysis work?",
    answer: "Our AI models analyze failure patterns, stack traces, system state, and historical data to identify root causes. We use a combination of machine learning and rule-based systems to provide accurate, explainable insights.",
    category: "ai",
  },
  {
    question: "Is it safe to use in production?",
    answer: "Absolutely. We never take automatic actions without human approval. All recommendations are reviewed before execution, and we provide complete audit logs of every decision.",
    category: "safety",
  },
  {
    question: "What about team collaboration?",
    answer: "Our platform supports team workflows with role-based access control, approval workflows, and real-time notifications. You can set up custom approval chains for different types of failures.",
    category: "team",
  },
  {
    question: "How is data secured?",
    answer: "We use TLS 1.3 encryption for all data in transit, AES-256 for data at rest, and support private cloud deployments. We're SOC2 Type II compliant and GDPR ready.",
    category: "security",
  },
];

export const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All" },
    { id: "setup", label: "Setup" },
    { id: "ai", label: "AI & Analysis" },
    { id: "safety", label: "Safety" },
    { id: "security", label: "Security" },
  ];

  const filteredFaqs = activeCategory === "all"
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs font-mono">
            FAQ
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently asked <span className="text-primary">questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about XecureCode
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
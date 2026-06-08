// components/custom/how-it-works/step-by-step.tsx
"use client";

import { motion } from "motion/react";
import {
  Code2,
  Zap,
  Brain,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
} from "@/components/kibo-ui/code-block";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import type { BundledLanguage } from "@/components/kibo-ui/code-block";

const steps = [
  {
    number: "01",
    icon: Code2,
    title: "Integrate SDK",
    description: "Add our lightweight SDK to your application with just a few lines of code. Works with any language or framework.",
    details: [
      "NPM, pip, gem, or direct download",
      "Auto-instrumentation available",
      "< 5% CPU overhead",
    ],
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    number: "02",
    icon: Zap,
    title: "Real-time Detection",
    description: "Our SDK automatically captures failures, anomalies, and performance issues as they happen in production.",
    details: [
      "Sub-millisecond latency",
      "Automatic context capture",
      "Stack trace + system state",
    ],
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/20",
    iconColor: "text-purple-500",
  },
  {
    number: "03",
    icon: Brain,
    title: "AI Analysis",
    description: "Our AI models analyze the failure, identify root causes, and generate natural language explanations.",
    details: [
      "Pattern recognition",
      "Historical context",
      "Natural language insights",
    ],
    color: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/20",
    iconColor: "text-pink-500",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Guided Recovery",
    description: "Get actionable recommendations and safely execute recovery steps with human approval at every stage.",
    details: [
      "Safe rollback strategies",
      "Human approval gates",
      "Complete audit trail",
    ],
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/20",
    iconColor: "text-green-500",
  },
];

const codeSnippets = [
  {
    language: "javascript",
    label: "JavaScript",
    filename: "app.js",
    code: `// Install the SDK
// npm install @xecurecode/sdk

import { XecureCode } from '@xecurecode/sdk';

// Initialize with your API key
XecureCode.init({ 
  apiKey: 'your-api-key-here',
  environment: 'production',
  autoInstrument: true 
});

// Example: Monitor a function
XecureCode.monitor(async () => {
  const data = await fetch('/api/users');
  return data.json();
});`,
  },
  {
    language: "python",
    label: "Python",
    filename: "app.py",
    code: `# Install the SDK
# pip install xecurecode-sdk

from xecurecode import XecureCode

# Initialize with your API key
xecure = XecureCode.init(
    api_key='your-api-key-here',
    environment='production',
    auto_instrument=True
)

# Example: Monitor a function
@xecure.monitor
def get_users():
    response = requests.get('/api/users')
    return response.json()

# Or use context manager
with xecure.trace("database-query"):
    users = db.query("SELECT * FROM users")`,
  },
  {
    language: "java",
    label: "Java",
    filename: "Application.java",
    code: `// Add to your pom.xml
// <dependency>
//     <groupId>com.xecurecode</groupId>
//     <artifactId>sdk</artifactId>
//     <version>1.0.0</version>
// </dependency>

import com.xecurecode.XecureCode;
import com.xecurecode.annotation.Monitored;

public class Application {
    public static void main(String[] args) {
        // Initialize with your API key
        XecureCode.init(
            XecureConfig.builder()
                .apiKey("your-api-key-here")
                .environment("production")
                .autoInstrument(true)
                .build()
        );
    }
    
    @Monitored
    public List<User> getUsers() {
        // This method will be automatically monitored
        return userRepository.findAll();
    }
}`,
  },
];

export const StepByStep = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How it{" "}
            <span className="text-primary">works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to production peace of mind
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line for mobile */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent lg:hidden" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="relative flex flex-col lg:flex-row gap-8 mb-12 last:mb-0"
            >
              {/* Step number and icon */}
              <div className="relative lg:w-64 flex-shrink-0">
                <div className="flex items-center gap-4 lg:block">
                  <div className={`relative z-10 w-10 h-10 rounded-2xl bg-gradient-to-br ${step.color} border ${step.border} flex items-center justify-center lg:mb-4`}>
                    <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                  </div>
                  <div className="lg:mt-2">
                    <span className="text-sm font-mono text-muted-foreground">{step.number}</span>
                    <h3 className="text-xl font-bold hidden lg:block">{step.title}</h3>
                  </div>
                </div>

                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent h-24" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 lg:pt-12">
                <h3 className="text-xl font-bold lg:hidden mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{step.description}</p>

                {/* Details list */}
                <div className="space-y-2">
                  {step.details.map((detail, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 + i * 0.03 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <CheckCircle2 className={`w-4 h-4 ${step.iconColor} flex-shrink-0`} />
                      <span className="text-muted-foreground">{detail}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Code snippet example (for first step) */}
                {index === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                  >
                    <Tabs
                      defaultValue="javascript"
                      onValueChange={setSelectedLanguage}
                    >
                      <TabsList className="h-9 w-full justify-start rounded-b-none bg-background/80 border border-border/50 border-b-0">
                        {codeSnippets.map((snippet) => (
                          <TabsTrigger
                            key={snippet.language}
                            value={snippet.language}
                            className="text-xs"
                          >
                            {snippet.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>

                    <CodeBlock
                      data={codeSnippets}
                      value={selectedLanguage}
                      className="w-full border border-border/50 rounded-t-none"
                    >
                      <CodeBlockHeader className="bg-background/80">
                        <CodeBlockFiles>
                          {(item) => (
                            <CodeBlockFilename
                              key={item.language}
                              value={item.language}
                              className="text-xs"
                            >
                              {item.filename}
                            </CodeBlockFilename>
                          )}
                        </CodeBlockFiles>
                        <CodeBlockCopyButton
                          onCopy={() => console.log("Copied code to clipboard")}
                          onError={() =>
                            console.error("Failed to copy code to clipboard")
                          }
                        />
                      </CodeBlockHeader>
                      <ScrollArea className="w-full">
                        <CodeBlockBody>
                          {(item) => (
                            <CodeBlockItem
                              key={item.language}
                              value={item.language}
                              className="max-h-72 w-full"
                            >
                              <CodeBlockContent
                                language={item.language as BundledLanguage}
                              >
                                {item.code}
                              </CodeBlockContent>
                            </CodeBlockItem>
                          )}
                        </CodeBlockBody>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </CodeBlock>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
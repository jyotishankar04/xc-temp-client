"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";

type AuditEntry = {
  id: string;
  actor: string;
  actorType: "user" | "ai" | "system";
  action: string;
  target: string;
  time: string;
  details?: string;
};

const entries: AuditEntry[] = [
  {
    id: "1",
    actor: "Rahul Verma",
    actorType: "user",
    action: "approved",
    target: "Rollback payments-api",
    time: "10:52 AM",
    details: "Case #142 recovery action approved",
  },
  {
    id: "2",
    actor: "XecureCode AI",
    actorType: "ai",
    action: "generated recommendation",
    target: "Rollback v1.4.2",
    time: "10:46 AM",
    details: "Confidence: 72% — Database connection pool exhaustion",
  },
  {
    id: "3",
    actor: "XecureCode AI",
    actorType: "ai",
    action: "completed analysis",
    target: "Case #142",
    time: "10:45 AM",
    details: "Root cause identified with 72% confidence",
  },
  {
    id: "4",
    actor: "System",
    actorType: "system",
    action: "created case",
    target: "Case #142",
    time: "10:44 AM",
    details: "Grouped 37 occurrences from payments-api",
  },
  {
    id: "5",
    actor: "System",
    actorType: "system",
    action: "connected service",
    target: "payments-api",
    time: "Jan 15, 2025",
    details: "SDK installed and events streaming",
  },
  {
    id: "6",
    actor: "Priya Sharma",
    actorType: "user",
    action: "invited member",
    target: "Amit Kumar",
    time: "Mar 10, 2025",
  },
  {
    id: "7",
    actor: "XecureCode AI",
    actorType: "ai",
    action: "detected pattern",
    target: "Deployment-related failures",
    time: "Mar 8, 2025",
    details: "8 occurrences detected across 3 services",
  },
];

const actorConfig = {
  user: { icon: <User className="size-3.5" />, color: "text-blue-600", bg: "bg-blue-500/10" },
  ai: { icon: <Bot className="size-3.5" />, color: "text-purple-600", bg: "bg-purple-500/10" },
  system: { icon: <Shield className="size-3.5" />, color: "text-muted-foreground", bg: "bg-muted" },
};

export default function AuditPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Complete history of all actions and AI outputs
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {entries.map((entry) => {
              const config = actorConfig[entry.actorType];
              const isExpanded = expanded === entry.id;
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${config.bg} ${config.color}`}
                  >
                    {config.icon}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{entry.actor}</span>
                      <span className="text-sm text-muted-foreground">{entry.action}</span>
                      <Badge variant="outline" className="text-xs font-normal shrink-0">
                        {entry.target}
                      </Badge>
                    </div>
                    {entry.details && (
                      <p className="text-xs text-muted-foreground">{entry.details}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {entry.time}
                    </span>
                    {entry.details && (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : entry.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

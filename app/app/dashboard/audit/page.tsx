"use client";

import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, Loader2, Shield, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuditLogs } from "@/lib/hooks";
import type { AuditLog } from "@/lib/api";
import { JsonViewer } from "@/components/ui/json-viewer";

const actorConfig: Record<
  AuditLog["actorType"],
  { icon: React.ReactNode; color: string; bg: string }
> = {
  user: { icon: <User className="size-3.5" />, color: "text-primary", bg: "bg-primary/10" },
  ai: { icon: <Bot className="size-3.5" />, color: "text-chart-4", bg: "bg-chart-4/10" },
  system: { icon: <Shield className="size-3.5" />, color: "text-muted-foreground", bg: "bg-muted" },
};

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleString();
}

export default function AuditPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data, isLoading, error } = useAuditLogs({ limit: 50 });

  const entries = data?.logs ?? [];

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
          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-destructive">
              Failed to load audit logs.
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No audit entries found.
            </div>
          ) : (
            <div className="divide-y">
              {entries.map((entry) => {
                const config = actorConfig[entry.actorType];
                const isExpanded = expanded === entry.id;

                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${config.bg} ${config.color}`}
                    >
                      {config.icon}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{entry.actor}</span>
                        <span className="text-sm text-muted-foreground">{entry.action}</span>
                        <Badge variant="outline" className="shrink-0 text-xs font-normal">
                          {entry.target}
                        </Badge>
                        <Badge variant="secondary" className="shrink-0 text-xs font-normal">
                          {entry.targetType}
                        </Badge>
                      </div>
                      {entry.details && !isExpanded && (
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-2xl">
                          {entry.details.slice(0, 120)}{entry.details.length > 120 ? "…" : ""}
                        </p>
                      )}
                      {entry.details && isExpanded && (
                        <div className="mt-1">
                          {(() => {
                            try {
                              const parsed = JSON.parse(entry.details);
                              return <JsonViewer data={parsed} />;
                            } catch {
                              return (
                                <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap break-all bg-muted rounded-lg p-3">
                                  {entry.details}
                                </pre>
                              );
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatDate(entry.timestamp)}
                      </span>
                      {entry.details && (
                        <button
                          type="button"
                          onClick={() => setExpanded(isExpanded ? null : entry.id)}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

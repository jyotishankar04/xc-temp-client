"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCorrelatedEvents } from "@/lib/hooks";
import { Loader2, ArrowLeft, Clock, AlertTriangle, Server, Zap, Waves, Activity } from "lucide-react";
import type { Event } from "@/lib/types/event";

const severityConfig = {
  critical: {
    color: "text-severity-high",
    bg: "bg-severity-high/10",
    badge: "bg-severity-high text-white",
    label: "Critical",
    icon: Zap
  },
  warning: {
    color: "text-severity-medium",
    bg: "bg-severity-medium/10",
    badge: "bg-severity-medium text-foreground",
    label: "Warning",
    icon: Waves
  },
  info: {
    color: "text-muted-foreground",
    bg: "bg-muted",
    badge: "bg-muted text-muted-foreground",
    label: "Info",
    icon: Activity
  },
};

const getSeverity = (event: Event): "critical" | "warning" | "info" => {
  if (event.stackTrace) return "critical";
  if (event.errorMessage && event.errorMessage.length > 100) return "warning";
  return "info";
};

export default function CorrelatedEventsPage() {
  const params = useParams();
  const eventId = params?.eventId as string;

  const { data: correlatedEvents = [], isLoading } = useCorrelatedEvents(eventId);

  const eventsBySeverity = {
    critical: correlatedEvents.filter((e) => getSeverity(e) === "critical"),
    warning: correlatedEvents.filter((e) => getSeverity(e) === "warning"),
    info: correlatedEvents.filter((e) => getSeverity(e) === "info"),
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild className="hover:bg-muted">
          <Link href={`/app/dashboard/events/${eventId}`} aria-label="Back to event">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight">Correlated Events</h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Events related to this incident across all services
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge className="bg-severity-high text-white"><span className="tabular-nums">{eventsBySeverity.critical.length}</span> Critical</Badge>
          <Badge className="bg-severity-medium text-foreground"><span className="tabular-nums">{eventsBySeverity.warning.length}</span> Warning</Badge>
          <Badge className="bg-muted text-muted-foreground"><span className="tabular-nums">{eventsBySeverity.info.length}</span> Info</Badge>
        </div>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 border-muted-200 dark:border-muted-800 shadow-sm">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="size-4" />
            <span className="tabular-nums">{correlatedEvents.length}</span> Related Events
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0">
          <ScrollArea className="h-full">
            {correlatedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="size-16 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <AlertTriangle className="size-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-balance text-lg font-semibold mb-2">No correlated events</h3>
                <p className="text-pretty text-muted-foreground text-sm max-w-md">
                  No related events were found for this incident.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {eventsBySeverity.critical.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-balance text-sm font-semibold text-severity-high flex items-center gap-2">
                      <Zap className="size-3.5" />
                      Critical (<span className="tabular-nums">{eventsBySeverity.critical.length}</span>)
                    </h3>
                    {eventsBySeverity.critical.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}

                {eventsBySeverity.warning.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-balance text-sm font-semibold text-severity-medium flex items-center gap-2">
                      <Waves className="size-3.5" />
                      Warning (<span className="tabular-nums">{eventsBySeverity.warning.length}</span>)
                    </h3>
                    {eventsBySeverity.warning.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}

                {eventsBySeverity.info.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-balance text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <Activity className="size-3.5" />
                      Info (<span className="tabular-nums">{eventsBySeverity.info.length}</span>)
                    </h3>
                    {eventsBySeverity.info.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const severity = getSeverity(event);
  const cfg = severityConfig[severity];
  const Icon = cfg.icon;

  return (
    <Link
      href={`/app/dashboard/events/${event.id}`}
      className="block p-4 bg-muted/30 rounded-xl border hover:bg-muted/50 transition-colors transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${cfg.bg} ${cfg.color}`}>
              <Icon className="size-3" />
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cfg.badge}`}>
              {cfg.label}
            </span>
            {event.service && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Server className="size-3" />
                <span className="font-medium">{event.service.name}</span>
                <span className="text-xs">({event.service.env})</span>
              </div>
            )}
          </div>
          {event.errorMessage && (
            <p className="text-sm line-clamp-2 mb-2">{event.errorMessage}</p>
          )}
          {event.stackTrace && !event.errorMessage && (
            <code className="text-xs bg-muted px-2 py-1 rounded block line-clamp-1">
              {event.stackTrace.split("\n")[0]}
            </code>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground flex-shrink-0">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : "N/A"}
          </div>
          {event.timestamp && (
            <div>{new Date(event.timestamp).toLocaleDateString()}</div>
          )}
        </div>
      </div>
      {event.requestId && (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
          {event.requestId.slice(0, 16)}...
        </code>
      )}
    </Link>
  );
}
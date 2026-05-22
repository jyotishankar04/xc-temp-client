"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEventById, useCorrelatedEvents } from "@/lib/hooks";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  Clock,
  Server,
  Code2,
  Fingerprint,
  Activity,
  Zap,
  Waves,
  Hash,
  Link2,
} from "lucide-react";
import type { Event } from "@/lib/types/event";
import { Label } from "@/components/ui/label";
import { StackTraceViewer } from "@/components/ui/stack-trace-viewer";
import { JsonViewer } from "@/components/ui/json-viewer";

const severityConfig = {
  critical: {
    color: "text-severity-high",
    bg: "bg-severity-high/10",
    border: "border-severity-high/30",
    badge: "bg-severity-high text-white",
    label: "Critical",
    icon: Zap
  },
  warning: {
    color: "text-severity-medium",
    bg: "bg-severity-medium/10",
    border: "border-severity-medium/30",
    badge: "bg-severity-medium text-foreground",
    label: "Warning",
    icon: Waves
  },
  info: {
    color: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
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

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId as string;

  const { data: event, isLoading, error } = useEventById(eventId);
  const { data: correlatedEvents = [] } = useCorrelatedEvents(eventId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="size-10 animate-spin text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/app/dashboard/events">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Event Not Found</h1>
            <p className="text-muted-foreground text-sm">
              This event may have been deleted or does not exist.
            </p>
          </div>
        </div>
        <Card className="border-severity-high/30">
          <CardContent className="pt-6">
            <p className="text-destructive">Unable to load event details. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const severity = getSeverity(event);
  const cfg = severityConfig[severity];
  const SeverityIcon = cfg.icon;
  const linkedCaseId = event.caseId ?? event.failureCaseId ?? event.case?.id ?? event.failureCase?.id;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild className="hover:bg-muted">
            <Link href="/app/dashboard/events">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${cfg.bg} ${cfg.color}`}>
                <SeverityIcon className="size-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Event Details</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {event.timestamp ? new Date(event.timestamp).toLocaleDateString() : "N/A"}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : "N/A"}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.badge}`}>
                <SeverityIcon className="size-3" />
                {cfg.label}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {linkedCaseId && (
            <Link href={`/app/dashboard/failures/${linkedCaseId}`}>
              <Button variant="outline" size="sm">
                <Link2 className="size-4 mr-1.5" />
                View Case
              </Button>
            </Link>
          )}
          {event.service && (
            <Link href={`/app/dashboard/services/${event.service.id}/overview`}>
              <Button variant="outline" size="sm">
                <Server className="size-4 mr-1.5" />
                View Service
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-1 min-w-0">
          <Card className="h-full flex flex-col border-muted-200 dark:border-muted-800 shadow-sm">
            <CardHeader className="pb-4 border-b bg-muted/20">
              <CardTitle className="text-base flex items-center gap-2">
                Event Information
                <Badge variant="outline" className="ml-2 text-xs">
                  ID: {event.id.slice(0, 8)}...
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  {event.service && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Server className="size-3" />
                        Service
                      </Label>
                      <Link
                        href={`/app/dashboard/services/${event.service.id}/overview`}
                        className="inline-flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors border w-full"
                      >
                        <div className="p-2 bg-background rounded-lg border">
                          <Server className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-semibold">{event.service.name}</div>
                          <div className="text-xs text-muted-foreground">{event.service.env}</div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {linkedCaseId && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Link2 className="size-3" />
                        Failure Case
                      </Label>
                      <Link
                        href={`/app/dashboard/failures/${linkedCaseId}`}
                        className="inline-flex items-center justify-between gap-3 px-4 py-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors border w-full"
                      >
                        <div>
                          <div className="font-semibold">View linked failure case</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {linkedCaseId}
                          </div>
                        </div>
                        <Badge variant="outline">Case</Badge>
                      </Link>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    {event.requestId && (
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Hash className="size-3" />
                          Request ID
                        </Label>
                        <code className="block text-sm bg-muted/50 p-4 rounded-xl font-mono break-all border">
                          {event.requestId}
                        </code>
                      </div>
                    )}
                    {event.fingerprint && (
                      <div>
                        <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Fingerprint className="size-3" />
                          Fingerprint
                        </Label>
                        <code className="block text-xs bg-muted/50 p-4 rounded-xl font-mono break-all border">
                          {event.fingerprint}
                        </code>
                      </div>
                    )}
                  </div>

                  {event.errorMessage && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Error Message</Label>
                      <div className="rounded-xl border border-code-border bg-code-bg px-4 py-3">
                        <p className="text-sm font-mono leading-relaxed text-code-error-msg">
                          {event.errorMessage}
                        </p>
                      </div>
                    </div>
                  )}

                  {event.stackTrace && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Code2 className="size-3" />
                        Stack Trace
                      </Label>
                      <StackTraceViewer trace={event.stackTrace} maxLines={25} />
                    </div>
                  )}

                  {event.runtimeContext && (
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Runtime Context</Label>
                      <JsonViewer data={event.runtimeContext} />
                    </div>
                  )}

                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                      <Activity className="size-3" />
                      Timestamp
                    </Label>
                    <div className="bg-muted/50 border rounded-xl p-4">
                      <p className="text-sm font-mono">
                        {event.timestamp ? new Date(event.timestamp).toLocaleString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {correlatedEvents.length > 0 && (
          <div className="w-[380px] flex-shrink-0">
            <Card className="h-full flex flex-col border-muted-200 dark:border-muted-800 shadow-sm">
              <CardHeader className="pb-4 border-b bg-muted/20">
                <CardTitle className="text-base flex items-center gap-2">
                  <Link2 className="size-4" />
                  Correlated Events
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {correlatedEvents.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-3">
                    {correlatedEvents.map((evt) => {
                      const sev = getSeverity(evt);
                      const evtCfg = severityConfig[sev];
                      const EvtIcon = evtCfg.icon;
                      return (
                        <Link
                          key={evt.id}
                          href={`/app/dashboard/events/${evt.id}`}
                          className="block p-4 bg-muted/30 rounded-xl border hover:bg-muted/50 transition-all hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${evtCfg.bg} ${evtCfg.color}`}>
                                <EvtIcon className="size-3" />
                              </div>
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${evtCfg.badge}`}>
                                {evtCfg.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : "N/A"}
                            </div>
                          </div>
                          {evt.service && (
                            <div className="flex items-center gap-1.5 mb-2 text-sm">
                              <Server className="size-3" />
                              <span className="font-medium">{evt.service.name}</span>
                              <span className="text-xs text-muted-foreground">({evt.service.env})</span>
                            </div>
                          )}
                          <p className="text-sm line-clamp-2">{evt.errorMessage || "No error message"}</p>
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

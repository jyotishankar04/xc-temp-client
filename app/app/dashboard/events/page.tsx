"use client";

import { Suspense, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents, useServices, useEventById, useCorrelatedEvents } from "@/lib/hooks";
import type { Event } from "@/lib/types/event";
import {
  ChevronDown,
  Clock,
  Code2,
  Loader2,
  Search,
  Server,
  ExternalLink,
  AlertTriangle,
  Zap,
  Waves,
  Activity,
  X,
  Hash,
  Fingerprint,
} from "lucide-react";
import { StackTraceViewer } from "@/components/ui/stack-trace-viewer";

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

function EventsPageContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const [serviceId, setServiceId] = useState(searchParams.get("service") || undefined);
  const [from, setFrom] = useState(searchParams.get("from") || undefined);
  const [to, setTo] = useState(searchParams.get("to") || undefined);
  const [search, setSearch] = useState(searchParams.get("q") || undefined);

  const { data: events = [], isLoading } = useEvents({ serviceId, from, to, search });
  const { data: services = [] } = useServices();
  const { data: expandedEvent } = useEventById(expandedEventId || "");
  const { data: correlatedEvents = [] } = useCorrelatedEvents(expandedEventId || "");

  const [localSearch, setLocalSearch] = useState(search || "");

  const updateFilters = (key: string, value: string | undefined) => {
    const nextFilters = {
      service: key === "service" ? value : serviceId,
      from: key === "from" ? value : from,
      to: key === "to" ? value : to,
      q: key === "q" ? value : search,
    };
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue) params.set(filterKey, filterValue);
    });
    const query = params.toString();
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);

    if (key === "service") setServiceId(value);
    if (key === "from") setFrom(value);
    if (key === "to") setTo(value);
    if (key === "q") setSearch(value);
  };

  const clearFilters = () => {
    window.history.replaceState(null, "", pathname);
    setServiceId(undefined);
    setFrom(undefined);
    setTo(undefined);
    setSearch(undefined);
    setLocalSearch("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("q", localSearch || undefined);
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const hasActiveFilters = serviceId || from || to || search;

  const criticalCount = events.filter(e => getSeverity(e) === "critical").length;
  const warningCount = events.filter(e => getSeverity(e) === "warning").length;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor and investigate system events across all services
          </p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-severity-high/10 border border-severity-high/30 rounded-full">
              <Zap className="size-3.5 text-severity-high" />
              <span className="text-sm font-semibold text-severity-high">{criticalCount}</span>
              <span className="text-xs text-severity-high/70">critical</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-severity-medium/10 border border-severity-medium/30 rounded-full">
              <AlertTriangle className="size-3.5 text-severity-medium" />
              <span className="text-sm font-semibold text-severity-medium">{warningCount}</span>
              <span className="text-xs text-severity-medium/70">warning</span>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <form onSubmit={handleSearch} className="flex-1 min-w-48">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-9"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
              </div>
            </form>
            <div className="w-40">
              <Label className="text-xs text-muted-foreground">Service</Label>
              <Select value={serviceId || "all"} onValueChange={(v) => updateFilters("service", v === "all" ? undefined : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label className="text-xs text-muted-foreground">From</Label>
              <DatePicker date={from ? new Date(from) : undefined} onDateChange={(d) => updateFilters("from", d?.toISOString())} />
            </div>
            <div className="w-40">
              <Label className="text-xs text-muted-foreground">To</Label>
              <DatePicker date={to ? new Date(to) : undefined} onDateChange={(d) => updateFilters("to", d?.toISOString())} />
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="size-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Activity className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground text-sm">
                {hasActiveFilters ? "No events match your current filters." : "No events recorded yet."}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="divide-y">
                {events.map((event) => {
                  const cfg = severityConfig[getSeverity(event)];
                  const isExpanded = expandedEventId === event.id;
                  return (
                    <div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleEvent(event.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`p-2 rounded-lg ${cfg.bg}`}>
                            <cfg.icon className={`size-4 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.badge}`}>
                                {cfg.label}
                              </span>
                              {event.service && (
                                <Link
                                  href={`/app/dashboard/services/${event.service.id}/overview`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/50 px-2 py-0.5 rounded"
                                >
                                  <Server className="size-3" />
                                  {event.service.name}
                                </Link>
                              )}
                            </div>
                            {event.errorMessage ? (
                              <p className="text-sm font-medium mb-3 line-clamp-2">
                                {event.errorMessage}
                              </p>
                            ) : (
                              <p className="text-sm font-medium mb-3 text-muted-foreground line-clamp-2">
                                {event.message || "No message"}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {event.timestamp ? format(new Date(event.timestamp), "MMM d, HH:mm:ss") : "N/A"}
                              </span>
                              {event.errorType && (
                                <span className="flex items-center gap-1">
                                  <Code2 className="size-3" />
                                  {event.errorType}
                                </span>
                              )}
                              {event.fingerprint && (
                                <span className="flex items-center gap-1">
                                  <Fingerprint className="size-3" />
                                  {event.fingerprint.slice(0, 8)}...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Link href={`/app/dashboard/events/${event.id}`}>
                              <ExternalLink className="size-4" />
                            </Link>
                          </Button>
                          <div className={`p-2 rounded-lg bg-muted/30 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                            <ChevronDown className="size-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                      {isExpanded && expandedEvent && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          {/* Meta row */}
                          <div className="flex flex-wrap gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                <Hash className="size-3" /> Event ID
                              </p>
                              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                {expandedEvent.id}
                              </code>
                            </div>
                            {expandedEvent.requestId && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Request ID</p>
                                <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                  {expandedEvent.requestId}
                                </code>
                              </div>
                            )}
                            {expandedEvent.fingerprint && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                  <Fingerprint className="size-3" /> Fingerprint
                                </p>
                                <code className="text-xs font-mono text-fingerprint bg-fingerprint/10 px-2 py-1 rounded">
                                  {expandedEvent.fingerprint.slice(0, 16)}…
                                </code>
                              </div>
                            )}
                            {expandedEvent.service && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                                  <Server className="size-3" /> Service
                                </p>
                                <Link
                                  href={`/app/dashboard/services/${expandedEvent.service.id}/overview`}
                                  className="text-xs font-medium hover:underline flex items-center gap-1"
                                >
                                  {expandedEvent.service.name}
                                  <span className="text-muted-foreground">({expandedEvent.service.env})</span>
                                </Link>
                              </div>
                            )}
                          </div>

                          {/* Colored error message */}
                          {expandedEvent.errorMessage && (
                            <div className="rounded-lg border border-code-border bg-code-bg px-4 py-3">
                              <p className="text-xs text-code-muted mb-1">Error</p>
                              <p className="text-sm font-mono text-code-error-msg leading-relaxed">
                                {expandedEvent.errorMessage}
                              </p>
                            </div>
                          )}

                          {/* Colored stack trace */}
                          {expandedEvent.stackTrace && (
                            <StackTraceViewer trace={expandedEvent.stackTrace} maxLines={15} />
                          )}

                          {/* Correlated events */}
                          {correlatedEvents.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Activity className="size-4" />
                                Correlated Events
                                <span className="text-xs font-normal text-muted-foreground">
                                  ({correlatedEvents.length})
                                </span>
                              </h4>
                              <div className="space-y-1.5">
                                {correlatedEvents.slice(0, 5).map((evt) => {
                                  const evtCfg = severityConfig[getSeverity(evt)];
                                  return (
                                    <Link
                                      key={evt.id}
                                      href={`/app/dashboard/events/${evt.id}`}
                                      className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg hover:bg-muted border border-transparent hover:border-border transition-colors"
                                    >
                                      <span className={`size-2 rounded-full shrink-0 ${evtCfg.badge.split(" ")[0]}`} />
                                      <span className="truncate text-muted-foreground">
                                        {evt.errorMessage || evt.message || evt.id}
                                      </span>
                                      <span className="shrink-0 text-xs text-muted-foreground/60 ml-auto">
                                        {evt.timestamp ? format(new Date(evt.timestamp), "HH:mm:ss") : ""}
                                      </span>
                                    </Link>
                                  );
                                })}
                                {correlatedEvents.length > 5 && (
                                  <Link
                                    href={`/app/dashboard/events/${expandedEventId}/correlation`}
                                    className="text-xs text-primary hover:underline pl-3"
                                  >
                                    View all {correlatedEvents.length} correlated events →
                                  </Link>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Open full detail link */}
                          <div className="pt-1">
                            <Link
                              href={`/app/dashboard/events/${event.id}`}
                              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                            >
                              <ExternalLink className="size-3" />
                              Open full event view
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EventsPageContent />
    </Suspense>
  );
}

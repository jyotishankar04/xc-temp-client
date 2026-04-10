"use client";

import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";
import type { Event, EventsFilter, EventsResponse } from "@/lib/types/event";

export function useEvents(filters?: EventsFilter) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const res = await eventsApi.getEvents(filters);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch events");
      }
      return res.data?.events ?? [];
    },
  });
}

export function useEventById(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId],
    queryFn: async () => {
      const res = await eventsApi.getById(eventId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch event");
      }
      return res.data;
    },
    enabled: !!eventId,
  });
}

export function useCorrelatedEvents(eventId: string) {
  return useQuery({
    queryKey: ["events", eventId, "correlation"],
    queryFn: async () => {
      const res = await eventsApi.getCorrelatedEvents(eventId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch correlated events");
      }
      if (!res.data || !Array.isArray(res.data)) {
        return [];
      }
      return res.data;
    },
    enabled: !!eventId,
  });
}

import { apiClient, type ApiResponse } from "../client";
import type { Event, EventsFilter, EventsResponse } from "@/lib/types/event";

export const eventsApi = {
  getEvents: async (params?: EventsFilter): Promise<ApiResponse<EventsResponse>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      if (params.serviceId) searchParams.set("serviceId", params.serviceId);
      if (params.from) searchParams.set("from", params.from);
      if (params.to) searchParams.set("to", params.to);
      if (params.search) searchParams.set("search", params.search);
      if (params.page) searchParams.set("page", params.page.toString());
      if (params.limit) searchParams.set("limit", params.limit.toString());
    }
    const query = searchParams.toString();
    const response = await apiClient.get<ApiResponse<EventsResponse>>(
      `/api/v1/events${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  getById: async (eventId: string): Promise<ApiResponse<Event>> => {
    const response = await apiClient.get<ApiResponse<Event>>(
      `/api/v1/events/${eventId}`
    );
    return response.data;
  },

  getCorrelatedEvents: async (eventId: string): Promise<ApiResponse<Event[]>> => {
    const response = await apiClient.get<ApiResponse<Event[]>>(
      `/api/v1/events/${eventId}/correlation`
    );
    return response.data;
  },
};

export interface Event {
  id: string;
  serviceId: string;
  timestamp: string;
  errorMessage?: string;
  message?: string;
  errorType?: string;
  stackTrace?: string;
  runtimeContext?: string;
  requestId?: string;
  fingerprint?: string;
  createdAt?: string;
  service?: {
    id: string;
    name: string;
    env: string;
  };
  _count?: {
    mappings: number;
  };
}

export interface EventPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventsResponse {
  events: Event[];
  pagination: EventPagination;
}

export interface EventsFilter {
  serviceId?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

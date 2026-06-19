import { apiClient, type ApiResponse } from "../client";

export interface DashboardStats {
  totalIncidents?: number;
  activeIncidents?: number;
  resolvedIncidents?: number;
  openCases?: number;
  pendingActions?: number;
  uptime?: number;
  services?: number;
  teamMembers?: number;
  healthScore?: number;
}

export interface DashboardSearchResults {
  query: string;
  services: Array<{
    id: string;
    name: string;
    env: string;
    status: string;
    description?: string | null;
    href: string;
  }>;
  failureCases: Array<{
    id: string;
    severity: string;
    status: string;
    fingerprint: string;
    service: {
      id: string;
      name: string;
      env: string;
    };
    href: string;
  }>;
  failureEvents: Array<{
    id: string;
    errorMessage: string;
    fingerprint: string;
    timestamp: string;
    service: {
      id: string;
      name: string;
      env: string;
    };
    href: string;
  }>;
}

interface RawApiResponse {
  success: boolean;
  message?: string;
  data?: {
    overview?: {
      totalCases: number;
      openCases: number;
      resolvedCases: number;
      totalServices: number;
      totalEvents: number;
      activeRollbacks: number;
    };
    changes?: {
      newCasesThisPeriod: number;
      resolvedThisPeriod: number;
      casesTrendPercent: number;
      eventsTrendPercent: number;
    };
    severityBreakdown?: {
      low: number;
      medium: number;
      high: number;
    };
    trends?: {
      cases: Array<{ date: string; count: number }>;
      events: Array<{ date: string; count: number }>;
    };
    topServices?: Array<{
      id: string;
      name: string;
      env: string;
      caseCount: number;
      eventCount: number;
    }>;
    recentActivity?: Array<unknown>;
    recentEvents?: Array<unknown>;
    rollbackStats?: {
      total: number;
      completed: number;
      failed: number;
    };
    rcaStats?: {
      total: number;
      avgConfidence: number;
    };
  };
}

interface RawSearchResponse {
  success: boolean;
  message?: string;
  data?: DashboardSearchResults;
}

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get<RawApiResponse>("/api/v1/dashboard/stats");
    const res = response.data;
    if (res?.success && res?.data?.overview) {
      const { overview, rollbackStats, rcaStats } = res.data;
      return {
        success: true,
        message: "Stats fetched successfully",
        data: {
          activeIncidents: overview.openCases,
          openCases: overview.totalCases,
          resolvedIncidents: overview.resolvedCases,
          pendingActions: rollbackStats?.total ?? 0,
          services: overview.totalServices,
          uptime:
            overview.totalServices > 0
              ? Math.max(0, 100 - Math.round((overview.openCases / overview.totalServices) * 10))
              : 100,
          healthScore:
            overview.totalServices > 0
              ? Math.max(
                  0,
                  100 -
                    Math.round(
                      ((overview.openCases + overview.activeRollbacks) /
                        overview.totalServices) *
                        10,
                    ),
                )
              : 100,
          teamMembers: rcaStats?.total ?? 0,
        },
      };
    }
    return { success: false, message: "Failed to fetch dashboard stats", data: undefined };
  },

  search: async (query: string): Promise<ApiResponse<DashboardSearchResults>> => {
    const response = await apiClient.get<RawSearchResponse>("/api/v1/dashboard/search", {
      params: { q: query },
    });
    const res = response.data;
    if (res?.success && res?.data) {
      return {
        success: true,
        message: "Search results fetched successfully",
        data: res.data,
      };
    }
    return { success: false, message: "Failed to fetch search results", data: undefined };
  },
};

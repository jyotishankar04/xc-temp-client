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

interface RawApiResponse {
  success: boolean;
  message?: string;
  data?: DashboardStats;
}

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get<RawApiResponse>("/api/v1/dashboard/stats");
    const res = response.data;
    if (res?.success && res?.data) {
      return {
        success: true,
        message: "Stats fetched successfully",
        data: res.data,
      };
    }
    return { success: false, message: "Failed to fetch dashboard stats", data: undefined };
  },
};

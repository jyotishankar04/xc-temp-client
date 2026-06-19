import { apiClient, type ApiResponse } from "../client";

export interface NotificationItem {
  id: string;
  type: "CASE" | "RCA" | "ROLLBACK" | "AUDIT";
  title: string;
  description: string;
  href: string;
  createdAt: string;
  read: boolean;
}

interface RawNotificationsResponse {
  success: boolean;
  message?: string;
  data?: NotificationItem[];
}

export const notificationsApi = {
  list: async (limit = 10): Promise<ApiResponse<NotificationItem[]>> => {
    const response = await apiClient.get<RawNotificationsResponse>("/api/v1/notifications", {
      params: { limit },
    });
    const res = response.data;
    if (res?.success && res?.data) {
      return {
        success: true,
        message: "Notifications fetched successfully",
        data: res.data,
      };
    }
    return { success: false, message: "Failed to fetch notifications", data: undefined };
  },
};

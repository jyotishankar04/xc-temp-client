import { apiClient, type ApiResponse } from "../client";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  description: string;
  href: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationReadResponse {
  id: string;
  read: boolean;
  readAt: string | null;
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
  markRead: async (notificationId: string): Promise<ApiResponse<NotificationReadResponse>> => {
    const response = await apiClient.patch<{ success: boolean; message?: string; data?: NotificationReadResponse }>(
      `/api/v1/notifications/${notificationId}/read`,
    );
    const res = response.data;
    if (res?.success && res?.data) {
      return {
        success: true,
        message: res.message ?? "Notification marked as read",
        data: res.data,
      };
    }
    return { success: false, message: res?.message ?? "Failed to mark notification read", data: undefined };
  },
};

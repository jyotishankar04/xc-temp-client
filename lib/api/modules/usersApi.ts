import { apiClient, type ApiResponse, type UserResponse } from "../client";

export interface UserSettings {
  theme?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  language?: string;
  timezone?: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatarUrl?: string;
}

export const usersApi = {
  getMe: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.get<ApiResponse<UserResponse>>(
      "/api/v1/users/me"
    );
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileInput
  ): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.patch<ApiResponse<UserResponse>>(
      "/api/v1/users/me",
      data
    );
    return response.data;
  },

  getSettings: async (): Promise<ApiResponse<UserSettings>> => {
    const response = await apiClient.get<ApiResponse<UserSettings>>(
      "/api/v1/users/me/settings"
    );
    return response.data;
  },

  updateSettings: async (
    data: Partial<UserSettings>
  ): Promise<ApiResponse<UserSettings>> => {
    const response = await apiClient.patch<ApiResponse<UserSettings>>(
      "/api/v1/users/me/settings",
      data
    );
    return response.data;
  },
};

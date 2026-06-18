import { apiClient, handleApiError, type UserResponse, type ApiResponse } from "./client";
import { appConfig } from "@/lib/config/app";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  username?: string;
  avatar?: string;
  avatarUrl?: string;
}

export interface OnboardingData {
  orgName: string;
  orgSlug: string;
  teamSize?: string;
  role: string;
  notes?: string;
}

export interface OnboardingResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  user: User;
}

export interface AuthCheckResponse {
  authenticated: boolean;
  user?: User;
  requirement?: string;
}

export interface AdminLoginResponse {
  masterAdmin: {
    id: string;
    email: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
  };
}

const AUTH_ENDPOINT = `${appConfig.apiUrl}/api/v1/auth`;
const ONBOARDING_ENDPOINT = "/api/v1/onboarding";
const USER_ENDPOINT = "/api/v1/users";

export const authApi = {
  loginWithGitHub: (redirectUrl?: string) => {
    const target = redirectUrl ?? window.location.origin;
    window.location.href = `${AUTH_ENDPOINT}/github?redirect_url=${encodeURIComponent(target)}`;
  },

  loginAdmin: async (data: {
    email: string;
    password: string;
  }): Promise<AdminLoginResponse> => {
    const response = await apiClient.post<ApiResponse<AdminLoginResponse>>(
      "/api/v1/auth/admin/login",
      data,
    );
    return response.data.data as AdminLoginResponse;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/api/v1/auth/logout");
  },

  logoutAdmin: async (): Promise<void> => {
    await apiClient.post("/api/v1/auth/admin/logout");
  },

  onboard: async (data: OnboardingData): Promise<OnboardingResponse> => {
    const response = await apiClient.post<ApiResponse<OnboardingResponse>>(
      `${ONBOARDING_ENDPOINT}/onboard`,
      data
    );
    return response.data.data as OnboardingResponse;
  },

  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.get<ApiResponse<UserResponse>>(`${USER_ENDPOINT}/me`);
    return response.data;
  },

  checkAuth: async (): Promise<AuthCheckResponse> => {
    const response = await apiClient.get<ApiResponse<UserResponse>>(`${USER_ENDPOINT}/me`);
    const res = response.data;

    if (res.success && res.requirement === "/onboard") {
      return {
        authenticated: true,
        user: res.data as User,
        requirement: res.requirement,
      };
    }

    return {
      authenticated: true,
      user: res.data as User,
    };
  },
};

export { handleApiError };

import { apiClient, handleApiError } from "./client";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
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

const AUTH_ENDPOINT = "/api/v1/auth";
const ORGS_ENDPOINT = "/api/v1/orgs";
const USER_ENDPOINT = "/api/v1/users";
export const authApi = {
  loginWithGitHub: () => {
    window.location.href = `${AUTH_ENDPOINT}/github?redirect_url=${window.location.origin}`;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(`${AUTH_ENDPOINT}/logout`);
  },

  onboard: async (data: OnboardingData): Promise<OnboardingResponse> => {
    const response = await apiClient.post<OnboardingResponse>(
      `${ORGS_ENDPOINT}/onboard`,
      data
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get(`${USER_ENDPOINT}/me`);
    return response.data;
  },

  checkAuth: async (): Promise<{ authenticated: boolean; user?: User }> => {
    const response = await apiClient.get(`${USER_ENDPOINT}/me`);
    return { authenticated: true, user: response.data };
  },
};

export { handleApiError };

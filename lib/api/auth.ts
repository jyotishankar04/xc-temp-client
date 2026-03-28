import { apiClient } from "./client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>("/api/auth/login", credentials),

  register: (data: RegisterData) =>
    apiClient.post<AuthResponse>("/api/auth/register", data),

  logout: () => apiClient.post<{ success: boolean }>("/api/auth/logout"),

  verifyEmail: (token: string) =>
    apiClient.get<{ verified: boolean }>(`/api/auth/verify/${token}`),

  requestPasswordReset: (email: string) =>
    apiClient.post<{ success: boolean }>("/api/auth/password-reset", { email }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<{ success: boolean }>("/api/auth/password-reset/confirm", {
      token,
      newPassword,
    }),
};

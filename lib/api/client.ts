import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { appConfig } from "@/lib/config/app";

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface UserResponse {
  id: string;
  name?: string;
  username?: string;
  email: string;
  avatarUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  requirement?: string;
}

const API_URL = appConfig.apiUrl;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;
let adminRefreshPromise: Promise<void> | null = null;

const CLIENT_PROTECTED_PREFIXES = ["/app", "/onboard"];

function isProtectedClientPath(pathname: string) {
  return CLIENT_PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isProtectedAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export class OnboardingRequiredError extends Error {
  constructor(public requirement: string) {
    super("Onboarding required");
    this.name = "OnboardingRequiredError";
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const isAdminRequest = originalRequest.url?.startsWith("/api/v1/admin");

      try {
        if (isAdminRequest) {
          adminRefreshPromise ??= axios
            .post(`${API_URL}/api/v1/auth/admin/refresh`, {}, { withCredentials: true })
            .then(() => undefined)
            .finally(() => {
              adminRefreshPromise = null;
            });

          await adminRefreshPromise;
        } else {
          refreshPromise ??= axios
            .post(`${API_URL}/api/v1/auth/refresh`, {}, { withCredentials: true })
            .then(() => undefined)
            .finally(() => {
              refreshPromise = null;
            });

          await refreshPromise;
        }
        return axiosInstance(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;

          if (isAdminRequest && isProtectedAdminPath(pathname) && pathname !== "/admin/login") {
            window.location.href = "/admin/login";
          } else if (!isAdminRequest && isProtectedClientPath(pathname)) {
            window.location.href = "/auth/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = axiosInstance;

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    if (axiosError.response?.data?.error) {
      return axiosError.response.data.error;
    }
    if (axiosError.message) {
      return axiosError.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

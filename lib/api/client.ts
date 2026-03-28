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

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  code?: string;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
}

const DEFAULT_TIMEOUT = 10000;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorData = data as { error?: string; code?: string } | null;
      throw new ApiError(
        errorData?.error || `Request failed with status ${response.status}`,
        response.status,
        errorData?.code
      );
    }

    return data as T;
  }

  async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const url = endpoint.startsWith("http")
        ? endpoint
        : `${this.baseUrl}${endpoint}`;

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", 408);
        }
        throw new ApiError(error.message, 0);
      }

      throw new ApiError("Unknown error", 0);
    }
  }

  async get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
export { ApiClient };

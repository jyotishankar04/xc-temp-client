const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, message: data.message || "An error occurred" };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Network error" 
    };
  }
}

export const api = {
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body?: unknown) => 
    fetchApi<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: unknown) => 
    fetchApi<T>(endpoint, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: "DELETE" }),
};

export const authApi = {
  getGithubAuthUrl: () => `${API_BASE_URL}/auth/github`,
  refreshToken: () => api.post<{ accessToken: string }>("/auth/refresh"),
};

export const onboardingApi = {
  createOrg: (data: { orgName: string; serviceName: string }) => 
    api.post("/onboarding/create-org", data),
  getStatus: () => api.get<{ needsOnboarding: boolean; orgId?: string }>("/onboarding/status"),
};

export const servicesApi = {
  list: () => api.get("/services"),
  create: (data: { name: string; env: string }) => api.post("/services", data),
  get: (id: string) => api.get(`/services/${id}`),
  update: (id: string, data: { name?: string; env?: string }) => api.patch(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
  getApiKeys: (serviceId: string) => api.get(`/services/${serviceId}/apikeys`),
  createApiKey: (serviceId: string, data: { name: string; expiresAt?: string }) => 
    api.post(`/services/${serviceId}/apikeys`, data),
  deleteApiKey: (serviceId: string, apiKeyId: string) => 
    api.delete(`/services/${serviceId}/apikeys/${apiKeyId}`),
  getRollbackConfig: (serviceId: string) => api.get(`/services/${serviceId}/rollback-config`),
  updateRollbackConfig: (serviceId: string, data: { autoRollbackEnabled?: boolean; autoRollbackThreshold?: number }) => 
    api.patch(`/services/${serviceId}/rollback-config`, data),
  getRollbackHistory: (serviceId: string) => api.get(`/services/${serviceId}/rollback-history`),
  triggerRollback: (serviceId: string, data: { caseId: string }) => 
    api.post(`/services/${serviceId}/trigger-rollback`, data),
};

export const casesApi = {
  list: (params?: { serviceId?: string; status?: string; severity?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return api.get(`/cases${query ? `?${query}` : ""}`);
  },
  get: (id: string) => api.get(`/cases/${id}`),
  update: (id: string, data: { status?: string }) => api.patch(`/cases/${id}`, data),
};

export const rcaApi = {
  list: (params?: { caseId?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return api.get(`/rca${query ? `?${query}` : ""}`);
  },
  get: (id: string) => api.get(`/rca/${id}`),
  generate: (caseId: string) => api.post(`/rca/${caseId}/generate`),
};

export const orgApi = {
  getCurrent: () => api.get("/orgs/current"),
  update: (data: { name?: string }) => api.patch("/orgs/current", data),
  getMembers: () => api.get("/orgs/current/members"),
  inviteMember: (data: { email: string; role: string }) => api.post("/orgs/current/invitations", data),
};

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),
};
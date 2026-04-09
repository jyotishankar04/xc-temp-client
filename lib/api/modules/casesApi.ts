import { apiClient, type ApiResponse } from "../client";

export interface CaseService {
  id: string;
  name: string;
}

export interface Case {
  id: string;
  fingerprint: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "RESOLVED" | "MERGED";
  environment?: string;
  service: CaseService;
  createdAt: string;
  updatedAt: string;
  _count?: {
    events: number;
    possibleCauses: number;
    followUps: number;
  };
}

export interface CaseListResponse {
  cases: Case[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateCaseInput {
  status?: "OPEN" | "RESOLVED" | "MERGED";
  severity?: "HIGH" | "MEDIUM" | "LOW";
}

interface RawApiResponse {
  success: boolean;
  message?: string;
  data?: CaseListResponse | Case;
}

export const casesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    environment?: string;
    search?: string;
  }): Promise<ApiResponse<Case[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status) searchParams.set("status", params.status);
    if (params?.severity) searchParams.set("severity", params.severity);
    if (params?.environment) searchParams.set("environment", params.environment);
    if (params?.search) searchParams.set("search", params.search);

    const queryString = searchParams.toString();
    const url = queryString ? `/api/v1/cases?${queryString}` : "/api/v1/cases";
    
    const response = await apiClient.get<RawApiResponse>(url);
    const data = response.data;
    
    if (data?.success && data?.data && "cases" in data.data) {
      return {
        success: true,
        message: "Cases fetched successfully",
        data: data.data.cases,
      };
    }
    return { success: false, message: "Failed to fetch cases", data: [] };
  },

  getById: async (caseId: string): Promise<ApiResponse<Case>> => {
    const response = await apiClient.get<RawApiResponse>(`/api/v1/cases/${caseId}`);
    const data = response.data;
    
    if (data?.success && data?.data && "id" in data.data) {
      return {
        success: true,
        message: "Case fetched successfully",
        data: data.data as Case,
      };
    }
    return { success: false, message: "Failed to fetch case", data: null as unknown as Case };
  },

  update: async (caseId: string, data: UpdateCaseInput): Promise<ApiResponse<Case>> => {
    const response = await apiClient.patch<RawApiResponse>(`/api/v1/cases/${caseId}`, data);
    const res = response.data;
    
    if (res?.success && res?.data && "id" in res.data) {
      return {
        success: true,
        message: "Case updated successfully",
        data: res.data as Case,
      };
    }
    return { success: false, message: "Failed to update case", data: null as unknown as Case };
  },

  merge: async (caseId: string, targetCaseId: string): Promise<ApiResponse<Case>> => {
    const response = await apiClient.post<RawApiResponse>(`/api/v1/cases/${caseId}/merge`, {
      targetCaseId,
    });
    const res = response.data;
    
    if (res?.success && res?.data) {
      return {
        success: true,
        message: "Cases merged successfully",
        data: res.data as Case,
      };
    }
    return { success: false, message: "Failed to merge cases", data: null as unknown as Case };
  },
};
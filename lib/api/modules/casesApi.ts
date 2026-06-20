import { apiClient, type ApiResponse } from "../client";
import type { Event } from "@/lib/types/event";
import type { RCAReport } from "./rcaApi";

export interface CaseService {
  id: string;
  name: string;
}

export interface Case {
  id: string;
  fingerprint: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  status: "OPEN" | "INVESTIGATING" | "ROLLED_BACK" | "IGNORED" | "RESOLVED";
  environment?: string;
  service: CaseService;
  createdAt: string;
  updatedAt: string;
  firstSeenAt?: string;
  lastSeenAt?: string;
  occurrenceCount?: number;
  _count?: {
    events: number;
    possibleCauses: number;
    followUps: number;
  };
  events?: Event[];
  rcaReports?: RCAReport[];
  rcaReport?: RCAReport;
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
  status?: "OPEN" | "INVESTIGATING" | "ROLLED_BACK" | "IGNORED" | "RESOLVED" | "MERGED";
  severity?: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
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
  }): Promise<ApiResponse<CaseListResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.status && params.status !== "all") searchParams.set("status", params.status);
    if (params?.severity && params.severity !== "all") searchParams.set("severity", params.severity);
    // search and environment are not supported by the backend schema — omitted

    const queryString = searchParams.toString();
    const url = queryString ? `/api/v1/cases?${queryString}` : "/api/v1/cases";

    const response = await apiClient.get<RawApiResponse>(url);
    const data = response.data;

    if (data?.success && data?.data && "cases" in data.data) {
      type RawCase = Omit<Case, "_count"> & { _count?: { eventMappings?: number } };
      type RawList = { cases: RawCase[]; pagination: CaseListResponse["pagination"] };
      const raw = data.data as RawList;
      return {
        success: true,
        message: "Cases fetched successfully",
        data: {
          pagination: raw.pagination,
          cases: raw.cases.map((c) => ({
            ...c,
            _count: c._count
              ? { events: c._count.eventMappings ?? 0, possibleCauses: 0, followUps: 0 }
              : undefined,
          })) as Case[],
        },
      };
    }
    return {
      success: false,
      message: "Failed to fetch cases",
      data: {
        cases: [],
        pagination: { page: 1, limit: params?.limit ?? 20, total: 0, totalPages: 0 },
      },
    };
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

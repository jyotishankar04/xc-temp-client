import { apiClient, type ApiResponse } from "../client";

export interface Action {
  id: string;
  caseId: string;
  recommendationId: string;
  approvedBy: string;
  actionType: "ROLLBACK" | "WAIT" | "SCALE" | "MANUAL";
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED" | "FAILED";
  createdAt: string;
  executedAt: string | null;
  case: {
    id: string;
    service: {
      id: string;
      name: string;
    };
    severity: "LOW" | "MEDIUM" | "HIGH";
  };
  recommendation: {
    id: string;
    action: "ROLLBACK" | "WAIT" | "SCALE" | "MANUAL";
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    rationale: string;
  };
  approver: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface ListActionsParams {
  serviceId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED" | "FAILED";
  page?: number;
  limit?: number;
}

export interface ActionsResponse {
  actions: Action[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const actionsApi = {
  getAll: async (params?: ListActionsParams): Promise<ApiResponse<ActionsResponse>> => {
    const response = await apiClient.get<ApiResponse<ActionsResponse>>(
      "/api/v1/actions",
      { params }
    );
    return response.data;
  },

  getById: async (actionId: string): Promise<ApiResponse<Action>> => {
    const response = await apiClient.get<ApiResponse<Action>>(
      `/api/v1/actions/${actionId}`
    );
    return response.data;
  },

  approve: async (actionId: string): Promise<ApiResponse<Action>> => {
    const response = await apiClient.post<ApiResponse<Action>>(
      `/api/v1/actions/${actionId}/approve`
    );
    return response.data;
  },

  reject: async (actionId: string): Promise<ApiResponse<Action>> => {
    const response = await apiClient.post<ApiResponse<Action>>(
      `/api/v1/actions/${actionId}/reject`
    );
    return response.data;
  },
};

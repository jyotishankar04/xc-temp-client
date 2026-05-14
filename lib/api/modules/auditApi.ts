import { apiClient, type ApiResponse } from "../client";

export interface AuditLog {
  id: string;
  actor: string;
  actorType: "user" | "ai" | "system";
  action: string;
  target: string;
  targetType: string;
  details?: string;
  timestamp: string;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListAuditLogsParams {
  actorType?: "USER" | "SYSTEM" | "AI";
  action?: string;
  targetType?: string;
  page?: number;
  limit?: number;
}

export const auditApi = {
  getAuditLogs: async (params?: ListAuditLogsParams): Promise<ApiResponse<AuditLogsResponse>> => {
    const response = await apiClient.get<ApiResponse<AuditLogsResponse>>(
      "/api/v1/audit",
      { params }
    );
    return response.data;
  },
};

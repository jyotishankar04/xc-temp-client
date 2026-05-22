import { apiClient, type ApiResponse } from "../client";

export interface RollbackHistory {
  id: string;
  serviceId: string;
  caseId: string | null;
  triggeredAt: string;
  stableCommit: string;
  workflowUrl: string | null;
  status: "INITIATED" | "COMPLETED" | "FAILED";
  completedAt: string | null;
}

export interface RollbackConfig {
  autoRollbackEnabled: boolean;
  autoRollbackThreshold: number;
  rollbackWorkflow?: string | null;
  deploymentType?: string | null;
  lastStableCommit: string | null;
  hasRepoMapping: boolean;
  repoMapping?: {
    id: string;
    repoFull: string;
    branch: string;
  } | null;
}

export interface TriggerRollbackResponse {
  success: boolean;
  message?: string;
  data?: {
    rollbackId: string;
    stableCommit: string;
    workflowUrl: string;
  };
}

export const rollbackApi = {
  getConfig: async (serviceId: string): Promise<ApiResponse<RollbackConfig>> => {
    const response = await apiClient.get<ApiResponse<RollbackConfig>>(
      `/api/v1/services/${serviceId}/rollback/rollback-config`
    );
    return response.data;
  },

  updateConfig: async (
    serviceId: string,
    data: { autoRollbackEnabled?: boolean; autoRollbackThreshold?: number; rollbackWorkflow?: string | null }
  ): Promise<ApiResponse<{ autoRollbackEnabled: boolean; autoRollbackThreshold: number; rollbackWorkflow?: string | null }>> => {
    const response = await apiClient.patch<ApiResponse<{ autoRollbackEnabled: boolean; autoRollbackThreshold: number; rollbackWorkflow?: string | null }>>(
      `/api/v1/services/${serviceId}/rollback/rollback-config`,
      data
    );
    return response.data;
  },

  getHistory: async (serviceId: string, limit?: number): Promise<ApiResponse<RollbackHistory[]>> => {
    const response = await apiClient.get<ApiResponse<RollbackHistory[]>>(
      `/api/v1/services/${serviceId}/rollback/rollback-history`,
      { params: { limit } }
    );
    return response.data;
  },

  triggerRollback: async (
    serviceId: string,
    data: { caseId: string }
  ): Promise<ApiResponse<TriggerRollbackResponse>> => {
    const response = await apiClient.post<ApiResponse<TriggerRollbackResponse>>(
      `/api/v1/services/${serviceId}/rollback/trigger-rollback`,
      data
    );
    return response.data;
  },
};

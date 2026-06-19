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

export interface RollbackTemplate {
  key: string;
  name: string;
  deploymentTypes: string[];
  description: string;
  workflowPath: string;
  requiredSecrets: string[];
  recommendations: string[];
}

export type RollbackWorkflowMode = "TEMPLATE" | "CUSTOM";

export interface RollbackConfig {
  autoRollbackEnabled: boolean;
  autoRollbackThreshold: number;
  rollbackWorkflow?: string | null;
  rollbackWorkflowMode: RollbackWorkflowMode;
  rollbackTemplateKey?: string | null;
  rollbackCustomYaml?: string | null;
  deploymentType?: string | null;
  lastStableCommit: string | null;
  hasRepoMapping: boolean;
  repoMapping?: {
    id: string;
    repoId?: number | null;
    repoFull: string;
    branch: string;
  } | null;
  templates?: RollbackTemplate[];
}

export interface RollbackConfigUpdate {
  autoRollbackEnabled?: boolean;
  autoRollbackThreshold?: number;
  rollbackWorkflow?: string | null;
  rollbackWorkflowMode?: RollbackWorkflowMode;
  rollbackTemplateKey?: string | null;
  rollbackCustomYaml?: string | null;
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
    data: RollbackConfigUpdate
  ): Promise<ApiResponse<RollbackConfigUpdate>> => {
    const response = await apiClient.patch<ApiResponse<RollbackConfigUpdate>>(
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

  getTemplates: async (serviceId: string): Promise<ApiResponse<RollbackTemplate[]>> => {
    const response = await apiClient.get<ApiResponse<RollbackTemplate[]>>(
      `/api/v1/services/${serviceId}/rollback/rollback-templates`
    );
    return response.data;
  },
};

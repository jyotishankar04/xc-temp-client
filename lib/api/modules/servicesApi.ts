import { apiClient, type ApiResponse } from "../client";
import type {
  CreateApiKeyInput,
  CreateInvitationInput,
  CreateServiceInput,
  GitHubBranch,
  GitHubRepo,
  GitHubWorkflow,
  Service,
  ServiceInvitation,
  ServiceMember,
  UpdateMemberInput,
  UpdateServiceInput,
  ApiKey,
} from "@/lib/types/service";

export const servicesApi = {
  getAll: async (): Promise<ApiResponse<Service[]>> => {
    const response = await apiClient.get<ApiResponse<Service[]>>("/api/v1/services");
    return response.data;
  },

  getById: async (serviceId: string): Promise<ApiResponse<Service>> => {
    const response = await apiClient.get<ApiResponse<Service>>(
      `/api/v1/services/${serviceId}`
    );
    return response.data;
  },

  create: async (data: CreateServiceInput): Promise<ApiResponse<Service>> => {
    const response = await apiClient.post<ApiResponse<Service>>(
      "/api/v1/services",
      data
    );
    return response.data;
  },

  update: async (
    serviceId: string,
    data: UpdateServiceInput
  ): Promise<ApiResponse<Service>> => {
    const response = await apiClient.patch<ApiResponse<Service>>(
      `/api/v1/services/${serviceId}`,
      data
    );
    return response.data;
  },

  delete: async (serviceId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/services/${serviceId}`
    );
    return response.data;
  },

  getInvitations: async (
    serviceId: string
  ): Promise<ApiResponse<ServiceInvitation[]>> => {
    const response = await apiClient.get<ApiResponse<ServiceInvitation[]>>(
      `/api/v1/services/${serviceId}/invitations`
    );
    return response.data;
  },

  createInvitation: async (
    serviceId: string,
    data: CreateInvitationInput
  ): Promise<ApiResponse<ServiceInvitation>> => {
    const response = await apiClient.post<ApiResponse<ServiceInvitation>>(
      `/api/v1/services/${serviceId}/invitations`,
      data
    );
    return response.data;
  },

  acceptInvitation: async (
    serviceId: string,
    invitationId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/api/v1/services/${serviceId}/invitations/${invitationId}/accept`
    );
    return response.data;
  },

  rejectInvitation: async (
    serviceId: string,
    invitationId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/api/v1/services/${serviceId}/invitations/${invitationId}/reject`
    );
    return response.data;
  },

  cancelInvitation: async (
    serviceId: string,
    invitationId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/services/${serviceId}/invitations/${invitationId}`
    );
    return response.data;
  },

  getMembers: async (serviceId: string): Promise<ApiResponse<ServiceMember[]>> => {
    const response = await apiClient.get<ApiResponse<ServiceMember[]>>(
      `/api/v1/services/${serviceId}/members`
    );
    return response.data;
  },

  updateMember: async (
    serviceId: string,
    userId: string,
    data: UpdateMemberInput
  ): Promise<ApiResponse<ServiceMember>> => {
    const response = await apiClient.patch<ApiResponse<ServiceMember>>(
      `/api/v1/services/${serviceId}/members/${userId}`,
      data
    );
    return response.data;
  },

  removeMember: async (
    serviceId: string,
    userId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/services/${serviceId}/members/${userId}`
    );
    return response.data;
  },

  getApiKeys: async (serviceId: string): Promise<ApiResponse<ApiKey[]>> => {
    const response = await apiClient.get<ApiResponse<ApiKey[]>>(
      `/api/v1/services/${serviceId}/apikeys`
    );
    return response.data;
  },

  createApiKey: async (
    serviceId: string,
    data: CreateApiKeyInput
  ): Promise<ApiResponse<ApiKey>> => {
    const response = await apiClient.post<ApiResponse<ApiKey>>(
      `/api/v1/services/${serviceId}/apikeys`,
      data
    );
    return response.data;
  },

  deleteApiKey: async (
    serviceId: string,
    apiKeyId: string
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/services/${serviceId}/apikeys/${apiKeyId}`
    );
    return response.data;
  },

  getGitHubRepos: async (): Promise<ApiResponse<GitHubRepo[]>> => {
    const response = await apiClient.get<ApiResponse<GitHubRepo[]>>(
      "/api/v1/services/github/repos"
    );
    return response.data;
  },

  getGitHubBranches: async (repoId: number): Promise<ApiResponse<GitHubBranch[]>> => {
    const response = await apiClient.get<ApiResponse<GitHubBranch[]>>(
      `/api/v1/services/github/repos/${repoId}/branches`
    );
    return response.data;
  },

  getGitHubWorkflows: async (repoId: number): Promise<ApiResponse<GitHubWorkflow[]>> => {
    const response = await apiClient.get<ApiResponse<GitHubWorkflow[]>>(
      `/api/v1/services/github/repos/${repoId}/workflows`
    );
    return response.data;
  },
};

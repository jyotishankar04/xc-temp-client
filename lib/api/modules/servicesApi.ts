import { apiClient, type ApiResponse } from "../client";

export interface Service {
  id: string;
  name: string;
  env: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceInput {
  name: string;
  env: string;
}

export interface UpdateServiceInput {
  name?: string;
}

export interface ServiceInvitation {
  id: string;
  email: string;
  role: string;
  status?: string;
  serviceId?: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface CreateInvitationInput {
  email: string;
  role: string;
}

export interface ServiceMember {
  userId: string;
  email?: string;
  name?: string;
  role: string;
  avatarUrl?: string;
  status?: string;
  joinedAt?: string;
}

export interface UpdateMemberInput {
  role: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  prefix?: string;
  createdAt?: string;
}

export interface CreateApiKeyInput {
  name: string;
}

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
    const response = await apiClient.request<ApiResponse<void>>({
      url: `/api/v1/services/${serviceId}`,
      method: "DELETE",
      data: { name: "" },
    });
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
      `/api/v1/services/members/${serviceId}`
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
};

export interface GitHubRepo {
  id: number;
  fullName: string;
  name: string;
  private: boolean;
  htmlUrl: string;
  description: string | null;
  defaultBranch: string;
  language: string | null;
  updatedAt: string;
}

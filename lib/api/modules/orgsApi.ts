import { apiClient, type ApiResponse } from "../client";

export interface OrgMember {
  userId: string | null;
  email: string;
  name?: string;
  role: string;
  status: string;
  avatarUrl?: string;
  joinedAt?: string | null;
}

export interface OrgService {
  id: string;
  name: string;
  slug: string;
  status: string;
  lastPing?: string;
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  plan?: string;
  status?: string;
  teamSize?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    memberships?: number;
  };
  services?: OrgService[];
  members?: OrgMember[];
}

export interface CreateOrgInput {
  name: string;
  slug: string;
}

export interface UpdateOrgInput {
  name: string;
  slug: string;
}

export interface InviteInput {
  email: string;
  role: string;
}

export const orgsApi = {
  createOrg: async (data: CreateOrgInput): Promise<ApiResponse<Org>> => {
    const response = await apiClient.post<ApiResponse<Org>>(
      "/api/v1/orgs",
      data
    );
    return response.data;
  },

  getOrgs: async (): Promise<ApiResponse<Org[]>> => {
    const response = await apiClient.get<ApiResponse<Org[]>>("/api/v1/orgs");
    return response.data;
  },

  getCurrentOrg: async (): Promise<ApiResponse<Org>> => {
    const response = await apiClient.get<ApiResponse<Org>>(
      "/api/v1/orgs/current"
    );
    return response.data;
  },

  getOrgById: async (orgId: string): Promise<ApiResponse<Org>> => {
    const response = await apiClient.get<ApiResponse<Org>>(
      `/api/v1/orgs/${orgId}`
    );
    return response.data;
  },

  switchOrg: async (orgId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/api/v1/orgs/switch/${orgId}`
    );
    return response.data;
  },

  updateOrg: async (orgId: string, data: UpdateOrgInput): Promise<ApiResponse<Org>> => {
    const response = await apiClient.patch<ApiResponse<Org>>(
      `/api/v1/orgs/${orgId}`,
      data
    );
    return response.data;
  },

  getMembers: async (
    orgId?: string
  ): Promise<ApiResponse<OrgMember[]>> => {
    const url = orgId ? `/api/v1/orgs/members/${orgId}` : "/api/v1/orgs/members/";
    const response = await apiClient.get<ApiResponse<OrgMember[]>>(url);
    return response.data;
  },

  inviteMember: async (
    orgId: string,
    data: InviteInput
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/api/v1/orgs/${orgId}/invite`,
      data
    );
    return response.data;
  },
};

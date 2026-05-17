"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/lib/api";
import type {
  CreateServiceInput,
  UpdateServiceInput,
  CreateInvitationInput,
  UpdateMemberInput,
  CreateApiKeyInput,
} from "@/lib/types/service";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await servicesApi.getAll();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch services");
      }
      return res.data ?? [];
    },
  });
}

export function useServiceById(serviceId: string) {
  return useQuery({
    queryKey: ["services", serviceId],
    queryFn: async () => {
      const res = await servicesApi.getById(serviceId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch service");
      }
      return res.data;
    },
    enabled: !!serviceId,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServiceInput) => {
      const res = await servicesApi.create(data);
      if (!res.success) {
        throw new Error(res.message || "Failed to create service");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, data }: { serviceId: string; data: UpdateServiceInput }) => {
      const res = await servicesApi.update(serviceId, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to update service");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services", variables.serviceId] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const res = await servicesApi.delete(serviceId);
      if (!res.success) {
        throw new Error(res.message || "Failed to delete service");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useServiceInvitations(serviceId: string) {
  return useQuery({
    queryKey: ["services", serviceId, "invitations"],
    queryFn: async () => {
      const res = await servicesApi.getInvitations(serviceId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch invitations");
      }
      return res.data ?? [];
    },
    enabled: !!serviceId,
  });
}

export function useCreateServiceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, data }: { serviceId: string; data: CreateInvitationInput }) => {
      const res = await servicesApi.createInvitation(serviceId, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to create invitation");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "invitations"],
      });
    },
  });
}

export function useAcceptServiceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, invitationId }: { serviceId: string; invitationId: string }) => {
      const res = await servicesApi.acceptInvitation(serviceId, invitationId);
      if (!res.success) {
        throw new Error(res.message || "Failed to accept invitation");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "invitations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "members"],
      });
    },
  });
}

export function useRejectServiceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, invitationId }: { serviceId: string; invitationId: string }) => {
      const res = await servicesApi.rejectInvitation(serviceId, invitationId);
      if (!res.success) {
        throw new Error(res.message || "Failed to reject invitation");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "invitations"],
      });
    },
  });
}

export function useCancelServiceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, invitationId }: { serviceId: string; invitationId: string }) => {
      const res = await servicesApi.cancelInvitation(serviceId, invitationId);
      if (!res.success) {
        throw new Error(res.message || "Failed to cancel invitation");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "invitations"],
      });
    },
  });
}

export function useServiceMembers(serviceId: string) {
  return useQuery({
    queryKey: ["services", serviceId, "members"],
    queryFn: async () => {
      const res = await servicesApi.getMembers(serviceId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch members");
      }
      return res.data ?? [];
    },
    enabled: !!serviceId,
  });
}

export function useUpdateServiceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceId,
      userId,
      data,
    }: {
      serviceId: string;
      userId: string;
      data: UpdateMemberInput;
    }) => {
      const res = await servicesApi.updateMember(serviceId, userId, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to update member");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "members"],
      });
    },
  });
}

export function useRemoveServiceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, userId }: { serviceId: string; userId: string }) => {
      const res = await servicesApi.removeMember(serviceId, userId);
      if (!res.success) {
        throw new Error(res.message || "Failed to remove member");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "members"],
      });
    },
  });
}

export function useApiKeys(serviceId: string) {
  return useQuery({
    queryKey: ["services", serviceId, "apikeys"],
    queryFn: async () => {
      const res = await servicesApi.getApiKeys(serviceId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch API keys");
      }
      return res.data ?? [];
    },
    enabled: !!serviceId,
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, data }: { serviceId: string; data: CreateApiKeyInput }) => {
      const res = await servicesApi.createApiKey(serviceId, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to create API key");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "apikeys"],
      });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, apiKeyId }: { serviceId: string; apiKeyId: string }) => {
      const res = await servicesApi.deleteApiKey(serviceId, apiKeyId);
      if (!res.success) {
        throw new Error(res.message || "Failed to delete API key");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["services", variables.serviceId, "apikeys"],
      });
    },
  });
}

export function useGitHubRepos(enabled = true) {
  return useQuery({
    queryKey: ["github", "repos"],
    queryFn: async () => {
      const res = await servicesApi.getGitHubRepos();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch GitHub repos");
      }
      return res.data ?? [];
    },
    enabled,
  });
}

export function useGitHubBranches(repoId?: number) {
  return useQuery({
    queryKey: ["github", "repos", repoId, "branches"],
    queryFn: async () => {
      if (!repoId) return [];
      const res = await servicesApi.getGitHubBranches(repoId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch GitHub branches");
      }
      return res.data ?? [];
    },
    enabled: !!repoId,
  });
}

export function useGitHubWorkflows(repoId?: number) {
  return useQuery({
    queryKey: ["github", "repos", repoId, "workflows"],
    queryFn: async () => {
      if (!repoId) return [];
      const res = await servicesApi.getGitHubWorkflows(repoId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch GitHub workflows");
      }
      return res.data ?? [];
    },
    enabled: !!repoId,
  });
}

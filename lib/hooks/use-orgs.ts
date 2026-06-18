"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  orgsApi,
  type CreateOrgInput,
  type UpdateOrgInput,
  type InviteInput,
} from "@/lib/api";

export function useOrgs() {
  return useQuery({
    queryKey: ["orgs"],
    queryFn: async () => {
      const res = await orgsApi.getOrgs();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch organizations");
      }
      return res.data ?? [];
    },
  });
}

export function useCurrentOrg() {
  return useQuery({
    queryKey: ["orgs", "current"],
    queryFn: async () => {
      const res = await orgsApi.getCurrentOrg();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch current organization");
      }
      return res.data;
    },
  });
}

export function useOrgById(orgId: string) {
  return useQuery({
    queryKey: ["orgs", orgId],
    queryFn: async () => {
      const res = await orgsApi.getOrgById(orgId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch organization");
      }
      return res.data;
    },
    enabled: !!orgId,
  });
}

export function useUpdateOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateOrgInput & { id: string }) => {
      const res = await orgsApi.updateOrg(id, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to update organization");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orgs", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });
}

export function useCreateOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrgInput) => {
      const res = await orgsApi.createOrg(data);
      if (!res.success) {
        throw new Error(res.message || "Failed to create organization");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });
}

export function useSwitchOrg() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orgId: string) => {
      const res = await orgsApi.switchOrg(orgId);
      if (!res.success) {
        throw new Error(res.message || "Failed to switch organization");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ refetchType: "all" });
    },
  });
}

export function useOrgMembers(orgId?: string) {
  return useQuery({
    queryKey: ["orgs", "members", orgId],
    queryFn: async () => {
      const res = await orgsApi.getMembers(orgId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch members");
      }
      return res.data ?? [];
    },
    enabled: !!orgId,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, data }: { orgId: string; data: InviteInput }) => {
      const res = await orgsApi.inviteMember(orgId, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to invite member");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orgs", "members", variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ["orgs", "current"] });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });
}

export function useUpdateOrgMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orgId,
      userId,
      role,
    }: {
      orgId: string;
      userId: string;
      role: string;
    }) => {
      const res = await orgsApi.updateMemberRole(orgId, userId, { role });
      if (!res.success) {
        throw new Error(res.message || "Failed to update member role");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orgs", "members", variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ["orgs", "current"] });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });
}

export function useRemoveOrgMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orgId, userId }: { orgId: string; userId: string }) => {
      const res = await orgsApi.removeMember(orgId, userId);
      if (!res.success) {
        throw new Error(res.message || "Failed to remove member");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orgs", "members", variables.orgId] });
      queryClient.invalidateQueries({ queryKey: ["orgs", "current"] });
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
  });
}

export function useGitHubStatus() {
  return useQuery({
    queryKey: ["orgs", "github"],
    queryFn: async () => {
      const res = await orgsApi.getGitHubStatus();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch GitHub status");
      }
      return res.data;
    },
  });
}

export function useConnectGitHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (redirectUrl?: string) => {
      const res = await orgsApi.connectGitHub(redirectUrl);
      if (!res.success) {
        throw new Error(res.message || "Failed to connect GitHub");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgs", "github"] });
    },
  });
}

export function useDisconnectGitHub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await orgsApi.disconnectGitHub();
      if (!res.success) {
        throw new Error(res.message || "Failed to disconnect GitHub");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgs", "github"] });
    },
  });
}

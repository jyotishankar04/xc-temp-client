"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orgsApi, type CreateOrgInput, type UpdateOrgInput, type InviteInput } from "@/lib/api";

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
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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
    },
  });
}

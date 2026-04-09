"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesApi, type UpdateCaseInput } from "@/lib/api";

export function useCases(params?: {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  environment?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["cases", params],
    queryFn: async () => {
      const res = await casesApi.getAll(params);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch cases");
      }
      return res.data ?? [];
    },
  });
}

export function useCaseById(caseId: string) {
  return useQuery({
    queryKey: ["cases", caseId],
    queryFn: async () => {
      const res = await casesApi.getById(caseId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch case");
      }
      return res.data;
    },
    enabled: !!caseId,
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caseId, data }: { caseId: string; data: UpdateCaseInput }) => {
      const res = await casesApi.update(caseId, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to update case");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases", variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}

export function useMergeCases() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caseId, targetCaseId }: { caseId: string; targetCaseId: string }) => {
      const res = await casesApi.merge(caseId, targetCaseId);
      if (!res.success) {
        throw new Error(res.message || "Failed to merge cases");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });
}
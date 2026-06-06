"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rcaApi } from "@/lib/api";
import type { UpdateRcaInput } from "@/lib/types/rca";

export function useRcaReports() {
  return useQuery({
    queryKey: ["rca"],
    queryFn: async () => {
      const res = await rcaApi.getAll();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch RCA reports");
      }
      return res.data ?? [];
    },
    // Poll every 4s while any report is still processing
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasInProgress = Array.isArray(data) && data.some((r) => r.status === "IN_PROGRESS");
      return hasInProgress ? 4000 : false;
    },
  });
}

export function useRcaById(reportId: string) {
  return useQuery({
    queryKey: ["rca", reportId],
    queryFn: async () => {
      const res = await rcaApi.getById(reportId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch RCA report");
      }
      return res.data;
    },
    enabled: !!reportId,
    // Poll every 4s while this report is still processing
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === "IN_PROGRESS" ? 4000 : false;
    },
  });
}

export function useGenerateRca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (caseId: string) => {
      const res = await rcaApi.generate(caseId);
      if (!res.success) {
        throw new Error(res.message || "Failed to generate RCA report");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rca"] });
    },
  });
}

export function useUpdateRca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, data }: { reportId: string; data: UpdateRcaInput }) => {
      const res = await rcaApi.update(reportId, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to update RCA report");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rca", variables.reportId] });
      queryClient.invalidateQueries({ queryKey: ["rca"] });
    },
  });
}

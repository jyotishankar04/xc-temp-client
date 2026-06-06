"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rollbackApi } from "@/lib/api";

export const useRollbackConfig = (serviceId: string) => {
  return useQuery({
    queryKey: ["rollback", serviceId, "config"],
    queryFn: async () => {
      const res = await rollbackApi.getConfig(serviceId);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch rollback config");
      }
      return res.data;
    },
    enabled: !!serviceId,
  });
};

export const useRollbackHistory = (serviceId: string, limit?: number) => {
  return useQuery({
    queryKey: ["rollback", serviceId, "history"],
    queryFn: async () => {
      const res = await rollbackApi.getHistory(serviceId, limit);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch rollback history");
      }
      return res.data ?? [];
    },
    enabled: !!serviceId,
  });
};

export const useUpdateRollbackConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceId,
      data,
    }: {
      serviceId: string;
      data: { autoRollbackEnabled?: boolean; autoRollbackThreshold?: number; rollbackWorkflow?: string | null };
    }) => {
      const res = await rollbackApi.updateConfig(serviceId, data);
      if (!res.success) {
        throw new Error(res.message || "Failed to update rollback config");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rollback", variables.serviceId, "config"] });
    },
  });
};

export const useTriggerRollback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, caseId }: { serviceId: string; caseId: string }) => {
      const res = await rollbackApi.triggerRollback(serviceId, { caseId });
      if (!res.success) {
        throw new Error(res.message || "Failed to trigger rollback");
      }
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rollback", variables.serviceId, "history"] });
    },
  });
};

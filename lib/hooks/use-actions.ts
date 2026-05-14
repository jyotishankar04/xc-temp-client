"use client";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { actionsApi, type ListActionsParams } from "@/lib/api";

const EMPTY_ACTIONS = {
  actions: [] as import("@/lib/api").Action[],
  pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
};

export const useActions = (params?: ListActionsParams) => {
  return useQuery({
    queryKey: ["actions", params],
    queryFn: async () => {
      try {
        const response = await actionsApi.getAll(params);
        if (!response.success) throw new Error(response.message || "Failed to fetch actions");
        return response.data ?? EMPTY_ACTIONS;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return EMPTY_ACTIONS;
        throw err;
      }
    },
  });
};

export const useAction = (actionId: string) => {
  return useQuery({
    queryKey: ["action", actionId],
    queryFn: async () => {
      const response = await actionsApi.getById(actionId);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch action");
      }
      return response.data;
    },
    enabled: !!actionId,
  });
};

export const useApproveAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (actionId: string) => {
      const response = await actionsApi.approve(actionId);
      if (!response.success) {
        throw new Error(response.message || "Failed to approve action");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actions"] });
    },
  });
};

export const useRejectAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (actionId: string) => {
      const response = await actionsApi.reject(actionId);
      if (!response.success) {
        throw new Error(response.message || "Failed to reject action");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actions"] });
    },
  });
};

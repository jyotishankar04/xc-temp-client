"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { actionsApi, type ListActionsParams, type Action } from "@/lib/api";

export const useActions = (params?: ListActionsParams) => {
  return useQuery({
    queryKey: ["actions", params],
    queryFn: async () => {
      const response = await actionsApi.getAll(params);
      return response.data;
    },
  });
};

export const useAction = (actionId: string) => {
  return useQuery({
    queryKey: ["action", actionId],
    queryFn: async () => {
      const response = await actionsApi.getById(actionId);
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
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actions"] });
    },
  });
};

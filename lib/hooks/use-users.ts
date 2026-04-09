"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi, type UpdateProfileInput, type UserSettings } from "@/lib/api";

export function useUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await usersApi.getMe();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch user");
      }
      return res.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const res = await usersApi.updateProfile(data);
      if (!res.success) {
        throw new Error(res.message || "Failed to update profile");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useUserSettings() {
  return useQuery({
    queryKey: ["user", "settings"],
    queryFn: async () => {
      const res = await usersApi.getSettings();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch settings");
      }
      return res.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      const res = await usersApi.updateSettings(data);
      if (!res.success) {
        throw new Error(res.message || "Failed to update settings");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "settings"] });
    },
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch dashboard stats");
      }
      return res.data;
    },
  });
}

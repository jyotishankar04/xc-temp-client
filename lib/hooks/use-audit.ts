"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { auditApi, type ListAuditLogsParams } from "@/lib/api";

const EMPTY_AUDIT = {
  logs: [] as import("@/lib/api").AuditLog[],
  pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
};

export const useAuditLogs = (params?: ListAuditLogsParams) => {
  return useQuery({
    queryKey: ["audit", params],
    queryFn: async () => {
      try {
        const response = await auditApi.getAuditLogs(params);
        if (!response.success) throw new Error(response.message ?? "Failed to fetch audit logs");
        return response.data ?? EMPTY_AUDIT;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return EMPTY_AUDIT;
        throw err;
      }
    },
  });
};

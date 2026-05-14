"use client";

import { useQuery } from "@tanstack/react-query";
import { auditApi, type ListAuditLogsParams } from "@/lib/api";

export const useAuditLogs = (params?: ListAuditLogsParams) => {
  return useQuery({
    queryKey: ["audit", params],
    queryFn: async () => {
      const response = await auditApi.getAuditLogs(params);
      return response.data;
    },
  });
};

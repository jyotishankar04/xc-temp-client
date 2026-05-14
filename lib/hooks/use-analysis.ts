"use client";

import { useQuery } from "@tanstack/react-query";
import { analysisApi, type ListAnalysisParams, type Pattern } from "@/lib/api";
import axios from "axios";

const EMPTY_ANALYSIS = {
  patterns: [] as Pattern[],
  summary: { totalPatterns: 0, highSeverityCount: 0, avgConfidence: 0 },
  pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
};

export const useAnalysis = (params?: ListAnalysisParams) => {
  return useQuery({
    queryKey: ["analysis", params],
    queryFn: async () => {
      try {
        const response = await analysisApi.getPatterns(params);
        if (!response.success) throw new Error(response.message ?? "Failed to fetch analysis");
        return response.data ?? EMPTY_ANALYSIS;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) return EMPTY_ANALYSIS;
        throw err;
      }
    },
  });
};

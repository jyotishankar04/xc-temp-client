"use client";

import { useQuery } from "@tanstack/react-query";
import { analysisApi, type ListAnalysisParams } from "@/lib/api";

export const useAnalysis = (params?: ListAnalysisParams) => {
  return useQuery({
    queryKey: ["analysis", params],
    queryFn: async () => {
      const response = await analysisApi.getPatterns(params);
      return response.data;
    },
  });
};

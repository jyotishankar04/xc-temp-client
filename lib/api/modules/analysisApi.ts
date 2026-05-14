import { apiClient, type ApiResponse } from "../client";

export interface Pattern {
  id: string;
  title: string;
  description: string;
  category: string;
  occurrences: number;
  services: string[];
  confidence: number;
  severity: "LOW" | "MEDIUM" | "HIGH";
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface AnalysisSummary {
  totalPatterns: number;
  highSeverityCount: number;
  avgConfidence: number;
}

export interface AnalysisResponse {
  patterns: Pattern[];
  summary: AnalysisSummary;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListAnalysisParams {
  serviceId?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH";
  page?: number;
  limit?: number;
}

export const analysisApi = {
  getPatterns: async (params?: ListAnalysisParams): Promise<ApiResponse<AnalysisResponse>> => {
    const response = await apiClient.get<ApiResponse<AnalysisResponse>>(
      "/api/v1/analysis",
      { params }
    );
    return response.data;
  },
};

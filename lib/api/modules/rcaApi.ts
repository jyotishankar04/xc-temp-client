import { apiClient, type ApiResponse } from "../client";

export interface RCAReport {
  id: string;
  caseId: string;
  title: string;
  summary?: string;
  rootCause?: string;
  rootCauseTitle?: string | null;
  rootCauseCategory?: string | null;
  rootCauseSummary?: string | null;
  explanation?: string;
  confidenceScore: number;
  modelVersion: string;
  impactScope?: string | null;
  affectedServices: string[];
  userImpact?: string | null;
  duration?: string | null;
  metadata?: Record<string, unknown>;
  notes?: string;
  reviewed: boolean;
  createdAt: string;
  updatedAt?: string;
  serviceId?: string;
  serviceName?: string;
  status: string;
  severity?: string;
  caseFingerprint?: string;
}

interface RawRCAReport {
  id: string;
  caseId: string;
  explanation?: string;
  confidenceScore: number;
  modelVersion: string;
  rootCauseTitle?: string | null;
  rootCauseCategory?: string | null;
  rootCauseSummary?: string | null;
  impactScope?: string | null;
  affectedServices: string[];
  userImpact?: string | null;
  duration?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  case?: {
    id: string;
    fingerprint: string;
    severity: string;
    status: string;
    service?: {
      id: string;
      name: string;
    };
  };
}

function transformRCAReport(raw: RawRCAReport): RCAReport {
  const isFailed = raw.metadata?.status === "FAILED" || raw.explanation?.includes("failed");
  
  return {
    id: raw.id,
    caseId: raw.caseId,
    title: raw.rootCauseTitle 
      ? raw.rootCauseTitle 
      : isFailed 
        ? "RCA Generation Failed" 
        : `RCA Report - ${raw.caseId.slice(0, 8)}`,
    summary: raw.rootCauseSummary || raw.explanation || undefined,
    rootCause: raw.rootCauseSummary || undefined,
    rootCauseTitle: raw.rootCauseTitle,
    rootCauseCategory: raw.rootCauseCategory,
    rootCauseSummary: raw.rootCauseSummary,
    explanation: raw.explanation,
    confidenceScore: raw.confidenceScore,
    modelVersion: raw.modelVersion,
    impactScope: raw.impactScope ?? undefined,
    affectedServices: raw.affectedServices ?? [],
    userImpact: raw.userImpact ?? undefined,
    duration: raw.duration ?? undefined,
    metadata: raw.metadata,
    reviewed: false,
    createdAt: raw.createdAt,
    updatedAt: undefined,
    serviceId: raw.case?.service?.id,
    serviceName: raw.case?.service?.name,
    status: raw.case?.status || "UNKNOWN",
    severity: raw.case?.severity,
    caseFingerprint: raw.case?.fingerprint,
  };
}

export interface UpdateRcaInput {
  notes?: string;
  reviewed?: boolean;
}

interface RawApiResponse {
  success: boolean;
  message?: string;
  data?: {
    reports?: RawRCAReport[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export const rcaApi = {
  getAll: async (): Promise<ApiResponse<RCAReport[]>> => {
    const response = await apiClient.get<RawApiResponse>("/api/v1/rca");
    const data = response.data;
    if (data?.success && data?.data?.reports) {
      return {
        success: true,
        message: "RCA reports fetched successfully",
        data: data.data.reports.map(transformRCAReport),
      };
    }
    return { success: false, message: "Failed to fetch RCA reports", data: [] };
  },

  getById: async (reportId: string): Promise<ApiResponse<RCAReport>> => {
    const response = await apiClient.get<RawApiResponse>(
      `/api/v1/rca/${reportId}`
    );
    const data = response.data;
    if (data?.success && data?.data && 'id' in data.data) {
      return {
        success: true,
        message: "RCA report fetched successfully",
        data: transformRCAReport(data.data as RawRCAReport),
      };
    }
    return { success: false, message: "Failed to fetch RCA report", data: null as unknown as RCAReport };
  },

  generate: async (caseId: string): Promise<ApiResponse<RCAReport>> => {
    const response = await apiClient.post<ApiResponse<RCAReport>>(
      `/api/v1/rca/${caseId}/generate`
    );
    return response.data;
  },

  update: async (
    reportId: string,
    data: UpdateRcaInput
  ): Promise<ApiResponse<RCAReport>> => {
    const response = await apiClient.patch<ApiResponse<RCAReport>>(
      `/api/v1/rca/${reportId}`,
      data
    );
    return response.data;
  },
};

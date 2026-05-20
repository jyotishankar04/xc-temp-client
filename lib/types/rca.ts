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

export interface UpdateRcaInput {
  notes?: string;
  reviewed?: boolean;
}

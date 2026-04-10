export interface RCAReport {
  id: string;
  caseId: string;
  title: string;
  summary?: string;
  rootCause?: string;
  notes?: string;
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
  serviceId?: string;
  serviceName?: string;
}

export interface UpdateRcaInput {
  notes?: string;
  reviewed?: boolean;
}

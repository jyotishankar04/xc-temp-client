export type IncidentStatus =
  | "triggered"
  | "acknowledged"
  | "investigating"
  | "resolved"
  | "postmortem";

export type IncidentSeverity = "critical" | "high" | "medium" | "low";

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  assignee?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  tags: string[];
  startedAt: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentTimeline {
  id: string;
  incidentId: string;
  type: "status_change" | "comment" | "assignment" | "tag_change";
  content: string;
  userId: string;
  createdAt: string;
}

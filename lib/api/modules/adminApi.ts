import { apiClient, type ApiResponse } from "../client";

export type MasterAdminRole = "OWNER" | "ADMIN" | "MEMBER";
export type MasterAdminStatus = "ACTIVE" | "DISABLED";

export interface MasterAdminProfile {
  id: string;
  email: string;
  role: MasterAdminRole;
}

export interface PlatformSettings {
  id: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string | null;
  betaMode: boolean;
  signupEnabled: boolean;
  pricingVisible: boolean;
  featureFlags: Record<string, unknown>;
  marketingControls: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Launch {
  id: string;
  title: string;
  subtitle?: string | null;
  features: string[];
  targetDate: string;
  type: "MAJOR" | "MINOR";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  audience: string;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    memberships: number;
    services: number;
  };
}

export interface AdminUser {
  id: string;
  name?: string | null;
  username?: string | null;
  email: string;
  status: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    memberships: number;
    serviceMembers: number;
  };
}

export interface MasterAdminMember {
  id: string;
  userId?: string | null;
  email: string;
  role: MasterAdminRole;
  status: MasterAdminStatus;
  invitedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export interface MasterAdminActivityLog {
  id: string;
  actorEmail: string;
  actorMemberId?: string | null;
  actionType: string;
  targetResource: string;
  targetId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string | null;
  source?: string | null;
  status: "ACTIVE" | "UNSUBSCRIBED";
  subscribedAt: string;
  unsubscribedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmailBroadcast {
  id: string;
  subject: string;
  bodyHtml: string;
  audience: "ALL" | "SELECTED";
  status: "QUEUED" | "SENDING" | "SENT" | "PARTIAL" | "FAILED";
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdByEmail: string;
  errorMessage?: string | null;
  sentAt?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    recipients: number;
  };
}

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data as T;

const withQuery = (path: string, params?: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
};

export const adminApi = {
  me: async () => unwrap(await apiClient.get<ApiResponse<MasterAdminProfile>>("/api/v1/admin/me")),

  getSettings: async () =>
    unwrap(await apiClient.get<ApiResponse<PlatformSettings>>("/api/v1/admin/settings")),

  updateSettings: async (data: Partial<PlatformSettings>) =>
    unwrap(await apiClient.patch<ApiResponse<PlatformSettings>>("/api/v1/admin/settings", data)),

  updateSection: async (section: string, data: Record<string, unknown>) =>
    unwrap(await apiClient.patch<ApiResponse<PlatformSettings>>(`/api/v1/admin/${section}`, data)),

  listAnnouncements: async (q?: string) =>
    unwrap(
      await apiClient.get<ApiResponse<PaginatedResponse<SystemAnnouncement>>>(
        withQuery("/api/v1/admin/announcements", { q }),
      ),
    ),

  createAnnouncement: async (data: Pick<SystemAnnouncement, "title" | "message" | "audience" | "active">) =>
    unwrap(await apiClient.post<ApiResponse<SystemAnnouncement>>("/api/v1/admin/announcements", data)),

  updateAnnouncement: async (id: string, data: Partial<SystemAnnouncement>) =>
    unwrap(await apiClient.patch<ApiResponse<SystemAnnouncement>>(`/api/v1/admin/announcements/${id}`, data)),

  deleteAnnouncement: async (id: string) =>
    unwrap(await apiClient.delete<ApiResponse<SystemAnnouncement>>(`/api/v1/admin/announcements/${id}`)),

  listOrganizations: async (q?: string) =>
    unwrap(
      await apiClient.get<ApiResponse<PaginatedResponse<AdminOrganization>>>(
        withQuery("/api/v1/admin/organizations", { q }),
      ),
    ),

  updateOrganization: async (orgId: string, data: Partial<Pick<AdminOrganization, "plan" | "status" | "notes">>) =>
    unwrap(await apiClient.patch<ApiResponse<AdminOrganization>>(`/api/v1/admin/organizations/${orgId}`, data)),

  listUsers: async (q?: string) =>
    unwrap(
      await apiClient.get<ApiResponse<PaginatedResponse<AdminUser>>>(
        withQuery("/api/v1/admin/users", { q }),
      ),
    ),

  listMembers: async (q?: string) =>
    unwrap(
      await apiClient.get<ApiResponse<PaginatedResponse<MasterAdminMember>>>(
        withQuery("/api/v1/admin/members", { q }),
      ),
    ),

  createMember: async (data: { email: string; password?: string; role: MasterAdminRole }) =>
    unwrap(await apiClient.post<ApiResponse<MasterAdminMember>>("/api/v1/admin/members", data)),

  updateMember: async (id: string, data: Partial<Pick<MasterAdminMember, "role" | "status">> & { password?: string }) =>
    unwrap(await apiClient.patch<ApiResponse<MasterAdminMember>>(`/api/v1/admin/members/${id}`, data)),

  deleteMember: async (id: string) =>
    unwrap(await apiClient.delete<ApiResponse<MasterAdminMember>>(`/api/v1/admin/members/${id}`)),

  listLaunches: async (q?: string) =>
    unwrap(
      await apiClient.get<ApiResponse<PaginatedResponse<Launch>>>(
        withQuery("/api/v1/admin/launches", { q }),
      ),
    ),

  createLaunch: async (data: Omit<Launch, "id" | "createdAt" | "updatedAt">) =>
    unwrap(await apiClient.post<ApiResponse<Launch>>("/api/v1/admin/launches", data)),

  updateLaunch: async (id: string, data: Partial<Launch>) =>
    unwrap(await apiClient.patch<ApiResponse<Launch>>(`/api/v1/admin/launches/${id}`, data)),

  deleteLaunch: async (id: string) =>
    unwrap(await apiClient.delete<ApiResponse<Launch>>(`/api/v1/admin/launches/${id}`)),

  listActivityLogs: async (q?: string) =>
    unwrap(
      await apiClient.get<ApiResponse<PaginatedResponse<MasterAdminActivityLog>>>(
        withQuery("/api/v1/admin/activity-logs", { q }),
      ),
    ),

  listSubscribers: async (q?: string, status?: EmailSubscriber["status"]) =>
    unwrap(
      await apiClient.get<ApiResponse<PaginatedResponse<EmailSubscriber>>>(
        withQuery("/api/v1/admin/subscribers", { q, status }),
      ),
    ),

  listEmailBroadcasts: async (q?: string) =>
    unwrap(
      await apiClient.get<ApiResponse<PaginatedResponse<EmailBroadcast>>>(
        withQuery("/api/v1/admin/email-broadcasts", { q }),
      ),
    ),

  createEmailBroadcast: async (data: {
    subject: string;
    bodyHtml: string;
    audience: "ALL" | "SELECTED";
    subscriberIds?: string[];
    emails?: string[];
  }) =>
    unwrap(await apiClient.post<ApiResponse<EmailBroadcast>>("/api/v1/admin/email-broadcasts", data)),
};

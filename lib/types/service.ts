export type DeploymentType =
  | "GITHUB_ACTIONS"
  | "VERCEL"
  | "KUBERNETES"
  | "DOCKER"
  | "MANUAL"
  | "OTHER";

export interface Service {
  id: string;
  name: string;
  env: string;
  status?: string;
  description?: string | null;
  githubRepoId?: number | null;
  githubRepoName?: string | null;
  githubRepoFullName?: string | null;
  defaultBranch?: string | null;
  deploymentType?: DeploymentType | null;
  rollbackWorkflow?: string | null;
  autoRollbackEnabled?: boolean;
  autoRollbackThreshold?: number;
  lastStableCommit?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceInput {
  name: string;
  env: string;
  description?: string;
  githubRepoId?: number;
  githubRepoName?: string;
  githubRepoFullName?: string;
  defaultBranch?: string;
  deploymentType?: DeploymentType;
  rollbackWorkflow?: string;
  autoRollbackEnabled?: boolean;
  autoRollbackThreshold?: number;
}

export interface UpdateServiceInput {
  name?: string;
  env?: string;
  description?: string | null;
  defaultBranch?: string;
  deploymentType?: DeploymentType | null;
  rollbackWorkflow?: string | null;
  autoRollbackEnabled?: boolean;
  autoRollbackThreshold?: number;
}

export interface ServiceInvitation {
  id: string;
  email: string;
  role: string;
  status?: string;
  serviceId?: string;
  expiresAt?: string;
  createdAt?: string;
}

export interface CreateInvitationInput {
  email: string;
  role: string;
}

export interface ServiceMember {
  userId: string;
  email?: string;
  name?: string;
  role: string;
  avatarUrl?: string;
  status?: string;
  joinedAt?: string;
}

export interface UpdateMemberInput {
  role: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  prefix?: string;
  createdAt?: string;
}

export interface CreateApiKeyInput {
  name: string;
}

export interface GitHubRepo {
  id: number;
  fullName: string;
  name: string;
  private: boolean;
  htmlUrl: string;
  description: string | null;
  defaultBranch: string;
  language: string | null;
  updatedAt: string;
  owner?: string;
}

export interface GitHubBranch {
  name: string;
  commitSha: string;
  protected: boolean;
}

export interface GitHubWorkflow {
  id: number;
  name: string;
  path: string;
  state: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
}

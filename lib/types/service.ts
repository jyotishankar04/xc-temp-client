export interface Service {
  id: string;
  name: string;
  env: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceInput {
  name: string;
  env: string;
}

export interface UpdateServiceInput {
  name?: string;
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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "owner" | "admin" | "member" | "viewer";

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  user: User;
  role: UserRole;
  joinedAt: string;
}

export type Member = {
  userId: string;
  userName: string;
  userEmail: string;
  userActive: boolean;
  organizationId: string;
  role: string;
  departmentId?: string | null;
  departmentName?: string | null;
  joinedAt?: string | null;
};

export type InviteMemberRequest = {
  email: string;
  role: string;
  departmentId?: string | null;
};

export type UpdateMemberRequest = {
  role?: string;
  departmentId?: string | null;
};

export const MEMBER_ROLES = ['OWNER', 'ADMIN', 'AGENT', 'MEMBER'] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

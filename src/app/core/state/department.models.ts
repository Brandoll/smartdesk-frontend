export type Department = {
  id: string;
  name: string;
  active?: boolean;
  organizationId: string;
  createdAt?: string | null;
};

export type CreateDepartmentRequest = {
  name: string;
  organizationId: string;
};

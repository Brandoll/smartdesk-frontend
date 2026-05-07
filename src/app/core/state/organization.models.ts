export type Organization = {
  id: string;
  name: string;
  sector?: string | null;
  active?: boolean;
  createdAt?: string | null;
};

export type CreateOrganizationRequest = {
  name: string;
  sector: string;
};

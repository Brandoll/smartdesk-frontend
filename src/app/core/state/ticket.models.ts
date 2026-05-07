export type Ticket = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  requesterId?: string | null;
  requesterName?: string | null;
  departmentId?: string | null;
  departmentName?: string | null;
  organizationId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CreateTicketRequest = {
  title: string;
  description: string;
  departmentId?: string | null;
};

export type UpdateTicketRequest = {
  status?: string;
  priority?: string;
  departmentId?: string | null;
};

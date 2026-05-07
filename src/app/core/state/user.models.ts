export type User = {
  id: string;
  name: string;
  email: string;
  active?: boolean;
  createdAt?: string | null;
};

export type UpdateUserRequest = {
  name: string;
};

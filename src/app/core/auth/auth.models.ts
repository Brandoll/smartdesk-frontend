export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthTokenResponse = {
  token: string;
  tokenType?: string;
  userId?: string;
  email?: string;
  name?: string;
};


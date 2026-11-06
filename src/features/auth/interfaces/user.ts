export interface AuthUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  budget: number;
  cycleStartedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthData {
  user: AuthUser;
  token: string;
}

export const AUTH_PATHS = {
  login: "/auth/login",
  register: "/auth/register",
  google: "/auth/google",
  me: "/auth/me",
} as const;

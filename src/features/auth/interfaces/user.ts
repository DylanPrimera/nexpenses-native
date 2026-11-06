export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive?: boolean;
  roles?: string[];
}

export interface AuthPayload {
  user: User;
  token: string;
}

/** Raw backend auth response (login / register / check-status). */
export interface AuthApiResponse {
  id: string;
  email: string;
  fullName: string;
  isActive?: boolean;
  roles?: string[];
  token: string;
}

export const AUTH_PATHS = {
  login: "/auth/login",
  register: "/auth/register",
  checkStatus: "/auth/check-status",
} as const;

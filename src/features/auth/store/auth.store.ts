import { AUTH_TOKEN_KEY, SecureStorageAdapter } from "@/core";
import { create } from "zustand";
import { checkStatusAction, loginAction, registerAction } from "../actions";
import type { User } from "../interfaces";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  changeStatus: (token?: string, user?: User) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "checking",
  token: undefined,
  user: undefined,

  changeStatus: async (token?: string, user?: User) => {
    if (!token || !user) {
      set({ status: "unauthenticated", user: undefined, token: undefined });
      await SecureStorageAdapter.removeItem(AUTH_TOKEN_KEY);
      return false;
    }

    set({ status: "authenticated", token, user });
    await SecureStorageAdapter.setItem(AUTH_TOKEN_KEY, token);
    return true;
  },

  login: async (email, password) => {
    const result = await loginAction(email, password);
    return get().changeStatus(result?.token, result?.user);
  },

  register: async (fullName, email, password) => {
    const result = await registerAction(fullName, email, password);
    return get().changeStatus(result?.token, result?.user);
  },

  checkStatus: async () => {
    const result = await checkStatusAction();
    await get().changeStatus(result?.token, result?.user);
  },

  logout: async () => {
    await SecureStorageAdapter.removeItem(AUTH_TOKEN_KEY);
    set({ status: "unauthenticated", token: undefined, user: undefined });
  },
}));

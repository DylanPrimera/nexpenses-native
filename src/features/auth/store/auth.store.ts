import { isApiError } from "@/core/api/envelope";
import { isNetworkError } from "@/core/api/is-network-error";
import { create } from "zustand";
import {
  AuthActionError,
  loginAction,
  refreshSessionAction,
  registerAction,
} from "../actions";
import type { AuthUser } from "../interfaces";
import {
  clearAllSession,
  readSessionMeta,
  readToken,
  saveSessionMeta,
  saveToken,
} from "../lib/session-storage";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  token?: string;
  userId?: string;
  firstName: string;
  lastName: string;

  /** Apply Nest auth payload to memory + SecureStore/AsyncStorage. */
  applySession: (token: string, user: Pick<AuthUser, "id" | "firstName" | "lastName">) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  /** Boot: token → GET /auth/me; 401 clear; network keep cached session (Next-like). */
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "checking",
  token: undefined,
  userId: undefined,
  firstName: "",
  lastName: "",

  applySession: async (token, user) => {
    await saveToken(token);
    await saveSessionMeta({
      userId: user.id,
      firstName: user.firstName?.trim() ?? "",
      lastName: user.lastName?.trim() ?? "",
    });
    set({
      status: "authenticated",
      token,
      userId: user.id,
      firstName: user.firstName?.trim() ?? "",
      lastName: user.lastName?.trim() ?? "",
    });
  },

  login: async (email, password) => {
    const data = await loginAction(email, password);
    await get().applySession(data.token, data.user);
  },

  register: async (input) => {
    const data = await registerAction(input);
    await get().applySession(data.token, data.user);
  },

  bootstrap: async () => {
    set({ status: "checking" });
    const token = await readToken();
    if (!token) {
      set({
        status: "unauthenticated",
        token: undefined,
        userId: undefined,
        firstName: "",
        lastName: "",
      });
      return;
    }

    const meta = await readSessionMeta();
    // Optimistic restore while /auth/me runs
    set({
      token,
      userId: meta?.userId,
      firstName: meta?.firstName ?? "",
      lastName: meta?.lastName ?? "",
    });

    try {
      const data = await refreshSessionAction();
      await get().applySession(data.token, data.user);
    } catch (error) {
      const status =
        error instanceof AuthActionError
          ? error.status
          : isApiError(error)
            ? error.status
            : 0;

      if (status === 401) {
        await clearAllSession();
        set({
          status: "unauthenticated",
          token: undefined,
          userId: undefined,
          firstName: "",
          lastName: "",
        });
        return;
      }

      if (isNetworkError(error) || status === 0) {
        // Mirror Next bootstrap: network failure keeps stored session.
        set({
          status: "authenticated",
          token,
          userId: meta?.userId,
          firstName: meta?.firstName ?? "",
          lastName: meta?.lastName ?? "",
        });
        return;
      }

      // Other API errors: keep session if we have meta, else unauth
      if (meta?.userId) {
        set({
          status: "authenticated",
          token,
          userId: meta.userId,
          firstName: meta.firstName,
          lastName: meta.lastName,
        });
        return;
      }

      await clearAllSession();
      set({
        status: "unauthenticated",
        token: undefined,
        userId: undefined,
        firstName: "",
        lastName: "",
      });
    }
  },

  logout: async () => {
    await clearAllSession();
    set({
      status: "unauthenticated",
      token: undefined,
      userId: undefined,
      firstName: "",
      lastName: "",
    });
  },
}));

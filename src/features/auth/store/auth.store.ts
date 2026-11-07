import { closeQuerySession, openQuerySession } from "@/core/query/session-runtime";
import { purgeQueryPersistence } from "@/core/query/query-persistence";
import { requireOnline } from "@/core/network/require-online";
import { queryClient } from "@/core/query/query-client";
import { clearCycleNoticeDismissal } from "@/features/budget/lib/cycle-notice-storage";
import { clearOnboarding } from "@/features/onboarding/lib/onboarding-storage";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding.store";
import { create } from "zustand";
import {
  deleteAccountAction,
  googleSignInAction,
  loginAction,
  refreshSessionAction,
  registerAction,
} from "../actions";
import type { AuthUser } from "../interfaces";
import { authErrorStatus } from "../lib/auth-errors";
import { requestGoogleIdToken, signOutGoogle } from "../lib/google-sdk";
import {
  clearAllSession,
  readSessionMeta,
  readToken,
  saveSessionMeta,
  saveToken,
} from "../lib/session-storage";

export type GoogleLoginResult = "signed-in" | "cancelled";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type SessionUser = Pick<AuthUser, "id" | "firstName" | "lastName">;

interface AuthState {
  status: AuthStatus;
  token?: string;
  userId?: string;
  firstName: string;
  lastName: string;

  applySession: (token: string, user: SessionUser) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<GoogleLoginResult>;
  bootstrap: () => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const SIGNED_OUT = {
  status: "unauthenticated",
  token: undefined,
  userId: undefined,
  firstName: "",
  lastName: "",
} as const;

let googleInFlight: Promise<GoogleLoginResult> | null = null;

async function endSession(
  set: (state: typeof SIGNED_OUT) => void,
  cleanup: () => Promise<unknown>,
  userId?: string,
) {
  closeQuerySession();
  await queryClient.cancelQueries();
  set(SIGNED_OUT);
  useOnboardingStore.getState().resetSession();
  try {
    try {
      await purgeQueryPersistence(userId);
    } finally {
      await cleanup();
    }
  } finally {
    queryClient.clear();
  }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "checking",
  token: undefined,
  userId: undefined,
  firstName: "",
  lastName: "",

  applySession: async (token, user) => {
    const firstName = user.firstName?.trim() ?? "";
    const lastName = user.lastName?.trim() ?? "";
    await saveToken(token);
    await saveSessionMeta({ userId: user.id, firstName, lastName });
    openQuerySession(user.id);
    set({ status: "authenticated", token, userId: user.id, firstName, lastName });
  },

  login: async (email, password) => {
    requireOnline();
    const { token, user } = await loginAction(email, password);
    closeQuerySession();
    await purgeQueryPersistence(get().userId);
    if (get().userId !== user.id) await purgeQueryPersistence(user.id);
    queryClient.removeQueries();
    queryClient.clear();
    await get().applySession(token, user);
  },

  register: async (input) => {
    requireOnline();
    const { token, user } = await registerAction(input);
    closeQuerySession();
    await purgeQueryPersistence(get().userId);
    if (get().userId !== user.id) await purgeQueryPersistence(user.id);
    queryClient.removeQueries();
    queryClient.clear();
    await get().applySession(token, user);
  },

  loginWithGoogle: () => {
    requireOnline();
    if (googleInFlight) return googleInFlight;
    googleInFlight = (async (): Promise<GoogleLoginResult> => {
      const idToken = await requestGoogleIdToken();
      if (!idToken) return "cancelled";
      const { token, user } = await googleSignInAction(idToken);
      closeQuerySession();
      await purgeQueryPersistence(get().userId);
      if (get().userId !== user.id) await purgeQueryPersistence(user.id);
      queryClient.removeQueries();
      queryClient.clear();
      await get().applySession(token, user);
      return "signed-in";
    })().finally(() => {
      googleInFlight = null;
    });
    return googleInFlight;
  },

  bootstrap: async () => {
    const token = await readToken().catch(() => null);
    if (!token) {
      set(SIGNED_OUT);
      return;
    }
    const meta = await readSessionMeta().catch(() => null);
    openQuerySession(meta?.userId);
    set({
      status: "authenticated",
      token,
      userId: meta?.userId,
      firstName: meta?.firstName ?? "",
      lastName: meta?.lastName ?? "",
    });
    await get().refreshSession();
  },

  refreshSession: async () => {
    const { token: startToken } = get();
    if (!startToken) return;
    try {
      const { token, user } = await refreshSessionAction();
      if (get().token !== startToken) return;
      await get().applySession(token, user);
    } catch (error) {
      if (authErrorStatus(error) === 401 && get().token === startToken) {
        await get().logout();
      }
    }
  },

  logout: () =>
    endSession(set, () => Promise.all([clearAllSession(), signOutGoogle()]), get().userId),

  deleteAccount: async () => {
    const { userId } = get();
    await deleteAccountAction();
    await endSession(
      set,
      () =>
        Promise.allSettled([
          clearAllSession(),
          signOutGoogle(),
          clearCycleNoticeDismissal(),
          userId ? clearOnboarding(userId) : Promise.resolve(),
        ]),
      userId,
    );
  },
}));

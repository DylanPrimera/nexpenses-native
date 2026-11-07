import { apiClient } from "@/core/api/api-client";
import { isApiError } from "@/core/api/envelope";
import { AUTH_PATHS, type AuthData } from "../interfaces";
import { AuthActionError, invalidAuthResponse, rethrowAuthError } from "../lib/auth-errors";
import { authCopy } from "../lib/auth-messages";

const CONFLICT = 409;

export async function googleSignInAction(idToken: string): Promise<AuthData> {
  try {
    const { data } = await apiClient.post<AuthData>(AUTH_PATHS.google, { idToken });
    if (!data?.token || !data.user?.id) throw invalidAuthResponse();
    return data;
  } catch (error) {
    if (isApiError(error) && error.status === CONFLICT) {
      throw new AuthActionError(authCopy.google_password_account, CONFLICT);
    }
    rethrowAuthError(error);
  }
}

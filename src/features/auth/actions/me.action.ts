import { apiClient, isApiError } from "@/core";
import { AUTH_PATHS, type AuthData } from "../interfaces";
import { spanishAuthError } from "../lib/auth-messages";
import { AuthActionError } from "./login.action";

export async function refreshSessionAction(): Promise<AuthData> {
  try {
    const { data } = await apiClient.get<AuthData>(AUTH_PATHS.me);
    if (!data?.token || !data.user?.id) {
      throw new AuthActionError("No se pudo completar. Inténtalo de nuevo.", 0);
    }
    return data;
  } catch (error) {
    if (isApiError(error)) {
      throw new AuthActionError(
        spanishAuthError(error.status, error.message),
        error.status,
      );
    }
    throw error;
  }
}

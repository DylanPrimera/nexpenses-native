import { apiClient } from "@/core/api/api-client";
import { AUTH_PATHS, type AuthData } from "../interfaces";
import { invalidAuthResponse, rethrowAuthError } from "../lib/auth-errors";

export async function refreshSessionAction(): Promise<AuthData> {
  try {
    const { data } = await apiClient.get<AuthData>(AUTH_PATHS.me);
    if (!data?.token || !data.user?.id) throw invalidAuthResponse();
    return data;
  } catch (error) {
    rethrowAuthError(error);
  }
}

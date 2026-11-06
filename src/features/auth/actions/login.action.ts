import { apiClient } from "@/core/api/api-client";
import { AUTH_PATHS, type AuthData } from "../interfaces";
import { invalidAuthResponse, rethrowAuthError } from "../lib/auth-errors";

export async function loginAction(email: string, password: string): Promise<AuthData> {
  try {
    const { data } = await apiClient.post<AuthData>(AUTH_PATHS.login, {
      email: email.trim().toLowerCase(),
      password,
    });
    if (!data?.token || !data.user?.id) throw invalidAuthResponse();
    return data;
  } catch (error) {
    rethrowAuthError(error);
  }
}

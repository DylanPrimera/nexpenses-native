import { apiClient } from "@/core/api/api-client";
import { AUTH_PATHS, type AuthData } from "../interfaces";
import { invalidAuthResponse, rethrowAuthError } from "../lib/auth-errors";

export async function registerAction(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthData> {
  try {
    const { data } = await apiClient.post<AuthData>(AUTH_PATHS.register, {
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });
    if (!data?.token || !data.user?.id) throw invalidAuthResponse();
    return data;
  } catch (error) {
    rethrowAuthError(error);
  }
}

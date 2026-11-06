import { apiClient, isApiError } from "@/core";
import { AUTH_PATHS, type AuthData } from "../interfaces";
import { spanishAuthError } from "../lib/auth-messages";
import { AuthActionError } from "./login.action";

function rethrowSpanish(error: unknown): never {
  if (isApiError(error)) {
    throw new AuthActionError(spanishAuthError(error.status, error.message), error.status);
  }
  if (error instanceof AuthActionError) throw error;
  if (error instanceof Error) throw error;
  throw new AuthActionError("No se pudo completar. Inténtalo de nuevo.", 0);
}

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
    return data;
  } catch (error) {
    console.log("error", error);
    rethrowSpanish(error);
  }
}

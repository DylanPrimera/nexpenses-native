import { apiClient, isApiError } from "@/core";
import { AUTH_PATHS, type AuthData } from "../interfaces";
import { spanishAuthError } from "../lib/auth-messages";

export class AuthActionError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthActionError";
    this.status = status;
  }
}

function rethrowSpanish(error: unknown): never {
  if (isApiError(error)) {
    throw new AuthActionError(
      spanishAuthError(error.status, error.message),
      error.status,
    );
  }
  if (error instanceof AuthActionError) throw error;
  if (error instanceof Error) throw error;
  throw new AuthActionError("No se pudo completar. Inténtalo de nuevo.", 0);
}

export async function loginAction(
  email: string,
  password: string,
): Promise<AuthData> {
  try {
    const { data } = await apiClient.post<AuthData>(AUTH_PATHS.login, {
      email: email.trim().toLowerCase(),
      password,
    });
    if (!data?.token || !data.user?.id) {
      throw new AuthActionError("No se pudo completar. Inténtalo de nuevo.", 0);
    }
    return data;
  } catch (error) {
    rethrowSpanish(error);
  }
}

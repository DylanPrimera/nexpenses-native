import { OfflineActionError } from "@/core/network/require-online";
import { isApiError } from "@/core/api/envelope";
import { authCopy, spanishAuthError } from "./auth-messages";

export class AuthActionError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthActionError";
    this.status = status;
  }
}

export function invalidAuthResponse() {
  return new AuthActionError(authCopy.generic_error, 0);
}

export function rethrowAuthError(error: unknown): never {
  if (error instanceof AuthActionError) throw error;
  if (isApiError(error)) {
    throw new AuthActionError(spanishAuthError(error.status, error.message), error.status);
  }
  throw error;
}

export function authErrorStatus(error: unknown) {
  if (error instanceof AuthActionError) return error.status;
  if (isApiError(error)) return error.status;
  return 0;
}

export function authErrorMessage(error: unknown) {
  if (error instanceof OfflineActionError) return error.message;
  return error instanceof AuthActionError ? error.message : authCopy.generic_error;
}

import { messages } from "@/shared/i18n";

const Auth = messages.Auth;

export const authCopy = Auth;

export function spanishAuthError(status: number, message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("account already")) return Auth.account_exists;
  if (normalized.includes("already") || status === 409) {
    return Auth.email_taken;
  }
  if (normalized.includes("not configured")) return Auth.google_unavailable;
  if (status === 401 || status === 403) return Auth.invalid_credentials;
  return message.trim() || Auth.generic_error;
}

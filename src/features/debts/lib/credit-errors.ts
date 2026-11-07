import { isApiError, isNetworkError } from "@/core/api";
import { messages } from "@/shared/i18n";

export function creditErrorMessage(error: unknown, fallback: string): string {
  if (isNetworkError(error)) return messages.Debts.offline;
  if (isApiError(error) && error.message.trim()) return error.message;
  return fallback;
}

const PARSE_FAILURE_HINTS = ["extracto", "pdf", "faltan", "obligator", "leer", "parse"];

export function isStatementParseFailure(error: unknown): boolean {
  if (isNetworkError(error)) return false;
  const message = creditErrorMessage(error, "").toLowerCase();
  return PARSE_FAILURE_HINTS.some((hint) => message.includes(hint));
}

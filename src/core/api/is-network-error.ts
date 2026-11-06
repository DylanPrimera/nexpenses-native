import { isAxiosError } from "axios";

/** True when the request never got an HTTP response (offline / DNS / timeout). */
export function isNetworkError(error: unknown): boolean {
  if (!isAxiosError(error)) return false;
  return !error.response;
}

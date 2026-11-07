import { requireOnline } from "@/core/network/require-online";
import { apiClient } from "@/core/api/api-client";
import { AUTH_PATHS } from "../interfaces";

export async function deleteAccountAction(): Promise<void> {
  requireOnline();
  await apiClient.delete(AUTH_PATHS.deleteAccount);
}

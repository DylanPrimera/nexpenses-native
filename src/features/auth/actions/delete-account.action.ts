import { apiClient } from "@/core/api/api-client";
import { AUTH_PATHS } from "../interfaces";

export async function deleteAccountAction(): Promise<void> {
  await apiClient.delete(AUTH_PATHS.deleteAccount);
}

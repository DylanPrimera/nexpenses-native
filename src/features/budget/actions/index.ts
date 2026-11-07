import { requireOnline } from "@/core/network/require-online";
import { apiClient } from "@/core/api/api-client";
import {
  BUDGET_PATHS,
  type CycleSummary,
  type UpdateBudgetInput,
  type UserProfile,
} from "../interfaces";

export async function getProfileAction(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>(BUDGET_PATHS.me);
  return data;
}

export async function getCycleSummaryAction(): Promise<CycleSummary> {
  const { data } = await apiClient.get<CycleSummary>(BUDGET_PATHS.summary);
  return data;
}

export async function updateBudgetAction(input: UpdateBudgetInput): Promise<UserProfile> {
  requireOnline();
  const { data } = await apiClient.patch<UserProfile>(BUDGET_PATHS.me, input);
  return data;
}

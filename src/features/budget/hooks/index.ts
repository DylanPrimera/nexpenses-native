import { queryClient, queryKeys } from "@/core/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCycleSummaryAction, getProfileAction, updateBudgetAction } from "../actions";

const PROFILE_STALE_MS = 5 * 60 * 1000;
const SUMMARY_STALE_MS = 30 * 1000;

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: getProfileAction,
    staleTime: PROFILE_STALE_MS,
  });
}

export function useCycleSummary() {
  return useQuery({
    queryKey: queryKeys.summary.cycle,
    queryFn: getCycleSummaryAction,
    staleTime: SUMMARY_STALE_MS,
  });
}

export function useUpdateBudget() {
  return useMutation({
    mutationFn: updateBudgetAction,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile }),
        queryClient.invalidateQueries({ queryKey: queryKeys.summary.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
      ]);
    },
  });
}

import { queryClient, queryKeys } from "@/core/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteRecurringAction, getRecurringAction } from "../actions";

const RECURRING_STALE_MS = 60 * 1000;

export function useRecurring(enabled = true) {
  return useQuery({
    queryKey: queryKeys.recurring.all,
    queryFn: getRecurringAction,
    enabled,
    staleTime: RECURRING_STALE_MS,
  });
}

export function useDeleteRecurring() {
  return useMutation({
    mutationFn: deleteRecurringAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.recurring.all }),
  });
}

import { queryClient, queryKeys } from "@/core/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createExpenseAction,
  deleteExpenseAction,
  getCycleExpensesAction,
  updateExpenseAction,
} from "../actions";

const EXPENSES_STALE_MS = 30 * 1000;

function invalidateExpenseData() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.summary.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
  ]);
}

export function useCycleExpenses(cycleStartedAt: string | undefined) {
  return useQuery({
    queryKey: queryKeys.expenses.cycle(cycleStartedAt ?? ""),
    queryFn: () => getCycleExpensesAction(cycleStartedAt ?? ""),
    enabled: !!cycleStartedAt,
    staleTime: EXPENSES_STALE_MS,
  });
}

export function useCreateExpense() {
  return useMutation({ mutationFn: createExpenseAction, onSuccess: invalidateExpenseData });
}

export function useUpdateExpense() {
  return useMutation({ mutationFn: updateExpenseAction, onSuccess: invalidateExpenseData });
}

export function useDeleteExpense() {
  return useMutation({ mutationFn: deleteExpenseAction, onSuccess: invalidateExpenseData });
}

import { queryClient, queryKeys } from "@/core/query";
import { invalidateCreditData } from "@/features/debts";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createExpenseAction,
  deleteExpenseAction,
  getCycleExpensesAction,
  updateExpenseAction,
} from "../actions";
import type { DeleteExpenseInput } from "../interfaces";

const EXPENSES_STALE_MS = 30 * 1000;

function invalidateExpenseData(creditIds: readonly (string | null | undefined)[] = []) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.summary.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.history.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.recurring.all }),
    invalidateCreditData(creditIds),
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
  return useMutation({
    mutationFn: createExpenseAction,
    onSuccess: (_expense, input) => invalidateExpenseData([input.creditId]),
  });
}

export function useUpdateExpense() {
  return useMutation({
    mutationFn: updateExpenseAction,
    onSuccess: (_expense, { input, previousCreditId }) =>
      invalidateExpenseData([previousCreditId, input.creditId]),
  });
}

export function useDeleteExpense() {
  return useMutation({
    mutationFn: ({ id }: DeleteExpenseInput) => deleteExpenseAction(id),
    onSuccess: (_data, { creditId }) => invalidateExpenseData([creditId]),
  });
}

import { randomUUID } from "expo-crypto";
import { queryClient, queryKeys } from "@/core/query";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { usePendingExpenses } from "./usePendingExpenses";
import { mergePending } from "../lib/pending-expenses";
import { invalidateExpenseData } from "../lib/expense-cache";
import { enqueueExpenseDraft } from "../lib/register-expense-mutation";
import { ExpenseSessionError } from "@/core/query/session-runtime";
import type { Category } from "@/features/categories/interfaces";
import { isInCurrentCycle } from "@/core/utils/budget-cycle";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteExpenseAction, getCycleExpensesAction, updateExpenseAction } from "../actions";
import type { DeleteExpenseInput, ExpenseInput } from "../interfaces";

const EXPENSES_STALE_MS = 30 * 1000;

export function useCycleExpenses(cycleStartedAt: string | undefined) {
  const pending = usePendingExpenses();
  const result = useQuery({
    queryKey: queryKeys.expenses.cycle(cycleStartedAt ?? ""),
    queryFn: () => getCycleExpensesAction(cycleStartedAt ?? ""),
    enabled: !!cycleStartedAt && pending.length === 0,
    staleTime: EXPENSES_STALE_MS,
  });
  const local = pending
    .map((entry) => entry.expense)
    .filter((expense) => cycleStartedAt && isInCurrentCycle(expense.date, cycleStartedAt));
  return {
    isLoading: result.isLoading,
    refetch: result.refetch,
    isPending: result.isPending,
    isError: result.isError,
    data: result.data || local.length ? mergePending(result.data ?? [], local) : undefined,
  };
}

export function useCreateExpense() {
  const { userId } = useAuthStore();
  return {
    enqueue: async (input: ExpenseInput) => {
      if (!userId) return Promise.reject(new ExpenseSessionError());
      const category = queryClient
        .getQueryData<Category[]>(queryKeys.categories.all)
        ?.find((item) => item.id === input.categoryId);
      const id = randomUUID();
      const date = new Date().toISOString();
      return enqueueExpenseDraft(queryClient, {
        userId,
        input: { ...input, id, date },
        optimisticExpense: {
          ...input,
          id,
          date,
          creditId: input.creditId ?? null,
          category: category
            ? { id: category.id, name: category.name, color: category.color }
            : null,
        },
      });
    },
  };
}

export function useUpdateExpense() {
  return useMutation({
    networkMode: "always",
    retry: false,
    mutationFn: updateExpenseAction,
    onSuccess: (_expense, { input, previousCreditId }) =>
      invalidateExpenseData(queryClient, [previousCreditId, input.creditId]),
  });
}

export function useDeleteExpense() {
  return useMutation({
    networkMode: "always",
    retry: false,
    mutationFn: ({ id }: DeleteExpenseInput) => deleteExpenseAction(id),
    onSuccess: (_data, { creditId }) => invalidateExpenseData(queryClient, [creditId]),
  });
}

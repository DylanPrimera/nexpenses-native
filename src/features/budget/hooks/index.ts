import {
  useExpenseReceipts,
  usePendingExpenses,
} from "@/features/expenses/hooks/usePendingExpenses";
import { budgetPercentage, isInCurrentCycle } from "@/core/utils/budget-cycle";
import { queryClient, queryKeys } from "@/core/query";
import { onlineManager, useMutation, useQuery } from "@tanstack/react-query";
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
  const pending = usePendingExpenses();
  const receipts = useExpenseReceipts();
  const result = useQuery({
    queryKey: queryKeys.summary.cycle,
    queryFn: getCycleSummaryAction,
    enabled: pending.length === 0,
    staleTime: SUMMARY_STALE_MS,
  });
  const refetch = pending.length || !onlineManager.isOnline() ? async () => result : result.refetch;
  if (!result.data)
    return { data: result.data, refetch, isPending: result.isPending, isError: result.isError };
  const local = pending.filter(
    (entry) =>
      !receipts.some((receipt) => receipt.expense.id === entry.expense.id) &&
      isInCurrentCycle(entry.expense.date, result.data!.cycleStartedAt),
  );
  const summary = result.data;
  const spent = summary.spent + local.reduce((sum, entry) => sum + entry.expense.amount, 0);
  return {
    refetch,
    isError: result.isError,
    isPending: result.isPending,
    data: {
      ...summary,
      spent,
      expenseCount: summary.expenseCount + local.length,
      remaining: summary.budget - spent,
      percentage: budgetPercentage(spent, summary.budget),
      isOverBudget: spent > summary.budget,
    },
  };
}

export function useUpdateBudget() {
  return useMutation({
    networkMode: "always",
    retry: false,
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

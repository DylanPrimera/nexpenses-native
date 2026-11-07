import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/core/query/query-keys";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { PendingExpense, ExpenseReceipt } from "../interfaces";

export function usePendingExpenses() {
  const { userId } = useAuthStore();
  const { data = [] } = useQuery<PendingExpense[]>({
    queryKey: queryKeys.expenses.pending(userId ?? ""),
    queryFn: () => [],
    initialData: [],
    enabled: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  return data;
}

export function useExpenseReceipts() {
  const { userId } = useAuthStore();
  const { data = [] } = useQuery<ExpenseReceipt[]>({
    queryKey: queryKeys.history.receipts(userId ?? ""),
    queryFn: () => [],
    initialData: [],
    enabled: false,
    staleTime: Infinity,
  });
  return data;
}

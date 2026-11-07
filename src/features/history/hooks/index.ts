import {
  useExpenseReceipts,
  usePendingExpenses,
} from "@/features/expenses/hooks/usePendingExpenses";
import { pendingForHistory, projectHistoryRows } from "@/features/expenses/lib/history-projection";
import { queryKeys } from "@/core/query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getHistoryPageAction, getMonthExpensesAction, getMonthTotalAction } from "../actions";
import { HISTORY_PAGE_SIZE, type HistoryFilters, type HistoryMonth } from "../interfaces";
import { historyQueryParams } from "../lib/history-filters";

const HISTORY_STALE_MS = 30 * 1000;

export function useHistoryExpenses(month: HistoryMonth, filters: HistoryFilters, enabled: boolean) {
  const pending = usePendingExpenses();
  const receipts = useExpenseReceipts();
  const result = useInfiniteQuery({
    queryKey: queryKeys.history.list(month, filters),
    queryFn: ({ pageParam }) =>
      getHistoryPageAction(
        historyQueryParams(month, filters, { limit: HISTORY_PAGE_SIZE, offset: pageParam }),
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((sum, page) => sum + page.items.length, 0);
      return lastPage.items.length > 0 && loaded < lastPage.total ? loaded : undefined;
    },
    enabled: enabled && pending.length === 0,
    staleTime: HISTORY_STALE_MS,
  });
  const server = result.data?.pages.flatMap((page) => page.items) ?? [];
  const local = pendingForHistory(
    pending.map((entry) => entry.expense),
    month,
    filters,
  );
  const acknowledged = pendingForHistory(
    receipts
      .filter((receipt) => receipt.acknowledgedAt > result.dataUpdatedAt)
      .map((receipt) => receipt.expense),
    month,
    filters,
  );
  const projected = projectHistoryRows(server, [...local, ...acknowledged]);
  const last = result.data?.pages[result.data.pages.length - 1];
  return {
    data: result.data,
    isError: result.isError,
    isPending: result.isPending,
    refetch: result.refetch,
    hasNextPage: result.hasNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
    isFetchNextPageError: result.isFetchNextPageError,
    fetchNextPage: result.fetchNextPage,
    items: projected.items,
    projectedTotal: last ? last.total + projected.count : projected.count,
    projectedAmount: last ? last.totalAmount + projected.amount : projected.amount,
    hasLocal: local.length > 0,
  };
}

export function useHistoryMonthExpenses(month: HistoryMonth, enabled: boolean) {
  const pending = usePendingExpenses();
  const receipts = useExpenseReceipts();
  const result = useQuery({
    queryKey: queryKeys.history.month(month),
    queryFn: () => getMonthExpensesAction(month),
    enabled: enabled && pending.length === 0,
    staleTime: HISTORY_STALE_MS,
  });
  const local = pendingForHistory(
    [
      ...pending.map((entry) => entry.expense),
      ...receipts
        .filter((receipt) => receipt.acknowledgedAt > result.dataUpdatedAt)
        .map((receipt) => receipt.expense),
    ],
    month,
  );
  return {
    isError: result.isError,
    isPending: result.isPending,
    refetch: result.refetch,
    hasServerData: !!result.data,
    data:
      result.data || local.length ? projectHistoryRows(result.data ?? [], local).items : undefined,
  };
}

export function useHistoryMonthTotal(month: HistoryMonth, enabled: boolean) {
  const pending = usePendingExpenses();
  const receipts = useExpenseReceipts();
  const result = useQuery({
    queryKey: queryKeys.history.count(month),
    queryFn: () => getMonthTotalAction(month),
    enabled: enabled && pending.length === 0,
    staleTime: HISTORY_STALE_MS,
  });
  const local = pendingForHistory(
    [
      ...pending.map((entry) => entry.expense),
      ...receipts
        .filter((receipt) => receipt.acknowledgedAt > result.dataUpdatedAt)
        .map((receipt) => receipt.expense),
    ],
    month,
  );
  return {
    refetch: result.refetch,
    data: result.data !== undefined ? result.data + local.length : undefined,
  };
}

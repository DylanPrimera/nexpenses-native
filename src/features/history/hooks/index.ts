import { queryKeys } from "@/core/query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getHistoryPageAction, getMonthExpensesAction, getMonthTotalAction } from "../actions";
import { HISTORY_PAGE_SIZE, type HistoryFilters, type HistoryMonth } from "../interfaces";
import { historyQueryParams } from "../lib/history-filters";

const HISTORY_STALE_MS = 30 * 1000;

export function useHistoryExpenses(month: HistoryMonth, filters: HistoryFilters, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: queryKeys.history.list(month, filters),
    queryFn: ({ pageParam }) =>
      getHistoryPageAction(historyQueryParams(month, filters, { limit: HISTORY_PAGE_SIZE, offset: pageParam })),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce((sum, page) => sum + page.items.length, 0);
      return lastPage.items.length > 0 && loaded < lastPage.total ? loaded : undefined;
    },
    enabled,
    staleTime: HISTORY_STALE_MS,
  });
}

export function useHistoryMonthExpenses(month: HistoryMonth, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.history.month(month),
    queryFn: () => getMonthExpensesAction(month),
    enabled,
    staleTime: HISTORY_STALE_MS,
  });
}

export function useHistoryMonthTotal(month: HistoryMonth, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.history.count(month),
    queryFn: () => getMonthTotalAction(month),
    enabled,
    staleTime: HISTORY_STALE_MS,
  });
}

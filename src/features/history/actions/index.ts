import { apiClient } from "@/core/api/api-client";
import { EXPENSE_PATHS, type Expense, type ExpenseListResponse } from "@/features/expenses/interfaces";
import {
  HISTORY_MONTH_PAGE_LIMIT,
  type HistoryFilters,
  type HistoryMonth,
  type HistoryQueryParams,
} from "../interfaces";
import { EMPTY_HISTORY_FILTERS, historyQueryParams } from "../lib/history-filters";

export async function getHistoryPageAction(params: HistoryQueryParams): Promise<ExpenseListResponse> {
  const { data } = await apiClient.get<ExpenseListResponse>(EXPENSE_PATHS.list, { params });
  return data;
}

export async function getMonthTotalAction(month: HistoryMonth): Promise<number> {
  const page = await getHistoryPageAction(historyQueryParams(month, EMPTY_HISTORY_FILTERS, { limit: 1, offset: 0 }));
  return page.total;
}

export async function getMonthExpensesAction(
  month: HistoryMonth,
  filters: HistoryFilters = EMPTY_HISTORY_FILTERS,
): Promise<Expense[]> {
  const items: Expense[] = [];
  let total = 0;
  do {
    const page = await getHistoryPageAction(
      historyQueryParams(month, filters, { limit: HISTORY_MONTH_PAGE_LIMIT, offset: items.length }),
    );
    total = page.total;
    if (page.items.length === 0) break;
    items.push(...page.items);
  } while (items.length < total);
  return items;
}

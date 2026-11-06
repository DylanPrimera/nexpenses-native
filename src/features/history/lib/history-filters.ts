import type { HistoryFilters, HistoryMonth, HistoryQueryParams } from "../interfaces";
import { HISTORY_SEARCH_MAX } from "../interfaces";

export const EMPTY_HISTORY_FILTERS: HistoryFilters = {
  categoryId: "",
  paymentType: "all",
  search: "",
};

export function hasActiveFilters(filters: HistoryFilters) {
  return filters.categoryId !== "" || filters.paymentType !== "all" || filters.search.trim() !== "";
}

export function historyQueryParams(
  { year, month }: HistoryMonth,
  filters: HistoryFilters,
  page: { limit: number; offset: number },
): HistoryQueryParams {
  const params: HistoryQueryParams = { year, month, limit: page.limit, offset: page.offset };
  const search = filters.search.trim().slice(0, HISTORY_SEARCH_MAX);
  if (filters.categoryId) params.categoryId = filters.categoryId;
  if (filters.paymentType !== "all") params.paymentType = filters.paymentType;
  if (search) params.search = search;
  return params;
}

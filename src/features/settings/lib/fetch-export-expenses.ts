import { queryClient } from "@/core/query";
import { queryKeys } from "@/core/query/query-keys";
import type { Expense, ExpenseListResponse } from "@/features/expenses/interfaces";
import { getExportPageAction, type ExportPageParams } from "../actions";
import { EXPORT_PAGE_LIMIT, type ExportScope } from "../interfaces";
import { exportScopeKey } from "./export-scope";

export const EXPORT_STALE_TIME_MS = 60_000;

export class IncompleteExportError extends Error {
  constructor() {
    super("Incomplete expense export");
    this.name = "IncompleteExportError";
  }
}

export type ExportPageFetcher = (params: ExportPageParams) => Promise<ExpenseListResponse>;

function dateMs(expense: Expense) {
  return new Date(expense.date).getTime();
}

export async function fetchExportExpenses(
  scope: ExportScope,
  fetchPage: ExportPageFetcher = getExportPageAction,
): Promise<Expense[]> {
  const base: Pick<ExportPageParams, "year" | "month"> =
    scope.kind === "month" ? { year: scope.year, month: scope.month } : {};
  const cycleStartMs = scope.kind === "cycle" ? new Date(scope.cycleStartedAt).getTime() : null;
  const collected = new Map<string, Expense>();
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;
  let reachedBoundary = false;

  while (offset < total && !reachedBoundary) {
    const page = await fetchPage({ ...base, limit: EXPORT_PAGE_LIMIT, offset });
    total = page.total;
    if (page.items.length === 0) break;
    for (const expense of page.items) collected.set(expense.id, expense);
    offset += page.items.length;
    const last = page.items[page.items.length - 1];
    if (cycleStartMs !== null && dateMs(last) < cycleStartMs) reachedBoundary = true;
  }

  if (!reachedBoundary && (offset < total || collected.size < total)) {
    throw new IncompleteExportError();
  }

  const items = [...collected.values()];
  if (cycleStartMs === null) return items;
  return items.filter((expense) => dateMs(expense) >= cycleStartMs);
}

export function loadExportExpenses(scope: ExportScope): Promise<Expense[]> {
  return queryClient.fetchQuery({
    queryKey: queryKeys.expenses.export(exportScopeKey(scope)),
    queryFn: () => fetchExportExpenses(scope),
    staleTime: EXPORT_STALE_TIME_MS,
  });
}

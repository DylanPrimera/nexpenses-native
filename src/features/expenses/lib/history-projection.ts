import { localMonthOf } from "@/core/utils/budget-cycle";
import type { Expense } from "../interfaces";
import { mergePending } from "./pending-expenses";

export function pendingForHistory(
  pending: Expense[],
  month: { year: number; month: number },
  filters = { categoryId: "", paymentType: "all", search: "" },
) {
  const search = filters.search.trim().toLowerCase();
  return mergePending([], pending).filter((expense) => {
    const target = localMonthOf(expense.date);
    return (
      target.year === month.year &&
      target.month === month.month &&
      (!filters.categoryId || expense.categoryId === filters.categoryId) &&
      (filters.paymentType === "all" || expense.paymentType === filters.paymentType) &&
      (!search ||
        (expense.title ?? "").toLowerCase().includes(search) ||
        (expense.description ?? "").toLowerCase().includes(search))
    );
  });
}
export function projectHistoryRows(server: Expense[], pending: Expense[]) {
  const ids = new Set(server.map((expense) => expense.id));
  const extra = mergePending([], pending).filter((expense) => !ids.has(expense.id));
  return {
    items: mergePending(server, pending),
    count: extra.length,
    amount: extra.reduce((sum, expense) => sum + expense.amount, 0),
  };
}

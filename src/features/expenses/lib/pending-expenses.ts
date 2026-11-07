import type { Expense, PendingExpense } from "../interfaces";

export function mergePending(server: Expense[], pending: Expense[]) {
  return [
    ...new Map([...pending, ...server].map((expense) => [expense.id, expense])).values(),
  ].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}
export function putPending(items: PendingExpense[], item: PendingExpense) {
  return [...items.filter((entry) => entry.expense.id !== item.expense.id), item];
}
export function dropPending(items: PendingExpense[], id: string) {
  return items.filter((entry) => entry.expense.id !== id);
}

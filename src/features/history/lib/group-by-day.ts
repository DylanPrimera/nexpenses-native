import { localDayKey } from "@/core/utils/budget-cycle";
import type { Expense } from "@/features/expenses/interfaces";
import type { DayGroup } from "../interfaces";

export function groupExpensesByDay(expenses: Expense[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const expense of expenses) {
    const key = localDayKey(expense.date);
    const last = groups[groups.length - 1];
    if (last?.key === key) {
      last.items.push(expense);
      last.total += expense.amount;
    } else {
      groups.push({ key, total: expense.amount, items: [expense] });
    }
  }
  return groups;
}

export function expenseDayKeys(expenses: Expense[]) {
  return new Set(expenses.map((expense) => localDayKey(expense.date)));
}

export function expensesOfDay(expenses: Expense[], key: string) {
  return expenses.filter((expense) => localDayKey(expense.date) === key);
}

export function sumAmounts(expenses: Expense[]) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

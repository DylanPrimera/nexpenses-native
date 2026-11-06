import { apiClient } from "@/core/api/api-client";
import { filterCycleExpenses } from "@/core/utils/budget-cycle";
import {
  CYCLE_EXPENSES_LIMIT,
  EXPENSE_PATHS,
  type Expense,
  type ExpenseInput,
  type ExpenseListResponse,
} from "../interfaces";

export async function getCycleExpensesAction(cycleStartedAt: string): Promise<Expense[]> {
  const { data } = await apiClient.get<ExpenseListResponse>(EXPENSE_PATHS.list, {
    params: { limit: CYCLE_EXPENSES_LIMIT },
  });
  return filterCycleExpenses(data?.items ?? [], cycleStartedAt);
}

export async function createExpenseAction(input: ExpenseInput): Promise<Expense> {
  const { data } = await apiClient.post<Expense>(EXPENSE_PATHS.list, input);
  return data;
}

export async function updateExpenseAction({ id, input }: { id: string; input: ExpenseInput }): Promise<Expense> {
  const { data } = await apiClient.patch<Expense>(EXPENSE_PATHS.detail(id), input);
  return data;
}

export async function deleteExpenseAction(id: string): Promise<void> {
  await apiClient.delete(EXPENSE_PATHS.detail(id));
}

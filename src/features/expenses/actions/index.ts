import { requireOnline } from "@/core/network/require-online";
import { apiClient } from "@/core/api/api-client";
import { filterCycleExpenses } from "@/core/utils/budget-cycle";
import {
  CYCLE_EXPENSES_LIMIT,
  EXPENSE_PATHS,
  type Expense,
  type CreateExpenseInput,
  type ExpenseListResponse,
  type UpdateExpenseInput,
} from "../interfaces";

export async function getCycleExpensesAction(cycleStartedAt: string): Promise<Expense[]> {
  const { data } = await apiClient.get<ExpenseListResponse>(EXPENSE_PATHS.list, {
    params: { limit: CYCLE_EXPENSES_LIMIT },
  });
  return filterCycleExpenses(data?.items ?? [], cycleStartedAt);
}

export async function createExpenseAction(
  input: CreateExpenseInput,
  signal?: AbortSignal,
  expectedUserId?: string,
): Promise<Expense> {
  const { data } = await apiClient.post<Expense>(EXPENSE_PATHS.list, input, {
    signal,
    timeout: 30000,
    expectedUserId,
  });
  return data;
}

export async function updateExpenseAction({ id, input }: UpdateExpenseInput): Promise<Expense> {
  requireOnline();
  const { data } = await apiClient.patch<Expense>(EXPENSE_PATHS.detail(id), input);
  return data;
}

export async function deleteExpenseAction(id: string): Promise<void> {
  requireOnline();
  await apiClient.delete(EXPENSE_PATHS.detail(id));
}

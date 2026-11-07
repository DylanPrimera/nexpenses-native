import { notifyManager, type QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/core/query/query-keys";
import { getQuerySession, assertQuerySession } from "@/core/query/session-runtime";
import { budgetPercentage, isInCurrentCycle } from "@/core/utils/budget-cycle";
import type { CycleSummary } from "@/features/budget/interfaces";
import type {
  CreateExpenseVariables,
  Expense,
  PendingExpense,
  ExpenseReceipt,
} from "../interfaces";
import { dropPending, mergePending, putPending } from "./pending-expenses";

export function readPending(client: QueryClient, userId: string) {
  return client.getQueryData<PendingExpense[]>(queryKeys.expenses.pending(userId)) ?? [];
}
export function isActiveExpenseSession(client: QueryClient, variables: CreateExpenseVariables) {
  return (
    getQuerySession().userId === variables.userId &&
    readPending(client, variables.userId).some((entry) => entry.expense.id === variables.input.id)
  );
}
export async function addPendingExpense(client: QueryClient, variables: CreateExpenseVariables) {
  const version = getQuerySession().generation;
  await Promise.all(
    ["expenses", "summary", "history"].map((root) => client.cancelQueries({ queryKey: [root] })),
  );
  assertQuerySession(variables.userId, version);
  client.setQueryData<PendingExpense[]>(queryKeys.expenses.pending(variables.userId), (old = []) =>
    putPending(old, { userId: variables.userId, expense: variables.optimisticExpense }),
  );
  for (const [key, current] of client.getQueriesData<Expense[]>({
    queryKey: ["expenses", "cycle"],
  })) {
    if (current && isInCurrentCycle(variables.input.date, String(key[2])))
      client.setQueryData(key, mergePending(current, [variables.optimisticExpense]));
  }
}
export function invalidateExpenseData(
  client: QueryClient,
  creditIds: readonly (string | null | undefined)[] = [],
) {
  for (const root of ["expenses", "summary", "categories", "history", "recurring"])
    void client.invalidateQueries({ queryKey: [root] });
  if (creditIds.some(Boolean)) {
    void client.invalidateQueries({ queryKey: queryKeys.credits.total });
    void client.invalidateQueries({ queryKey: queryKeys.credits.list });
    for (const id of new Set(creditIds.filter(Boolean)))
      void client.invalidateQueries({ queryKey: queryKeys.credits.detail(id!) });
  }
}
export function acknowledgeExpense(
  client: QueryClient,
  variables: CreateExpenseVariables,
  expense: Expense,
) {
  if (!isActiveExpenseSession(client, variables)) return;
  const alreadyAcknowledged = client
    .getQueryData<ExpenseReceipt[]>(queryKeys.history.receipts(variables.userId))
    ?.some((receipt) => receipt.expense.id === expense.id);
  notifyManager.batch(() => {
    client.setQueryData<ExpenseReceipt[]>(
      queryKeys.history.receipts(variables.userId),
      (old = []) => [
        ...old.filter(
          (item) =>
            item.expense.id !== expense.id &&
            item.acknowledgedAt >= Date.now() - 7 * 24 * 60 * 60 * 1000,
        ),
        { expense, acknowledgedAt: Date.now() },
      ],
    );
    client.setQueryData<CycleSummary>(queryKeys.summary.cycle, (summary) => {
      if (
        alreadyAcknowledged ||
        !summary ||
        !isInCurrentCycle(expense.date, summary.cycleStartedAt)
      )
        return summary;
      const spent = summary.spent + expense.amount;
      return {
        ...summary,
        spent,
        expenseCount: summary.expenseCount + 1,
        remaining: summary.budget - spent,
        percentage: budgetPercentage(spent, summary.budget),
        isOverBudget: spent > summary.budget,
      };
    });
    for (const [key, current] of client.getQueriesData<Expense[]>({
      queryKey: ["expenses", "cycle"],
    })) {
      if (current)
        client.setQueryData(
          key,
          current.map((row) => (row.id === expense.id ? expense : row)),
        );
    }
    client.setQueryData<PendingExpense[]>(
      queryKeys.expenses.pending(variables.userId),
      (old = []) => dropPending(old, expense.id),
    );
  });
  if (readPending(client, variables.userId).length === 0)
    invalidateExpenseData(client, [variables.input.creditId]);
  else if (variables.input.creditId) {
    void client.invalidateQueries({ queryKey: queryKeys.credits.all, refetchType: "active" });
  }
}
export function rejectPendingExpense(client: QueryClient, variables: CreateExpenseVariables) {
  client.setQueryData<PendingExpense[]>(queryKeys.expenses.pending(variables.userId), (old = []) =>
    dropPending(old, variables.input.id),
  );
  for (const [key, current] of client.getQueriesData<Expense[]>({
    queryKey: ["expenses", "cycle"],
  })) {
    if (current)
      client.setQueryData(
        key,
        current.filter((row) => row.id !== variables.input.id),
      );
  }
  if (!readPending(client, variables.userId).length)
    invalidateExpenseData(client, [variables.input.creditId]);
}

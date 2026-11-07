import { type QueryClient } from "@tanstack/react-query";
import { isApiError } from "@/core/api/envelope";
import { isNetworkError } from "@/core/api/is-network-error";
import { queryKeys } from "@/core/query/query-keys";
import { getSessionPersistence } from "@/core/query/query-persistence";
import {
  assertQuerySession,
  createExpenseRequest,
  ExpenseSessionError,
  getQuerySession,
} from "@/core/query/session-runtime";
import { messages } from "@/shared/i18n";
import { notifyError } from "@/shared/toast/notify";
import { createExpenseAction } from "../actions";
import type { CreateExpenseVariables, Expense } from "../interfaces";
import {
  acknowledgeExpense,
  addPendingExpense,
  isActiveExpenseSession,
  rejectPendingExpense,
} from "./expense-cache";

const registered = new WeakSet<QueryClient>();
const localErrors = new WeakSet<object>();
const acceptances = new Map<
  string,
  { resolve: () => void; reject: (error: unknown) => void; generation: number }
>();
export function shouldRetryExpense(_count: number, error: unknown) {
  if (error instanceof ExpenseSessionError) return false;
  return isNetworkError(error) || (isApiError(error) && error.status >= 500);
}
export function registerExpenseMutation(client: QueryClient) {
  if (registered.has(client)) return;
  registered.add(client);
  client.setMutationDefaults<Expense, Error, CreateExpenseVariables>(queryKeys.expenses.create, {
    networkMode: "online",
    scope: { id: "expenses-create" },
    gcTime: Infinity,
    retry: shouldRetryExpense,
    retryDelay: (attempt) => Math.min(1000 * 2 ** Math.min(attempt, 5), 30000),
    mutationFn: async (variables) => {
      if (!isActiveExpenseSession(client, variables)) throw new ExpenseSessionError();
      const request = createExpenseRequest(variables.userId);
      try {
        const result = await createExpenseAction(
          variables.input,
          request.controller.signal,
          variables.userId,
        );
        assertQuerySession(variables.userId, request.version);
        return result;
      } finally {
        request.release();
      }
    },
    onMutate: async (variables) => {
      try {
        const acceptance = acceptances.get(variables.input.id);
        assertQuerySession(variables.userId, acceptance?.generation);
        await addPendingExpense(client, variables);
        await getSessionPersistence(variables.userId, client).flush();
        acceptances.get(variables.input.id)?.resolve();
      } catch (error) {
        if (error && typeof error === "object") localErrors.add(error);
        acceptances.get(variables.input.id)?.reject(error);
        throw error;
      } finally {
        acceptances.delete(variables.input.id);
      }
    },
    onSuccess: async (expense, variables) => {
      if (!isActiveExpenseSession(client, variables)) return;
      const session = getQuerySession();
      acknowledgeExpense(client, variables, expense);
      await getSessionPersistence(variables.userId, client)
        .flush()
        .catch(() => {
          const current = getQuerySession();
          if (current.userId === variables.userId && current.generation === session.generation)
            notifyError(messages.Offline.local_failure);
        });
    },
    onError: async (error, variables) => {
      const acceptance = acceptances.get(variables.input.id);
      acceptance?.reject(error);
      acceptances.delete(variables.input.id);
      if (error instanceof ExpenseSessionError || !isActiveExpenseSession(client, variables))
        return;
      const session = getQuerySession();
      rejectPendingExpense(client, variables);
      await getSessionPersistence(variables.userId, client)
        .flush()
        .catch(() => undefined);
      const current = getQuerySession();
      if (
        localErrors.has(error) ||
        current.userId !== variables.userId ||
        current.generation !== session.generation
      )
        return;
      notifyError(
        isApiError(error) && error.status >= 400 && error.status < 500
          ? messages.Offline.discarded
          : messages.Offline.local_failure,
      );
    },
  });
}
export function enqueueExpenseDraft(client: QueryClient, variables: CreateExpenseVariables) {
  registerExpenseMutation(client);
  return new Promise<void>((resolve, reject) => {
    acceptances.set(variables.input.id, {
      resolve,
      reject,
      generation: getQuerySession().generation,
    });
    const mutation = client
      .getMutationCache()
      .build<Expense, Error, CreateExpenseVariables, unknown>(client, {
        mutationKey: queryKeys.expenses.create,
      });
    void mutation.execute(variables).catch(() => undefined);
  });
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import appConfig from "../../../app.json";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  dehydrate,
  hydrate,
  type DehydratedState,
  type Query,
  type QueryClient,
  type Mutation,
} from "@tanstack/react-query";
import {
  persistQueryClientSave,
  type PersistedClient,
  type Persister,
} from "@tanstack/react-query-persist-client";
import { z } from "zod";
import { getQuerySession, assertQuerySession } from "./session-runtime";
import { queryKeys } from "./query-keys";
import type { PendingExpense, CreateExpenseVariables } from "@/features/expenses/interfaces";

export const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const OFFLINE_SCHEMA = "offline-v1";
const sessions = new Map<string, ReturnType<typeof createPersistence>>();

export function isPersistableQuery(query: Query) {
  if (query.state.status !== "success") return false;
  const [root, kind] = query.queryKey;
  return (
    (root === "user" && kind === "profile") ||
    root === "summary" ||
    root === "categories" ||
    root === "recurring" ||
    (root === "expenses" && (kind === "cycle" || kind === "pending")) ||
    root === "history"
  );
}

const expenseSchema = z
  .object({
    id: z.uuidv4(),
    amount: z.number().int().min(1).max(100000000),
    categoryId: z.uuid(),
    title: z.string().trim().min(1).max(80),
    description: z.string().trim().min(1).max(100),
    paymentType: z.enum(["cash", "debit_card", "credit_card"]),
    date: z.iso.datetime(),
    creditId: z.uuid().nullable().optional(),
    saveAsRecurring: z.boolean().optional(),
    advanceInstallment: z.literal(true).optional(),
  })
  .strict();
const variablesSchema = z
  .object({
    userId: z.string().min(1),
    input: expenseSchema,
    optimisticExpense: z
      .object({
        id: z.uuidv4(),
        amount: z.number(),
        categoryId: z.string(),
        title: z.string().nullable(),
        description: z.string().nullable(),
        date: z.string(),
        paymentType: z.enum(["cash", "debit_card", "credit_card"]),
        creditId: z.string().nullable(),
        category: z
          .object({ id: z.string(), name: z.string(), color: z.string() })
          .nullable()
          .optional(),
      })
      .strict(),
  })
  .strict()
  .refine((value) => value.input.id === value.optimisticExpense.id);

function createPersistence(userId: string, client: QueryClient) {
  const generation = getQuerySession().generation;
  const key = `nexpenses-query:${userId}`;
  const outboxKey = `nexpenses-expense-outbox:${userId}`;
  const buster = `${appConfig.expo.version ?? "0"}:${OFFLINE_SCHEMA}:${userId}`;
  let enabled = true;
  let recovering = true;
  let outboxBlocked = false;
  let tail: Promise<unknown> = Promise.resolve();
  function active() {
    const current = getQuerySession();
    return enabled && current.userId === userId && current.generation === generation;
  }
  function serializeWrite(action: () => Promise<void>) {
    const next = tail
      .catch(() => undefined)
      .then(async () => {
        if (active()) await action();
      });
    tail = next;
    return next;
  }
  const storage = {
    getItem: (name: string) => AsyncStorage.getItem(name),
    setItem: async (name: string, data: string) => {
      await serializeWrite(async () => {
        const snapshot = JSON.parse(data) as PersistedClient;
        const outboxSaved = !recovering && !outboxBlocked;
        if (outboxSaved) {
          await AsyncStorage.setItem(
            outboxKey,
            JSON.stringify({ schema: 1, mutations: snapshot.clientState.mutations }),
          );
        }
        if (active()) {
          try {
            await AsyncStorage.setItem(name, data);
          } catch (error) {
            if (!outboxSaved) throw error;
          }
        }
      });
    },
    removeItem: async (name: string) => {
      await serializeWrite(() => AsyncStorage.removeItem(name));
    },
  };
  const underlying = createAsyncStoragePersister({ storage, key, throttleTime: 0 });
  const persister: Persister = {
    restoreClient: underlying.restoreClient,
    removeClient: underlying.removeClient,
    persistClient: async (snapshot) => {
      if (!active()) return;
      const pending =
        client.getQueryData<PendingExpense[]>(queryKeys.expenses.pending(userId)) ?? [];
      const ids = new Set(pending.map((entry) => entry.expense.id));
      const mutations = snapshot.clientState.mutations
        .filter((mutation) => {
          const variables = mutation.state.variables as CreateExpenseVariables | undefined;
          return variables?.userId === userId && ids.has(variables.input.id);
        })
        .map((mutation) => ({
          ...mutation,
          state: { ...mutation.state, isPaused: true, error: null, failureReason: null },
        }));
      const safe = { ...snapshot, clientState: { ...snapshot.clientState, mutations } };
      await storage.setItem(key, JSON.stringify(safe));
    },
  };
  const options = {
    persister,
    buster,
    maxAge: CACHE_MAX_AGE,
    dehydrateOptions: {
      shouldDehydrateQuery: isPersistableQuery,
      shouldDehydrateMutation: (mutation: Mutation) =>
        mutation.options.mutationKey?.[0] === "expenses" &&
        mutation.options.mutationKey?.[1] === "create" &&
        mutation.state.status === "pending",
    },
  };
  async function flush() {
    assertQuerySession(userId, generation);
    if (outboxBlocked) throw new Error("outbox-blocked");
    await persistQueryClientSave({ queryClient: client, ...options });
    await tail;
    assertQuerySession(userId, generation);
  }
  async function restore() {
    try {
      const raw = await AsyncStorage.getItem(outboxKey);
      assertQuerySession(userId, generation);
      const parsed = raw ? JSON.parse(raw) : { schema: 1, mutations: [] };
      if (parsed.schema !== 1 || !Array.isArray(parsed.mutations))
        throw new Error("invalid-outbox");
      const stored = parsed.mutations as DehydratedState["mutations"];
      const hydrated = dehydrate(client, {
        shouldDehydrateQuery: () => false,
        shouldDehydrateMutation: () => true,
      }).mutations;
      const combined = new Map<string, DehydratedState["mutations"][number]>();
      for (const mutation of [...stored, ...hydrated]) {
        const result = variablesSchema.safeParse(mutation.state?.variables);
        if (
          !result.success ||
          result.data.userId !== userId ||
          mutation.mutationKey?.[0] !== "expenses" ||
          mutation.mutationKey?.[1] !== "create"
        )
          throw new Error("invalid-outbox");
        if (mutation.state.status !== "pending") continue;
        const variables = result.data;
        combined.set(variables.input.id, {
          ...mutation,
          scope: { id: "expenses-create" },
          state: { ...mutation.state, variables, isPaused: true, error: null, failureReason: null },
        });
      }
      const mutations = [...combined.values()].sort(
        (a, b) => a.state.submittedAt - b.state.submittedAt,
      );
      const existing = new Set(
        client
          .getMutationCache()
          .getAll()
          .map(
            (mutation) =>
              (mutation.state.variables as CreateExpenseVariables | undefined)?.input?.id,
          ),
      );
      hydrate(client, {
        queries: [],
        mutations: mutations.filter(
          (mutation) =>
            !existing.has((mutation.state.variables as CreateExpenseVariables).input.id),
        ),
      });
      client.setQueryData<PendingExpense[]>(
        queryKeys.expenses.pending(userId),
        mutations.map((mutation) => {
          const variables = mutation.state.variables as CreateExpenseVariables;
          return { userId, expense: variables.optimisticExpense };
        }),
      );
      recovering = false;
      await flush();
    } catch (error) {
      outboxBlocked = true;
      recovering = false;
      for (const mutation of client.getMutationCache().getAll()) {
        if (mutation.options.mutationKey?.[0] === "expenses")
          client.getMutationCache().remove(mutation);
      }
      client.setQueryData(queryKeys.expenses.pending(userId), []);
      throw error;
    }
  }
  return {
    options,
    flush,
    restore,
    active,
    disable: () => {
      enabled = false;
    },
    drain: () => tail.catch(() => undefined),
    key,
    outboxKey,
  };
}

export function getSessionPersistence(userId: string, client: QueryClient) {
  let session = sessions.get(userId);
  if (!session || !session.active()) {
    session = createPersistence(userId, client);
    sessions.set(userId, session);
  }
  return session;
}
export async function purgeQueryPersistence(userId?: string) {
  if (!userId) return;
  const session = sessions.get(userId);
  session?.disable();
  await session?.drain();
  await AsyncStorage.multiRemove([
    `nexpenses-query:${userId}`,
    `nexpenses-expense-outbox:${userId}`,
  ]);
  sessions.delete(userId);
}

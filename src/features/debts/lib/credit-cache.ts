import { queryClient, queryKeys } from "@/core/query";

type CreditId = string | null | undefined;

export function invalidateCreditData(ids: readonly CreditId[]) {
  const unique = [...new Set(ids.filter((id): id is string => !!id))];
  if (unique.length === 0) return Promise.resolve();
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.credits.total }),
    queryClient.invalidateQueries({ queryKey: queryKeys.credits.list }),
    ...unique.map((id) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.credits.detail(id) }),
    ),
  ]);
}

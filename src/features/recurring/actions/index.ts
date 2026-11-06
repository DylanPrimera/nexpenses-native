import { apiClient } from "@/core/api/api-client";
import {
  RECURRING_PAGE_LIMIT,
  RECURRING_PATHS,
  type RecurringExpense,
  type RecurringList,
} from "../interfaces";

export async function getRecurringAction(): Promise<RecurringExpense[]> {
  const items: RecurringExpense[] = [];
  let total = 0;
  do {
    const { data } = await apiClient.get<RecurringList>(RECURRING_PATHS.list, {
      params: { limit: RECURRING_PAGE_LIMIT, offset: items.length },
    });
    total = data?.total ?? 0;
    if (!data?.items?.length) break;
    items.push(...data.items);
  } while (items.length < total);
  return items;
}

export async function deleteRecurringAction(id: string): Promise<void> {
  await apiClient.delete(RECURRING_PATHS.detail(id));
}

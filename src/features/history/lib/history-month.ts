import { localMonthOf } from "@/core/utils/budget-cycle";
import { dayjs } from "@/core/utils/dates";
import { messages, tx } from "@/shared/i18n";
import type { HistoryMonth } from "../interfaces";

export function currentHistoryMonth(now: number | Date = Date.now()): HistoryMonth {
  return localMonthOf(now);
}

export function shiftHistoryMonth({ year, month }: HistoryMonth, step: number): HistoryMonth {
  const index = year * 12 + (month - 1) + step;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

export function isSameHistoryMonth(a: HistoryMonth, b: HistoryMonth) {
  return a.year === b.year && a.month === b.month;
}

export function isAfterHistoryMonth(a: HistoryMonth, b: HistoryMonth) {
  return a.year * 12 + a.month > b.year * 12 + b.month;
}

export function historyMonthKey({ year, month }: HistoryMonth) {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

export function historyMonthFromKey(key: string): HistoryMonth {
  const [year, month] = key.split("-").map(Number);
  return { year, month };
}

function monthName({ year, month }: HistoryMonth) {
  return dayjs(new Date(year, month - 1, 1)).format("MMMM");
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function historyMonthTitle(target: HistoryMonth) {
  return `${capitalize(monthName(target))} ${target.year}`;
}

export function expensesRegisteredLabel(count: number, target: HistoryMonth) {
  const month = capitalize(monthName(target));
  if (count === 1) return tx(messages.History.expenses_registered_one, { month });
  return tx(messages.History.expenses_registered_many, { count, month });
}

export function resultsLabel(count: number) {
  if (count === 1) return messages.History.one_result;
  return tx(messages.History.results, { count });
}

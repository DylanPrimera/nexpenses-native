import dayjs from "dayjs";
import "dayjs/locale/es";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");

export { dayjs };

/**
 * Format an ISO date string for expense card display.
 */
export function formatExpenseDate(isoDate: string): string {
  return dayjs(isoDate).format("D MMM, HH:mm");
}

/**
 * Format an ISO date string as a human-readable month/year header.
 */
export function formatMonthYear(isoDate: string): string {
  return dayjs(isoDate).format("MMMM YYYY");
}

/** Calendar day key used to group expenses. e.g. "2026-09-25" */
export function dayKey(isoDate: string): string {
  return dayjs(isoDate).format("YYYY-MM-DD");
}

/** Day key from a Date (local calendar). */
export function dayKeyFromDate(date: Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}

/** Start of the current calendar month as Date. */
export function currentMonthStart(): Date {
  return dayjs().startOf("month").toDate();
}

/**
 * Day heading for the history ledger.
 */
export function formatDayGroup(isoDate: string): string {
  const label = dayjs(isoDate).format("dddd, D [de] MMMM");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDayKeyHeading(key: string): string {
  const label = dayjs(key).format("dddd, D [de] MMMM");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Returns today's ISO datetime string (used when persisting a new expense).
 */
export function nowISO(): string {
  return dayjs().toISOString();
}

/**
 * lib/dates.ts
 * dayjs configuration + date helpers for nexpenses.
 *
 * Plugins loaded here once; import from this file everywhere in the app
 * instead of importing dayjs directly, to guarantee plugins are always active.
 */
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/es";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");

export { dayjs };

// Budget cycle helpers live in lib/budget-cycle.ts.

// ─── Display helpers ──────────────────────────────────────────────────────────

/**
 * Format an ISO date string for expense card display.
 * e.g. "23 sep, 21:06"
 */
export function formatExpenseDate(isoDate: string): string {
	return dayjs(isoDate).format("D MMM, HH:mm");
}

/**
 * Format an ISO date string as a human-readable month/year header.
 * e.g. "Septiembre 2026"
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
 * e.g. "Miércoles, 25 de septiembre"
 */
export function formatDayGroup(isoDate: string): string {
	const label = dayjs(isoDate).format("dddd, D [de] MMMM");
	return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Returns today's ISO datetime string (used when persisting a new expense).
 */
export function nowISO(): string {
	return dayjs().toISOString();
}

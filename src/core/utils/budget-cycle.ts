/**
 * lib/budget-cycle.ts
 * Budget cycle helpers. A cycle starts when the user registers a budget
 * (payday) and lasts until the next one; expenses dated on/after
 * `cycleStartedAt` belong to it.
 *
 * Calendar math uses America/Bogota, which is UTC-5 all year (no DST), so a
 * fixed offset matches the backend regardless of the device time zone.
 */
import type { Budget, CycleSummary } from "@/core/types";

const APP_UTC_OFFSET_MS = -5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Days without a new budget after which we ask whether payday already happened. */
export const STALE_CYCLE_DAYS = 35;
/** Furthest back a new cycle may start (matches the backend validation). */
export const MAX_CYCLE_START_PAST_DAYS = 366;

type DateInput = string | number | Date;

function toMs(value: DateInput): number {
	return new Date(value).getTime();
}

function localParts(ms: number) {
	const shifted = new Date(ms + APP_UTC_OFFSET_MS);
	return {
		year: shifted.getUTCFullYear(),
		monthIndex: shifted.getUTCMonth(),
		day: shifted.getUTCDate(),
	};
}

function localMidnightMs(year: number, monthIndex: number, day = 1): number {
	return Date.UTC(year, monthIndex, day) - APP_UTC_OFFSET_MS;
}

function startOfLocalDayMs(value: DateInput): number {
	const { year, monthIndex, day } = localParts(toMs(value));
	return localMidnightMs(year, monthIndex, day);
}

function localDaysBetween(from: DateInput, to: DateInput): number {
	return Math.round((startOfLocalDayMs(to) - startOfLocalDayMs(from)) / DAY_MS);
}

/** Bogotá calendar day as `YYYY-MM-DD`. */
export function localDayKey(value: DateInput = Date.now()): string {
	const { year, monthIndex, day } = localParts(toMs(value));
	const mm = String(monthIndex + 1).padStart(2, "0");
	const dd = String(day).padStart(2, "0");
	return `${year}-${mm}-${dd}`;
}

/** Bogotá calendar year of an instant. */
export function localYear(value: DateInput = Date.now()): number {
	return localParts(toMs(value)).year;
}

/** Milliseconds until the next Bogotá midnight. */
export function msUntilNextLocalDay(now: DateInput = Date.now()): number {
	return startOfLocalDayMs(now) + DAY_MS - toMs(now);
}

/** ISO instant of Bogotá midnight for a `YYYY-MM-DD` day key. */
export function cycleStartFromDayKey(dayKey: string): string {
	const [year, month, day] = dayKey.split("-").map(Number);
	return new Date(localMidnightMs(year, month - 1, day)).toISOString();
}

/** Default start for a new cycle: today at 00:00 Bogotá. */
export function todayCycleStart(now: DateInput = Date.now()): string {
	return new Date(startOfLocalDayMs(now)).toISOString();
}

/** Fallback for data saved before cycles existed: 1st of the current Bogotá month. */
export function legacyCycleStart(now: DateInput = Date.now()): string {
	const { year, monthIndex } = localParts(toMs(now));
	return new Date(localMidnightMs(year, monthIndex)).toISOString();
}

/** Selectable range for the cycle start date picker, as day keys. */
export function cycleStartDayBounds(now: DateInput = Date.now()) {
	return {
		min: localDayKey(toMs(now) - MAX_CYCLE_START_PAST_DAYS * DAY_MS),
		max: localDayKey(now),
	};
}

export function isInCurrentCycle(
	date: DateInput,
	cycleStartedAt: DateInput,
): boolean {
	return toMs(date) >= toMs(cycleStartedAt);
}

export function filterCycleExpenses<T extends { date: string }>(
	expenses: T[],
	cycleStartedAt: DateInput,
): T[] {
	return expenses.filter((e) => isInCurrentCycle(e.date, cycleStartedAt));
}

/**
 * Expected end: same day next month (clamped to month length) minus 1 ms.
 * The real end is whenever the next budget is registered.
 */
export function expectedCycleEnd(cycleStartedAt: DateInput): string {
	const startMs = toMs(cycleStartedAt);
	const { year, monthIndex, day } = localParts(startMs);
	const lastDayNextMonth = new Date(
		Date.UTC(year, monthIndex + 2, 0),
	).getUTCDate();
	const timeOfDay = startMs - startOfLocalDayMs(startMs);
	const nextStart =
		localMidnightMs(year, monthIndex + 1, Math.min(day, lastDayNextMonth)) +
		timeOfDay;
	return new Date(nextStart - 1).toISOString();
}

/** Days left until the expected end, counting today; 0 once it passed. */
export function daysLeftInCycle(
	cycleStartedAt: DateInput,
	now: DateInput = Date.now(),
): number {
	const end = expectedCycleEnd(cycleStartedAt);
	if (toMs(now) > toMs(end)) return 0;
	return localDaysBetween(now, end) + 1;
}

export function cycleDaysElapsed(
	cycleStartedAt: DateInput,
	now: DateInput = Date.now(),
): number {
	return Math.max(0, localDaysBetween(cycleStartedAt, now));
}

export function isCycleStale(
	cycleStartedAt: DateInput,
	now: DateInput = Date.now(),
): boolean {
	return cycleDaysElapsed(cycleStartedAt, now) >= STALE_CYCLE_DAYS;
}

/** Never NaN/Infinity: a 0 budget reads as 0% (or 100% once something is spent). */
export function budgetPercentage(spent: number, budget: number): number {
	if (budget > 0) return Math.round((spent / budget) * 100);
	return spent > 0 ? 100 : 0;
}

export function buildCycleSummary(
	budget: Pick<Budget, "amount" | "cycleStartedAt">,
	totalSpent: number,
	now: DateInput = Date.now(),
): CycleSummary {
	return {
		spent: totalSpent,
		remaining: budget.amount - totalSpent,
		percentage: budgetPercentage(totalSpent, budget.amount),
		cycleStart: budget.cycleStartedAt,
		cycleEnd: expectedCycleEnd(budget.cycleStartedAt),
		daysLeft: daysLeftInCycle(budget.cycleStartedAt, now),
		daysElapsed: cycleDaysElapsed(budget.cycleStartedAt, now),
		isOverBudget: totalSpent > budget.amount,
		isStale: isCycleStale(budget.cycleStartedAt, now),
	};
}

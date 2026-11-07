import type { CreditStatus } from "@/core/types/domain";
import { localDayKey } from "@/core/utils/budget-cycle";

export const UPCOMING_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

function dayKeyMs(key: string): number {
  const [year = 0, month = 1, day = 1] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function creditStatus(
  dueDate: string | null | undefined,
  balance = 1,
  todayKey: string = localDayKey(),
): CreditStatus {
  if (balance <= 0 || !dueDate) return "al_dia";
  const days = Math.round((dayKeyMs(dueDate.slice(0, 10)) - dayKeyMs(todayKey)) / DAY_MS);
  if (Number.isNaN(days)) return "al_dia";
  if (days < 0) return "atrasado";
  return days <= UPCOMING_DAYS ? "proximo" : "al_dia";
}

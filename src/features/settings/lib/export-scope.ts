import { localDayKey } from "@/core/utils/budget-cycle";
import { historyMonthTitle } from "@/features/history/lib/history-month";
import { messages, tx } from "@/shared/i18n";
import type { ExportScope } from "../interfaces";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function exportScopeKey(scope: ExportScope): string {
  if (scope.kind === "cycle") return `cycle:${localDayKey(scope.cycleStartedAt)}`;
  if (scope.kind === "month") return `month:${scope.year}-${pad(scope.month)}`;
  return "all";
}

export function exportFileName(scope: ExportScope, now: number | Date = Date.now()): string {
  if (scope.kind === "cycle")
    return `nexpenses-ciclo-${localDayKey(scope.cycleStartedAt).slice(0, 7)}.xls`;
  if (scope.kind === "month") return `nexpenses-mes-${scope.year}-${pad(scope.month)}.xls`;
  return `nexpenses-todo-${localDayKey(now)}.xls`;
}

export function exportPeriodLabel(scope: ExportScope): string {
  if (scope.kind === "cycle") {
    return tx(messages.Settings.export_period_cycle, { date: localDayKey(scope.cycleStartedAt) });
  }
  if (scope.kind === "month") return historyMonthTitle({ year: scope.year, month: scope.month });
  return messages.Settings.export_period_all;
}

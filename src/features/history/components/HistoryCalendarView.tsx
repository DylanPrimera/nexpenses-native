import { localDayKey } from "@/core/utils/budget-cycle";
import type { Expense } from "@/features/expenses";
import { Calendar } from "@/shared/components/ui/Calendar";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { useState } from "react";
import { View } from "react-native";
import type { HistoryMonth } from "../interfaces";
import { expenseDayKeys, expensesOfDay, groupExpensesByDay } from "../lib/group-by-day";
import { currentHistoryMonth, historyMonthKey, isSameHistoryMonth } from "../lib/history-month";
import { HistoryDayGroups } from "./HistoryDayGroups";
import { HistoryListSkeleton } from "./HistoryStates";

type HistoryCalendarViewProps = {
  month: HistoryMonth;
  onMonthChange: (monthKey: string) => void;
  expenses: Expense[] | undefined;
};

type PickedDay = { month: string; day: string };

export function HistoryCalendarView({ month, onMonthChange, expenses }: HistoryCalendarViewProps) {
  const monthKey = historyMonthKey(month);
  const [picked, setPicked] = useState<PickedDay | null>(null);
  const defaultDay = isSameHistoryMonth(month, currentHistoryMonth()) ? localDayKey() : undefined;
  const selectedDay = picked?.month === monthKey ? picked.day : defaultDay;
  const dayExpenses = expenses && selectedDay ? expensesOfDay(expenses, selectedDay) : [];

  const renderDay = () => {
    if (!selectedDay) {
      return <Text className="px-1 text-sm text-muted-foreground">{messages.History.select_day_hint}</Text>;
    }
    if (!expenses) return <HistoryListSkeleton />;
    if (dayExpenses.length === 0) return null;
    return <HistoryDayGroups groups={groupExpensesByDay(dayExpenses)} />;
  };

  return (
    <View className="gap-4">
      <View className={`${SURFACE_CLASS} p-3`}>
        <Calendar
          value={selectedDay}
          onChange={(day) => setPicked({ month: monthKey, day })}
          month={monthKey}
          onMonthChange={onMonthChange}
          markedDays={expenses ? expenseDayKeys(expenses) : new Set<string>()}
          showHeader={false}
          showOutsideDays={false}
        />
      </View>
      {renderDay()}
    </View>
  );
}

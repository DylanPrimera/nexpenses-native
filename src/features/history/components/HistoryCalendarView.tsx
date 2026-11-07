import { Button } from "@/shared/components/ui/button";
import { localDayKey } from "@/core/utils/budget-cycle";
import {
  ExpenseActions,
  ExpenseCard,
  ExpenseCardSkeleton,
  type Expense,
} from "@/features/expenses";
import { usePendingExpenses } from "@/features/expenses/hooks/usePendingExpenses";
import { CalendarHeader, CalendarWeekRow, useCalendarModel } from "@/shared/components/ui/Calendar";
import type { CalendarDay } from "@/shared/components/ui/calendar-grid";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { useMemo, useState } from "react";
import { SectionList, View, type SectionListProps } from "react-native";
import type { HistoryMonth } from "../interfaces";
import { expenseDayKeys, expensesOfDay, groupExpensesByDay } from "../lib/group-by-day";
import { currentHistoryMonth, historyMonthKey, isSameHistoryMonth } from "../lib/history-month";
import { HistoryDayHeader } from "./HistoryDayGroups";

type Row =
  | { kind: "week"; id: string; days: CalendarDay[] }
  | { kind: "expense"; id: string; expense: Expense }
  | { kind: "skeleton"; id: string };
type Section = { key: string; total?: number; data: Row[] };
type Props = Omit<SectionListProps<Row, Section>, "sections" | "renderItem"> & {
  month: HistoryMonth;
  onMonthChange: (month: string) => void;
  expenses: Expense[] | undefined;
  loading?: boolean;
  statusMessage?: string;
  onRetry?: () => void;
};

export function HistoryCalendarView({
  month,
  onMonthChange,
  expenses,
  loading,
  statusMessage,
  onRetry,
  ...props
}: Props) {
  const monthKey = historyMonthKey(month);
  const [picked, setPicked] = useState<{ month: string; day: string } | null>(null);
  const selectedDay =
    picked?.month === monthKey
      ? picked.day
      : isSameHistoryMonth(month, currentHistoryMonth())
        ? localDayKey()
        : undefined;
  const model = useCalendarModel({
    value: selectedDay,
    onChange: (day) => setPicked({ month: monthKey, day }),
    month: monthKey,
    onMonthChange,
    markedDays: expenseDayKeys(expenses ?? []),
    showHeader: false,
    showOutsideDays: false,
  });
  const pending = usePendingExpenses();
  const pendingIds = useMemo(() => new Set(pending.map(({ expense }) => expense.id)), [pending]);
  const sections: Section[] = [
    { key: "calendar", data: model.weeks.map((days) => ({ kind: "week", id: days[0].key, days })) },
  ];
  if (loading && !expenses)
    sections.push({
      key: "loading",
      data: Array.from({ length: 3 }, (_, i) => ({ kind: "skeleton", id: `loading-${i}` })),
    });
  else
    sections.push(
      ...groupExpensesByDay(selectedDay ? expensesOfDay(expenses ?? [], selectedDay) : []).map(
        (group): Section => ({
          key: group.key,
          total: group.total,
          data: group.items.map((expense) => ({ kind: "expense", id: expense.id, expense })),
        }),
      ),
    );
  return (
    <ExpenseActions>
      {(openers) => (
        <SectionList<Row, Section>
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          sections={sections}
          keyExtractor={(row) => row.id}
          extraData={[pendingIds, selectedDay]}
          renderSectionHeader={({ section }) =>
            section.key === "calendar" ? (
              <CalendarHeader model={model} />
            ) : section.key === "loading" ? null : (
              <HistoryDayHeader day={section.key} total={section.total ?? 0} />
            )
          }
          renderItem={({ item }) =>
            item.kind === "week" ? (
              <CalendarWeekRow week={item.days} model={model} />
            ) : item.kind === "expense" ? (
              <View className="pb-2.5">
                <ExpenseCard
                  expense={item.expense}
                  pending={pendingIds.has(item.id)}
                  {...openers}
                />
              </View>
            ) : (
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <ExpenseCardSkeleton />
              </View>
            )
          }
          ListFooterComponent={
            <View className="gap-2 py-3">
              <Text className="text-sm text-muted-foreground">
                {statusMessage ?? (!selectedDay ? messages.History.select_day_hint : "")}
              </Text>
              {onRetry ? (
                <Button variant="secondary" onPress={onRetry}>
                  <Text>{messages.Common.retry}</Text>
                </Button>
              ) : null}
            </View>
          }
          stickySectionHeadersEnabled={false}
          removeClippedSubviews={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          {...props}
        />
      )}
    </ExpenseActions>
  );
}

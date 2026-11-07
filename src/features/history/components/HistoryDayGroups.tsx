import { useEffect, useMemo, useRef } from "react";
import { SectionList, View, type SectionListProps } from "react-native";
import { formatCOPCurrency } from "@/core/utils/currency";
import { formatDayKeyHeading } from "@/core/utils/dates";
import {
  ExpenseActions,
  ExpenseCard,
  ExpenseCardSkeleton,
  type Expense,
} from "@/features/expenses";
import { usePendingExpenses } from "@/features/expenses/hooks/usePendingExpenses";
import { Text } from "@/shared/components/ui/text";
import { messages, tx } from "@/shared/i18n";
import { listRows, type DataRow } from "@/shared/layout/list-rows";
import type { DayGroup } from "../interfaces";

type Section = { key: string; total: number; data: DataRow<Expense>[] };
type Props = Omit<SectionListProps<DataRow<Expense>, Section>, "sections" | "renderItem"> & {
  groups: DayGroup[];
  loading?: boolean;
  resetKey?: string;
};

export function HistoryDayHeader({ day, total }: { day: string; total: number }) {
  return (
    <View className="flex-row flex-wrap items-center justify-between gap-2 px-1 pb-2 pt-4">
      <Text className="font-figtree-medium text-sm text-muted-foreground">
        {formatDayKeyHeading(day)}
      </Text>
      <Text className="text-xs text-muted-foreground">
        {tx(messages.History.day_total, { amount: formatCOPCurrency(total) })}
      </Text>
    </View>
  );
}
function Separator() {
  return <View className="h-2.5" />;
}

export function HistoryDayGroups({ groups, loading, resetKey, ...props }: Props) {
  const pending = usePendingExpenses();
  const pendingIds = useMemo(() => new Set(pending.map(({ expense }) => expense.id)), [pending]);
  const ref = useRef<SectionList<DataRow<Expense>, Section>>(null);
  const sections = groups.length
    ? groups.map(({ key, total, items }) => ({ key, total, data: listRows(items) }))
    : loading
      ? [{ key: "loading", total: 0, data: listRows<Expense>([], true) }]
      : [];
  useEffect(() => {
    ref.current?.getScrollResponder()?.scrollTo({ y: 0, animated: false });
  }, [resetKey]);
  return (
    <ExpenseActions>
      {(openers) => (
        <SectionList<DataRow<Expense>, Section>
          ref={ref}
          style={{ flex: 1 }}
          sections={sections}
          keyExtractor={(row) => row.id}
          extraData={pendingIds}
          renderSectionHeader={({ section }) =>
            section.key === "loading" ? null : (
              <HistoryDayHeader day={section.key} total={section.total} />
            )
          }
          renderItem={({ item }) =>
            item.kind === "skeleton" ? (
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <ExpenseCardSkeleton />
              </View>
            ) : (
              <ExpenseCard expense={item.record} pending={pendingIds.has(item.id)} {...openers} />
            )
          }
          ItemSeparatorComponent={Separator}
          stickySectionHeadersEnabled={false}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          {...props}
        />
      )}
    </ExpenseActions>
  );
}

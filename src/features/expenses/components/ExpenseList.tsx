import { useMemo } from "react";
import { FlatList, View, type FlatListProps } from "react-native";
import { listRows, type DataRow } from "@/shared/layout/list-rows";
import type { Expense } from "../interfaces";
import { usePendingExpenses } from "../hooks/usePendingExpenses";
import { ExpenseActions } from "./ExpenseActions";
import { ExpenseCard, ExpenseCardSkeleton } from "./ExpenseCard";

type ExpenseListProps = Omit<FlatListProps<DataRow<Expense>>, "data" | "renderItem"> & {
  expenses: Expense[];
  loading?: boolean;
  ref?: React.Ref<FlatList<DataRow<Expense>>>;
};

function Separator() {
  return <View className="h-2.5" />;
}

export function ExpenseList({ expenses, loading, ...props }: ExpenseListProps) {
  const pending = usePendingExpenses();
  const pendingIds = useMemo(() => new Set(pending.map(({ expense }) => expense.id)), [pending]);
  return (
    <ExpenseActions>
      {(openers) => (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          data={listRows(expenses, loading)}
          keyExtractor={(row) => row.id}
          extraData={pendingIds}
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
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
          {...props}
        />
      )}
    </ExpenseActions>
  );
}

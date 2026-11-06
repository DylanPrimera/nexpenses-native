import { formatCOPCurrency } from "@/core/utils/currency";
import { formatDayKeyHeading } from "@/core/utils/dates";
import { ExpenseActions, ExpenseCard } from "@/features/expenses";
import { Text } from "@/shared/components/ui/text";
import { messages, tx } from "@/shared/i18n";
import { View } from "react-native";
import type { DayGroup } from "../interfaces";

export function HistoryDayGroups({ groups }: { groups: DayGroup[] }) {
  return (
    <ExpenseActions>
      {(openers) => (
        <View className="gap-4">
          {groups.map((group) => (
            <View key={group.key} className="gap-2.5">
              <View className="flex-row items-center justify-between gap-2 px-1">
                <Text numberOfLines={1} className="shrink font-figtree-medium text-sm text-muted-foreground">
                  {formatDayKeyHeading(group.key)}
                </Text>
                <Text className="shrink-0 text-xs text-muted-foreground">
                  {tx(messages.History.day_total, { amount: formatCOPCurrency(group.total) })}
                </Text>
              </View>
              {group.items.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} {...openers} />
              ))}
            </View>
          ))}
        </View>
      )}
    </ExpenseActions>
  );
}

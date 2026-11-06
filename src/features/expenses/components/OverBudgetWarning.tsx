import { formatCOPCurrency } from "@/core/utils/currency";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages, tx } from "@/shared/i18n";
import { IconAlertTriangle } from "@tabler/icons-react-native";
import { View } from "react-native";
import { overBudgetExcess } from "../lib/expense-display";

export function OverBudgetWarning({ amount, available }: { amount: number; available: number }) {
  const excess = overBudgetExcess(amount, available);
  if (excess <= 0) return null;

  return (
    <View role="alert" className="flex-row items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/10 p-3">
      <Icon as={IconAlertTriangle} size={18} className="mt-0.5 text-destructive" />
      <View className="flex-1 gap-0.5">
        <Text className="font-figtree-semibold text-xs text-destructive">{messages.Expense.over_budget_warning}</Text>
        <Text className="text-[11px] text-destructive/90">
          {tx(messages.Expense.over_limit_amount, { amount: formatCOPCurrency(excess) })}
        </Text>
      </View>
    </View>
  );
}

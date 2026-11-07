import { formatCOPCurrency } from "@/core/utils/currency";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { View } from "react-native";
import { resultsLabel } from "../lib/history-month";

type HistoryTotalProps = {
  count: number;
  amount: number;
};

export function HistoryTotal({ count, amount }: HistoryTotalProps) {
  return (
    <View className={`${SURFACE_CLASS} flex-row items-center justify-between gap-3 px-4 py-3`}>
      <View className="min-w-0 flex-1">
        <Text className="font-figtree-semibold text-[11px] uppercase tracking-wider text-primary-action">
          {messages.History.filtered_total}
        </Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">{resultsLabel(count)}</Text>
      </View>
      <Text className="font-figtree-bold text-lg tabular-nums tracking-tight">
        {`${formatCOPCurrency(amount)} `}
        <Text className="text-xs text-muted-foreground">{messages.Common.currency}</Text>
      </Text>
    </View>
  );
}

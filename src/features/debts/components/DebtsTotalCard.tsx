import { formatCOPCurrency } from "@/core/utils/currency";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { View } from "react-native";

export function DebtsTotalCard({ total }: { total: number | undefined }) {
  return (
    <View className={`${SURFACE_CLASS} px-4 py-3`}>
      <Text className="font-figtree-semibold text-xs uppercase tracking-wide text-muted-foreground">
        {messages.Debts.total_owed}
      </Text>
      {total == null ? (
        <Skeleton className="mt-2 h-7 w-36 rounded-md" />
      ) : (
        <Text className="mt-1 font-figtree-bold text-xl tabular-nums">
          {formatCOPCurrency(total)}
        </Text>
      )}
    </View>
  );
}

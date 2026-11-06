import { ExpenseCardSkeleton } from "@/features/expenses";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconCloudOff, IconFilterOff, IconReceipt } from "@tabler/icons-react-native";
import { View } from "react-native";

export function HistoryListSkeleton() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className="gap-2.5">
      <ExpenseCardSkeleton />
      <ExpenseCardSkeleton />
      <ExpenseCardSkeleton />
    </View>
  );
}

export function HistoryEmptyMonth() {
  return (
    <EmptyState
      icon={IconReceipt}
      title={messages.History.empty_title}
      description={messages.History.empty_description}
    />
  );
}

export function HistoryNoResults({ onClear }: { onClear: () => void }) {
  return (
    <View className="gap-4">
      <EmptyState
        icon={IconFilterOff}
        title={messages.History.no_results_title}
        description={messages.History.no_results_desc}
      />
      <Button variant="secondary" onPress={onClear}>
        <Text>{messages.History.clear_filters}</Text>
      </Button>
    </View>
  );
}

export function HistoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="gap-4">
      <EmptyState
        icon={IconCloudOff}
        title={messages.Common.load_error_title}
        description={messages.Common.load_error_description}
      />
      <Button variant="secondary" onPress={onRetry}>
        <Text>{messages.Common.retry}</Text>
      </Button>
    </View>
  );
}

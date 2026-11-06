import { AccountDrawer } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import { IconCloudOff, IconRepeat } from "@tabler/icons-react-native";
import { View } from "react-native";
import { useRecurring } from "../hooks";
import { RecurringCardSkeleton } from "./RecurringCard";
import { RecurringList } from "./RecurringList";

export function RecurringScreen() {
  const recurring = useRecurring();
  const { refreshing, onRefresh } = usePullToRefresh(() => recurring.refetch());

  const content = () => {
    if (recurring.isError && !recurring.data) {
      return (
        <View className="gap-4">
          <EmptyState
            icon={IconCloudOff}
            title={messages.Common.load_error_title}
            description={messages.Common.load_error_description}
          />
          <Button variant="secondary" onPress={() => void recurring.refetch()}>
            <Text>{messages.Common.retry}</Text>
          </Button>
        </View>
      );
    }
    if (!recurring.data) {
      return (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className="gap-2.5">
          <RecurringCardSkeleton />
          <RecurringCardSkeleton />
          <RecurringCardSkeleton />
        </View>
      );
    }
    if (recurring.data.length === 0) {
      return (
        <EmptyState
          icon={IconRepeat}
          title={messages.Recurring.empty_title}
          description={messages.Recurring.empty_description}
        />
      );
    }
    return <RecurringList templates={recurring.data} />;
  };

  return (
    <PageShell
      screenLabel={messages.Nav.recurring}
      headerAction={<AccountDrawer />}
      refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
    >
      {content()}
    </PageShell>
  );
}

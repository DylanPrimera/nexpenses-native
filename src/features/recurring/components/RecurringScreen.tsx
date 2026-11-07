import { useConnectivity } from "@/core/network/connectivity";
import { getQueryDisplayState } from "@/shared/layout/query-display-state";
import { AccountDrawer } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import { IconCloudOff, IconRepeat } from "@tabler/icons-react-native";
import { View } from "react-native";
import { useRecurring } from "../hooks";
import { RecurringList } from "./RecurringList";

export function RecurringScreen() {
  const { isReady, isOnline } = useConnectivity();
  const recurring = useRecurring();
  const { refreshing, onRefresh } = usePullToRefresh(() => recurring.refetch());

  const state = getQueryDisplayState({
    data: recurring.data,
    isReady,
    isOnline,
    isError: recurring.isError,
  });
  const content = () => {
    if (state === "offline")
      return (
        <EmptyState
          icon={IconCloudOff}
          title={messages.Offline.offline_title}
          description={messages.Offline.no_data}
        />
      );
    if (state === "error") {
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
    if (!recurring.data) return null;
    if (recurring.data.length === 0) {
      return (
        <EmptyState
          icon={IconRepeat}
          title={messages.Recurring.empty_title}
          description={messages.Recurring.empty_description}
        />
      );
    }
    return null;
  };

  return (
    <PageShell
      screenLabel={messages.Nav.recurring}
      headerAction={<AccountDrawer />}
      renderScrollable={({ contentContainerStyle }) => (
        <RecurringList
          templates={recurring.data ?? []}
          loading={state === "loading"}
          contentContainerStyle={contentContainerStyle}
          ListEmptyComponent={content() ?? undefined}
          refreshControl={
            <AppRefreshControl
              refreshing={isOnline && refreshing}
              onRefresh={() => {
                if (isOnline) void onRefresh();
              }}
            />
          }
        />
      )}
    />
  );
}

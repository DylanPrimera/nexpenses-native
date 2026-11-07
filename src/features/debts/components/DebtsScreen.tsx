import { useConnectivity } from "@/core/network/connectivity";
import { getQueryDisplayState } from "@/shared/layout/query-display-state";
import { listRows } from "@/shared/layout/list-rows";
import { AccountDrawer } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import { notifyWarning } from "@/shared/toast/notify";
import { IconCloudOff, IconCreditCard, IconPlus } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { SectionList, View } from "react-native";
import { useCredits, useCreditsTotal } from "../hooks";
import { groupCredits, hasReachedCreditLimit } from "../lib/credit-display";
import { DebtCard, DebtCardSkeleton } from "./DebtCard";
import { DebtsTotalCard } from "./DebtsTotalCard";

export function DebtsScreen() {
  const { isReady, isOnline } = useConnectivity();
  const credits = useCredits();
  const total = useCreditsTotal(!!credits.data && credits.data.length > 0);
  const { refreshing, onRefresh } = usePullToRefresh(() =>
    Promise.all([credits.refetch(), total.refetch()]),
  );

  const openCreate = () => {
    if (!isOnline) {
      notifyWarning(messages.Offline.action_requires_connection);
      return;
    }
    if (hasReachedCreditLimit(credits.data?.length ?? 0)) {
      notifyWarning(messages.Debts.max_reached);
      return;
    }
    router.push("/debts/new");
  };

  const state = getQueryDisplayState({
    data: credits.data,
    isReady,
    isOnline,
    isError: credits.isError,
  });
  const content = () => {
    if (state === "offline")
      return (
        <EmptyState
          icon={IconCloudOff}
          title={messages.Offline.offline_title}
          description={messages.Offline.debts_unavailable}
        />
      );
    if (state === "error") {
      return (
        <View className="gap-4">
          <EmptyState
            icon={IconCloudOff}
            title={messages.Debts.load_error}
            description={messages.Common.load_error_description}
          />
          <Button variant="secondary" onPress={() => void credits.refetch()}>
            <Text>{messages.Debts.retry_load}</Text>
          </Button>
        </View>
      );
    }
    if (!credits.data) return null;
    if (credits.data.length === 0) {
      return (
        <EmptyState
          icon={IconCreditCard}
          title={messages.Debts.empty_title}
          description={messages.Debts.empty_description}
        />
      );
    }
    return null;
  };

  const { cards, loans } = groupCredits(credits.data ?? []);
  const sections =
    state === "loading"
      ? [{ key: "loading", title: "", data: listRows<(typeof cards)[number]>([], true, 2) }]
      : [
          { key: "TC", title: messages.Debts.section_tc, data: listRows(cards) },
          { key: "CONSUMO", title: messages.Debts.section_consumo, data: listRows(loans) },
        ].filter((section) => section.data.length > 0);
  return (
    <PageShell
      screenLabel={messages.Nav.debts}
      headerAction={<AccountDrawer />}
      renderScrollable={({ contentContainerStyle }) => (
        <SectionList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          sections={sections}
          keyExtractor={(row) => row.id}
          contentContainerStyle={contentContainerStyle}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <View className="gap-4 pb-3">
              <Button size="lg" disabled={!isOnline} onPress={openCreate}>
                <Icon as={IconPlus} size={20} className="text-primary-foreground" />
                <Text>{messages.Debts.add_credit}</Text>
              </Button>
              {!isOnline ? <Text>{messages.Offline.action_requires_connection}</Text> : null}
              {credits.data?.length ? <DebtsTotalCard total={total.data} /> : null}
            </View>
          }
          ListEmptyComponent={content() ?? undefined}
          renderSectionHeader={({ section }) =>
            section.title ? (
              <Text role="heading" className="pb-2 pt-3 font-figtree-semibold">
                {section.title}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View className="pb-2.5">
              {item.kind === "skeleton" ? (
                <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                  <DebtCardSkeleton />
                </View>
              ) : (
                <DebtCard credit={item.record} />
              )}
            </View>
          )}
          refreshControl={
            <AppRefreshControl
              refreshing={isOnline && refreshing}
              onRefresh={() => {
                if (isOnline) void onRefresh();
              }}
            />
          }
          removeClippedSubviews={false}
          initialNumToRender={10}
          windowSize={7}
        />
      )}
    />
  );
}

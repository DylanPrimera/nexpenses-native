import { AccountDrawer, useAuthStore } from "@/features/auth";
import {
  BudgetEditSheet,
  BudgetProgressCard,
  BudgetSetupSheet,
  NewCycleNotice,
  useCycleSummary,
  useProfile,
} from "@/features/budget";
import { useCycleExpenses } from "@/features/expenses";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Text } from "@/shared/components/ui/text";
import { messages, tx } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import { TOUR_TARGETS, useTourScroller, useTourTarget } from "@/shared/tour";
import { IconCloudOff } from "@tabler/icons-react-native";
import { useIsFocused } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { RecentExpenses } from "./RecentExpenses";

export function DashboardScreen() {
  const { firstName } = useAuthStore();
  const profile = useProfile();
  const summary = useCycleSummary();
  const expenses = useCycleExpenses(summary.data?.cycleStartedAt);
  const [isNewCycleOpen, setIsNewCycleOpen] = useState(false);
  const focused = useIsFocused();
  const scrollRef = useTourScroller(focused);
  const budgetTargetRef = useTourTarget(TOUR_TARGETS.budget, focused);
  const recentTargetRef = useTourTarget(TOUR_TARGETS.recent, focused);
  const { refreshing, onRefresh } = usePullToRefresh(() =>
    Promise.all([profile.refetch(), summary.refetch(), summary.data ? expenses.refetch() : undefined]),
  );

  const isFirstLaunch = profile.data?.budget === 0;
  const hasError = (profile.isError && !profile.data) || (summary.isError && !summary.data);
  const isLoading = !hasError && (!profile.data || !summary.data);
  const greetingName = firstName.trim();

  const content = () => {
    if (hasError) {
      return (
        <View className="gap-4">
          <EmptyState
            icon={IconCloudOff}
            title={messages.Common.load_error_title}
            description={messages.Common.load_error_description}
          />
          <Button variant="secondary" onPress={() => void onRefresh()}>
            <Text>{messages.Common.retry}</Text>
          </Button>
        </View>
      );
    }
    if (isLoading || !profile.data || !summary.data) return <DashboardSkeleton />;
    if (isFirstLaunch) return null;
    const cycle = summary.data;

    return (
      <View className="gap-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1">
            {greetingName ? (
              <Text numberOfLines={1} className="font-figtree-semibold text-lg tracking-tight">
                {tx(messages.Budget.greeting, { name: greetingName })}
              </Text>
            ) : null}
            <Text
              className={
                greetingName ? "text-xs text-muted-foreground" : "font-figtree-semibold text-lg tracking-tight"
              }
            >
              {messages.Budget.cycle_summary}
            </Text>
          </View>
          <View className="shrink-0 rounded-md border border-border bg-card px-3 py-1">
            <Text className="font-figtree-medium text-xs text-muted-foreground">
              {tx(messages.Budget.days_left, { days: cycle.daysLeft })}
            </Text>
          </View>
        </View>

        {cycle.isCycleStale ? (
          <NewCycleNotice
            cycleStartedAt={cycle.cycleStartedAt}
            daysElapsed={cycle.daysElapsed}
            onRegister={() => setIsNewCycleOpen(true)}
          />
        ) : null}

        <View ref={budgetTargetRef} collapsable={false}>
          <BudgetProgressCard summary={cycle} />
        </View>

        <View ref={recentTargetRef} collapsable={false}>
          <RecentExpenses expenses={expenses.data} isLoading={expenses.isPending} />
        </View>
      </View>
    );
  };

  return (
    <PageShell
      screenLabel={messages.Nav.dashboard}
      headerAction={<AccountDrawer />}
      scrollRef={scrollRef}
      refreshControl={<AppRefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />}
    >
      {content()}
      <BudgetSetupSheet isOpen={isFirstLaunch} />
      {profile.data ? (
        <BudgetEditSheet
          isOpen={isNewCycleOpen}
          onClose={() => setIsNewCycleOpen(false)}
          profile={profile.data}
          startNewCycle
        />
      ) : null}
    </PageShell>
  );
}

import { useConnectivity } from "@/core/network/connectivity";
import { FlatList, View } from "react-native";
import { AccountDrawer } from "@/features/auth";
import { useCycleSummary, useProfile } from "@/features/budget";
import { TourReplayCard } from "@/features/onboarding";
import { messages } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import {
  IconAlertTriangle,
  IconFileExport,
  IconSparkles,
  IconSunMoon,
  IconWallet,
} from "@tabler/icons-react-native";
import { BudgetSettingsCard } from "./BudgetSettingsCard";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { ExportSection } from "./ExportSection";
import { SettingsSection } from "./SettingsSection";
import { ThemeToggle } from "./ThemeToggle";

export function SettingsScreen() {
  const { isOnline } = useConnectivity();
  const profile = useProfile();
  const summary = useCycleSummary();
  const { refreshing, onRefresh } = usePullToRefresh(() =>
    Promise.all([profile.refetch(), summary.refetch()]),
  );
  const hasError = (profile.isError && !profile.data) || (summary.isError && !summary.data);

  const sections = [
    {
      id: "appearance",
      content: (
        <SettingsSection icon={IconSunMoon} title={messages.Settings.appearance_section}>
          <ThemeToggle />
        </SettingsSection>
      ),
    },
    {
      id: "budget",
      content: (
        <SettingsSection icon={IconWallet} title={messages.Settings.budget_section}>
          <BudgetSettingsCard
            profile={profile.data}
            summary={summary.data}
            hasError={hasError}
            onRetry={() => void Promise.all([profile.refetch(), summary.refetch()])}
          />
        </SettingsSection>
      ),
    },
    {
      id: "data",
      content: (
        <SettingsSection icon={IconFileExport} title={messages.Settings.data_section}>
          <ExportSection profile={profile.data} />
        </SettingsSection>
      ),
    },
    {
      id: "tour",
      content: (
        <SettingsSection icon={IconSparkles} title={messages.Tour.replay_title}>
          <TourReplayCard />
        </SettingsSection>
      ),
    },
    {
      id: "danger",
      content: (
        <SettingsSection
          icon={IconAlertTriangle}
          title={messages.Settings.danger_section}
          tone="danger"
        >
          <DeleteAccountSection />
        </SettingsSection>
      ),
    },
  ];
  return (
    <PageShell
      screenLabel={messages.Nav.settings}
      headerAction={<AccountDrawer />}
      renderScrollable={({ contentContainerStyle }) => (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          data={sections}
          keyExtractor={(section) => section.id}
          contentContainerStyle={contentContainerStyle}
          renderItem={({ item }) => <View className="pb-6">{item.content}</View>}
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

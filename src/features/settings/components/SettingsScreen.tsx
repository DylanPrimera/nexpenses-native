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
import { Link, type Href } from "expo-router";
import { BudgetSettingsCard } from "./BudgetSettingsCard";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { ExportSection } from "./ExportSection";
import { SettingsSection } from "./SettingsSection";
import { ThemeToggle } from "./ThemeToggle";

export function SettingsScreen() {
  const profile = useProfile();
  const summary = useCycleSummary();
  const { refreshing, onRefresh } = usePullToRefresh(() =>
    Promise.all([profile.refetch(), summary.refetch()]),
  );
  const hasError = (profile.isError && !profile.data) || (summary.isError && !summary.data);

  return (
    <PageShell
      screenLabel={messages.Nav.settings}
      headerAction={<AccountDrawer />}
      contentClassName="gap-6"
      refreshControl={
        <AppRefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
    >
      <SettingsSection icon={IconSunMoon} title={messages.Settings.appearance_section}>
        <ThemeToggle />
      </SettingsSection>
      <SettingsSection icon={IconWallet} title={messages.Settings.budget_section}>
        <BudgetSettingsCard
          profile={profile.data}
          summary={summary.data}
          hasError={hasError}
          onRetry={() => void Promise.all([profile.refetch(), summary.refetch()])}
        />
      </SettingsSection>
      <SettingsSection icon={IconFileExport} title={messages.Settings.data_section}>
        <ExportSection profile={profile.data} />
      </SettingsSection>
      <SettingsSection icon={IconSparkles} title={messages.Tour.replay_title}>
        <TourReplayCard />
      </SettingsSection>
      <SettingsSection
        icon={IconAlertTriangle}
        title={messages.Settings.danger_section}
        tone="danger"
      >
        <DeleteAccountSection />
      </SettingsSection>
      {__DEV__ ? (
        <Link
          href={"/ui-kit" as Href}
          className="text-center font-figtree-medium text-sm text-primary"
        >
          UI kit
        </Link>
      ) : null}
    </PageShell>
  );
}

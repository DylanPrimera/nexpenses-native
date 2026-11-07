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
import { View } from "react-native";
import { useCredits, useCreditsTotal } from "../hooks";
import { groupCredits, hasReachedCreditLimit } from "../lib/credit-display";
import { DebtCard, DebtCardSkeleton } from "./DebtCard";
import { DebtsTotalCard } from "./DebtsTotalCard";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2.5">
      <Text
        role="heading"
        className="font-figtree-semibold text-xs uppercase tracking-wide text-muted-foreground"
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

export function DebtsScreen() {
  const credits = useCredits();
  const total = useCreditsTotal(!!credits.data && credits.data.length > 0);
  const { refreshing, onRefresh } = usePullToRefresh(() =>
    Promise.all([credits.refetch(), total.refetch()]),
  );

  const openCreate = () => {
    if (hasReachedCreditLimit(credits.data?.length ?? 0)) {
      notifyWarning(messages.Debts.max_reached);
      return;
    }
    router.push("/debts/new");
  };

  const content = () => {
    if (credits.isError && !credits.data) {
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
    if (!credits.data) {
      return (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="gap-2.5"
        >
          <DebtCardSkeleton />
          <DebtCardSkeleton />
        </View>
      );
    }
    if (credits.data.length === 0) {
      return (
        <EmptyState
          icon={IconCreditCard}
          title={messages.Debts.empty_title}
          description={messages.Debts.empty_description}
        />
      );
    }
    const { cards, loans } = groupCredits(credits.data);
    return (
      <View className="gap-5">
        <DebtsTotalCard total={total.data} />
        {cards.length > 0 ? (
          <Section title={messages.Debts.section_tc}>
            {cards.map((credit) => (
              <DebtCard key={credit.id} credit={credit} />
            ))}
          </Section>
        ) : null}
        {loans.length > 0 ? (
          <Section title={messages.Debts.section_consumo}>
            {loans.map((credit) => (
              <DebtCard key={credit.id} credit={credit} />
            ))}
          </Section>
        ) : null}
      </View>
    );
  };

  return (
    <PageShell
      screenLabel={messages.Nav.debts}
      headerAction={<AccountDrawer />}
      contentClassName="gap-4"
      refreshControl={
        <AppRefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
    >
      <Button size="lg" onPress={openCreate}>
        <Icon as={IconPlus} size={20} strokeWidth={2.5} className="text-primary-foreground" />
        <Text className="font-figtree-bold">{messages.Debts.add_credit}</Text>
      </Button>
      {content()}
    </PageShell>
  );
}

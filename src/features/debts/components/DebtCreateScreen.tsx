import { BackButton } from "@/shared/components/ui/BackButton";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { PageShell } from "@/shared/layout";
import { IconAlertCircle } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { View } from "react-native";
import { useCredits } from "../hooks";
import { hasReachedCreditLimit } from "../lib/credit-display";
import { CreditCreateForm } from "./CreditCreateForm";

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/debts");
}

export function DebtCreateScreen() {
  const credits = useCredits();
  const reached = hasReachedCreditLimit(credits.data?.length ?? 0);

  return (
    <PageShell screenLabel={messages.Nav.debts} navClearance={false} contentClassName="gap-4">
      <View className="flex-row">
        <BackButton accessibilityLabel={messages.Common.back} onPress={goBack} />
      </View>
      {reached ? (
        <EmptyState icon={IconAlertCircle} title={messages.Debts.max_reached} />
      ) : (
        <>
          <View className="gap-1">
            <Text role="heading" className="font-figtree-semibold text-xl tracking-tight">
              {messages.Debts.configure_title}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {messages.Debts.configure_subtitle}
            </Text>
          </View>
          <CreditCreateForm />
        </>
      )}
    </PageShell>
  );
}

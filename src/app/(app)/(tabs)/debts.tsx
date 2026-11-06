import { AccountDrawer } from "@/features/auth";
import { EmptyState } from "@/shared";
import { messages } from "@/shared/i18n";
import { PageShell } from "@/shared/layout";
import { IconCreditCard } from "@tabler/icons-react-native";

export default function DebtsScreen() {
  return (
    <PageShell screenLabel={messages.Nav.debts} headerAction={<AccountDrawer />}>
      <EmptyState icon={IconCreditCard} title={messages.Common.coming_soon} description={messages.Common.coming_soon_debts} />
    </PageShell>
  );
}

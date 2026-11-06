import { AccountDrawer } from "@/features/auth";
import { EmptyState } from "@/shared";
import { messages } from "@/shared/i18n";
import { PageShell } from "@/shared/layout";
import { IconRepeat } from "@tabler/icons-react-native";

export default function RecurringScreen() {
  return (
    <PageShell screenLabel={messages.Nav.recurring} headerAction={<AccountDrawer />}>
      <EmptyState icon={IconRepeat} title={messages.Common.in_progress_title} description={messages.Common.in_progress_description} />
    </PageShell>
  );
}

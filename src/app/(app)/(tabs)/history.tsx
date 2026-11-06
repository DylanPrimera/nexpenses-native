import { AccountDrawer } from "@/features/auth";
import { EmptyState } from "@/shared";
import { messages } from "@/shared/i18n";
import { PageShell } from "@/shared/layout";
import { IconHistory } from "@tabler/icons-react-native";

export default function HistoryScreen() {
  return (
    <PageShell screenLabel={messages.Nav.history} headerAction={<AccountDrawer />}>
      <EmptyState icon={IconHistory} title={messages.Common.in_progress_title} description={messages.Common.in_progress_description} />
    </PageShell>
  );
}

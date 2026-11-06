import { AccountDrawer } from "@/features/auth";
import { EmptyState } from "@/shared";
import { messages } from "@/shared/i18n";
import { PageShell } from "@/shared/layout";
import { IconHome } from "@tabler/icons-react-native";

export default function DashboardScreen() {
  return (
    <PageShell screenLabel={messages.Nav.dashboard} headerAction={<AccountDrawer />}>
      <EmptyState icon={IconHome} title={messages.Common.in_progress_title} description={messages.Common.in_progress_description} />
    </PageShell>
  );
}

import { AccountDrawer } from "@/features/auth";
import { EmptyState } from "@/shared";
import { messages } from "@/shared/i18n";
import { PageShell } from "@/shared/layout";
import { IconTags } from "@tabler/icons-react-native";

export default function CategoriesScreen() {
  return (
    <PageShell screenLabel={messages.Nav.categories} headerAction={<AccountDrawer />}>
      <EmptyState icon={IconTags} title={messages.Common.in_progress_title} description={messages.Common.in_progress_description} />
    </PageShell>
  );
}

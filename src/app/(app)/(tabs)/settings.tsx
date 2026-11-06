import { AccountDrawer } from "@/features/auth";
import { ThemeToggle } from "@/features/settings";
import { Icon, Text } from "@/shared";
import { messages } from "@/shared/i18n";
import { PageShell } from "@/shared/layout";
import { IconSunMoon } from "@tabler/icons-react-native";
import { Link, type Href } from "expo-router";
import { View } from "react-native";

export default function SettingsScreen() {
  return (
    <PageShell screenLabel={messages.Nav.settings} headerAction={<AccountDrawer />} contentClassName="gap-6">
      <View className="gap-3">
        <View className="flex-row items-center gap-1.5">
          <Icon as={IconSunMoon} size={15} className="text-primary" />
          <Text className="font-figtree-semibold text-sm">{messages.Settings.appearance_section}</Text>
        </View>
        <ThemeToggle />
      </View>
      {__DEV__ ? (
        <Link href={"/ui-kit" as Href} className="text-center font-figtree-medium text-sm text-primary">
          UI kit
        </Link>
      ) : null}
    </PageShell>
  );
}

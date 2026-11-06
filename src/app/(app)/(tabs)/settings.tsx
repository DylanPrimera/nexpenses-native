import { AccountDrawer } from "@/features/auth";
import { Switch, Text, useAppTheme } from "@/shared";
import { messages } from "@/shared/i18n";
import { PageShell } from "@/shared/layout";
import { Link, type Href } from "expo-router";
import { View } from "react-native";

export default function SettingsScreen() {
  const { preference, resolvedScheme, setDarkMode, setSystemTheme } = useAppTheme();

  return (
    <PageShell screenLabel={messages.Nav.settings} headerAction={<AccountDrawer />} contentClassName="gap-6">
      <View className="gap-3">
        <Text className="font-figtree-semibold text-[11px] uppercase tracking-wider text-muted-foreground">
          {messages.Settings.appearance_section}
        </Text>
        <View className="gap-4 rounded-[0.875rem] border border-border bg-card p-4">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-sm">{messages.Settings.theme_system}</Text>
            <Switch checked={preference === "system"} onCheckedChange={setSystemTheme} />
          </View>
          <View className="flex-row items-center justify-between gap-3">
            <Text className={`flex-1 text-sm ${preference === "system" ? "text-muted-foreground" : "text-foreground"}`}>
              {messages.Settings.theme_dark}
            </Text>
            <Switch
              checked={resolvedScheme === "dark"}
              disabled={preference === "system"}
              onCheckedChange={setDarkMode}
            />
          </View>
        </View>
      </View>
      {__DEV__ ? (
        <Link href={"/ui-kit" as Href} className="text-center font-figtree-medium text-sm text-primary">
          UI kit
        </Link>
      ) : null}
    </PageShell>
  );
}

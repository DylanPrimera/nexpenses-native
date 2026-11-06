import { Icon } from "@/shared/components/ui/Icon";
import { KeyboardScrollView } from "@/shared/components/ui/KeyboardScrollView";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconPigMoney } from "@tabler/icons-react-native";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONTENT_MAX_WIDTH, NAV_CONTENT_CLEARANCE } from "./layout-metrics";

type PageShellProps = {
  screenLabel: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  contentClassName?: string;
};

export function PageShell({ screenLabel, children, headerAction, contentClassName }: PageShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <View style={{ paddingTop: insets.top + 16 }} className="border-b border-border bg-background px-4 pb-3">
        <View style={styles.centered} className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="size-12 items-center justify-center rounded-[0.875rem] bg-muted">
              <Icon as={IconPigMoney} size={22} strokeWidth={1.75} className="text-primary" />
            </View>
            <View className="min-w-0 flex-1">
              <Text role="heading" className="font-figtree-semibold text-[22px] leading-tight tracking-tight">
                {messages.Meta.app_name}
              </Text>
              <Text className="mt-0.5 font-figtree-semibold text-[11px] uppercase tracking-wider text-primary">
                {screenLabel}
              </Text>
            </View>
          </View>
          {headerAction}
        </View>
      </View>
      <KeyboardScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + NAV_CONTENT_CLEARANCE }}
      >
        <View style={styles.centered} className={`px-4 pt-4 ${contentClassName ?? ""}`}>
          {children}
        </View>
      </KeyboardScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { width: "100%", maxWidth: CONTENT_MAX_WIDTH, alignSelf: "center" },
});

export type { PageShellProps };

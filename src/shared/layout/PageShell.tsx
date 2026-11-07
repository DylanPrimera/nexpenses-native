import { OfflineNotice } from "./OfflineNotice";
import { Icon } from "@/shared/components/ui/Icon";
import {
  KeyboardScrollView,
  type KeyboardScrollViewProps,
} from "@/shared/components/ui/KeyboardScrollView";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconPigMoney } from "@tabler/icons-react-native";
import {
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type RefreshControlProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CONTENT_MAX_WIDTH,
  END_REACHED_THRESHOLD,
  NAV_CONTENT_CLEARANCE,
  STANDALONE_CLEARANCE,
} from "./layout-metrics";

type PageShellProps = {
  screenLabel: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  contentClassName?: string;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  onEndReached?: () => void;
  navClearance?: boolean;
  scrollRef?: KeyboardScrollViewProps["ref"];
  onScroll?: KeyboardScrollViewProps["onScroll"];
};

export function PageShell({
  screenLabel,
  children,
  headerAction,
  contentClassName,
  refreshControl,
  onEndReached,
  navClearance = true,
  scrollRef,
  onScroll,
}: PageShellProps) {
  const insets = useSafeAreaInsets();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScroll?.(event);
    if (!onEndReached) return;
    const { nativeEvent } = event;
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - END_REACHED_THRESHOLD) {
      onEndReached();
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View style={{ paddingTop: insets.top + 10 }} className="bg-background px-4 pb-2">
        <View style={styles.centered} className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="size-12 items-center justify-center rounded-[0.875rem] bg-muted">
              <Icon as={IconPigMoney} size={22} strokeWidth={1.75} className="text-primary" />
            </View>
            <View className="min-w-0 flex-1">
              <Text
                role="heading"
                className="font-figtree-semibold text-[22px] leading-tight tracking-tight"
              >
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
      <OfflineNotice />
      <KeyboardScrollView
        ref={scrollRef}
        className="flex-1"
        refreshControl={refreshControl}
        onScroll={onEndReached || onScroll ? handleScroll : undefined}
        scrollEventThrottle={onScroll ? 16 : undefined}
        contentContainerStyle={{
          paddingBottom:
            insets.bottom + (navClearance ? NAV_CONTENT_CLEARANCE : STANDALONE_CLEARANCE),
        }}
        showsVerticalScrollIndicator={false}
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

import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { setAccessibilityFallback } from "@/shared/overlays/accessibility-focus";
import { IconPigMoney } from "@tabler/icons-react-native";
import { useIsFocused } from "expo-router";
import { useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type RefreshControlProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CONTENT_MAX_WIDTH,
  END_REACHED_THRESHOLD,
  NAV_CONTENT_CLEARANCE,
  STANDALONE_CLEARANCE,
} from "./layout-metrics";
import { OfflineNotice } from "./OfflineNotice";

type PageShellBaseProps = {
  screenLabel: string;
  headerAction?: React.ReactNode;
  contentClassName?: string;
  navClearance?: boolean;
};

type PageShellProps = PageShellBaseProps &
  (
    | {
        renderScrollable: (layout: PageShellListLayout) => React.ReactNode;
        children?: never;
        refreshControl?: never;
        onEndReached?: never;
        scrollRef?: never;
        onScroll?: never;
      }
    | {
        renderScrollable?: never;
        children?: React.ReactNode;
        refreshControl?: React.ReactElement<RefreshControlProps>;
        onEndReached?: () => void;
        scrollRef?: React.Ref<FlatList<never>>;
        onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
      }
  );

export function PageShell({
  screenLabel,
  children,
  renderScrollable,
  headerAction,
  contentClassName,
  refreshControl,
  onEndReached,
  navClearance = true,
  onScroll,
  scrollRef,
}: PageShellProps) {
  const headingRef = useRef<React.ComponentRef<typeof Text>>(null);
  const focused = useIsFocused();
  useEffect(() => {
    if (focused) return setAccessibilityFallback(headingRef.current);
  }, [focused]);
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
              <Icon
                as={IconPigMoney}
                size={22}
                strokeWidth={1.75}
                className="text-primary-action"
              />
            </View>
            <View className="min-w-0 flex-1">
              <Text
                ref={headingRef}
                role="heading"
                className="font-figtree-semibold text-[22px] leading-tight tracking-tight"
              >
                {messages.Meta.app_name}
              </Text>
              <Text className="mt-0.5 font-figtree-semibold text-[11px] uppercase tracking-wider text-primary-action">
                {screenLabel}
              </Text>
            </View>
          </View>
          {headerAction}
        </View>
      </View>
      <OfflineNotice />
      {renderScrollable ? (
        renderScrollable({
          contentContainerStyle: {
            flexGrow: 1,
            width: "100%",
            maxWidth: CONTENT_MAX_WIDTH,
            alignSelf: "center",
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom:
              insets.bottom + (navClearance ? NAV_CONTENT_CLEARANCE : STANDALONE_CLEARANCE),
          },
        })
      ) : (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <FlatList
            ref={scrollRef}
            style={{ flex: 1 }}
            data={[]}
            renderItem={() => null}
            keyboardShouldPersistTaps="handled"
            refreshControl={refreshControl}
            onScroll={onScroll ? handleScroll : undefined}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            scrollEventThrottle={onScroll ? 16 : undefined}
            contentContainerStyle={{
              paddingBottom:
                insets.bottom + (navClearance ? NAV_CONTENT_CLEARANCE : STANDALONE_CLEARANCE),
            }}
            ListHeaderComponent={
              <View style={styles.centered} className={`px-4 pt-4 ${contentClassName ?? ""}`}>
                {children}
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { width: "100%", maxWidth: CONTENT_MAX_WIDTH, alignSelf: "center" },
});

export type { PageShellProps };

export type PageShellListLayout = { contentContainerStyle: StyleProp<ViewStyle> };

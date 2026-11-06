import { Icon } from "@/shared/components/ui/Icon";
import { NAV_BOTTOM_GAP } from "@/shared/layout/layout-metrics";
import { useAppTheme } from "@/shared/theme";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, useWindowDimensions, View } from "react-native";
import { AddExpenseFAB } from "./AddExpenseFAB";
import { navItemHitSlop, navItemSizeClass, splitNavItems, type NavItem } from "./nav-items";
import { useKeyboardVisible } from "./use-keyboard-visible";

const PILL_SHADOW = {
  light: "0 4px 16px rgba(15, 20, 22, 0.08)",
  dark: "0 8px 32px rgba(0, 0, 0, 0.35)",
} as const;

type BottomNavProps = BottomTabBarProps & {
  onAddPress: () => void;
};

export function BottomNav({ state, emitter, navigateToTab, insets, onAddPress }: BottomNavProps) {
  const { resolvedScheme } = useAppTheme();
  const { width } = useWindowDimensions();
  const keyboardVisible = useKeyboardVisible();
  const [left, right] = splitNavItems();
  const activeRoute = state.routes[state.index]?.name;
  const sizeClass = navItemSizeClass(width);
  const hitSlop = navItemHitSlop(width);

  if (keyboardVisible) return null;

  const renderItem = ({ route, label, icon }: NavItem) => {
    const target = state.routes.find((item) => item.name === route);
    if (!target) return null;
    const active = activeRoute === route;

    const handlePress = () => {
      const event = emitter.emit({ type: "tabPress", target: target.key, canPreventDefault: true });
      if (!active && !event.defaultPrevented) navigateToTab(target.key);
    };

    return (
      <Pressable
        key={route}
        role="tab"
        accessibilityLabel={label}
        accessibilityState={{ selected: active }}
        hitSlop={hitSlop}
        onPress={handlePress}
        className={`items-center justify-center rounded-full ${sizeClass} ${active ? "bg-nav-active" : "active:opacity-70"}`}
      >
        <Icon
          as={icon}
          size={22}
          strokeWidth={active ? 2.25 : 1.75}
          className={active ? "text-primary" : "text-muted-foreground"}
        />
      </Pressable>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={{ bottom: insets.bottom + NAV_BOTTOM_GAP }}
      className="absolute inset-x-0 items-center px-5"
    >
      <View
        style={{ boxShadow: PILL_SHADOW[resolvedScheme] }}
        role="tablist"
        className="flex-row items-center rounded-full bg-nav-pill p-1 dark:bg-nav-pill/95"
      >
        <View className="flex-row items-center gap-1">{left.map(renderItem)}</View>
        <View className="-my-3 rounded-full bg-nav-pill p-3">
          <AddExpenseFAB onPress={onAddPress} />
        </View>
        <View className="flex-row items-center gap-1 pl-1">{right.map(renderItem)}</View>
      </View>
    </View>
  );
}

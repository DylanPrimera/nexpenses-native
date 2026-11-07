import { NAV_BOTTOM_GAP } from "@/shared/layout/layout-metrics";
import { useAppTheme } from "@/shared/theme";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { useState } from "react";
import { useWindowDimensions, View, type LayoutChangeEvent } from "react-native";
import { AddExpenseFAB } from "./AddExpenseFAB";
import { BottomNavIndicator } from "./BottomNavIndicator";
import { NavTabButton } from "./NavTabButton";
import { resolveNavIndicatorGeometry, type NavMeasurements } from "./nav-indicator-geometry";
import { useNavReducedMotion } from "./use-nav-reduced-motion";
import { navItemHitSlop, navItemSizeClass, splitNavItems, type NavItem } from "./nav-items";
import { useKeyboardVisible } from "./use-keyboard-visible";

const PILL_SHADOW = {
  light: "0 4px 16px rgba(15, 20, 22, 0.08)",
  dark: "0 8px 32px rgba(0, 0, 0, 0.35)",
} as const;

type BottomNavProps = BottomTabBarProps & {
  onAddPress: () => void;
};

function emptyMeasurements(): NavMeasurements {
  return { pill: null, left: null, right: null, gap: null, tabs: {} };
}

export function BottomNav({ state, emitter, navigateToTab, insets, onAddPress }: BottomNavProps) {
  const { resolvedScheme } = useAppTheme();
  const { width, height } = useWindowDimensions();
  const keyboardVisible = useKeyboardVisible();
  const [left, right] = splitNavItems();
  const activeRoute = state.routes[state.index]?.name;
  const sizeClass = navItemSizeClass(width);
  const hitSlop = navItemHitSlop(width);

  const reducedMotion = useNavReducedMotion();
  const epochKey = `${sizeClass}:${keyboardVisible}`;
  const [measured, setMeasured] = useState(() => ({ key: epochKey, epoch: 0, data: emptyMeasurements() }));
  if (measured.key !== epochKey) {
    setMeasured({ key: epochKey, epoch: measured.epoch + 1, data: emptyMeasurements() });
  }
  const epoch = measured.epoch;
  const data = measured.key === epochKey ? measured.data : emptyMeasurements();
  const leftRoutes = left
    .filter(({ route }) => state.routes.some((item) => item.name === route))
    .map(({ route }) => route);
  const rightRoutes = right
    .filter(({ route }) => state.routes.some((item) => item.name === route))
    .map(({ route }) => route);
  const geometry = resolveNavIndicatorGeometry(data, activeRoute, leftRoutes, rightRoutes);
  const layoutKey = `${width}:${height}:${epoch}`;

  const recordLayout = (part: Exclude<keyof NavMeasurements, "tabs"> | "tab", route?: string) =>
    (event: LayoutChangeEvent) => {
      const rect = { ...event.nativeEvent.layout };
      setMeasured((current) => {
        if (current.epoch !== epoch) return current;
        const previous = current.data;
        const next = part === "tab" && route
          ? { ...previous, tabs: { ...previous.tabs, [route]: rect } }
          : { ...previous, [part]: rect };
        return { ...current, data: next };
      });
    };

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
      <NavTabButton
        key={route}
        route={route}
        label={label}
        icon={icon}
        active={active}
        indicatorReady={geometry !== null}
        reducedMotion={reducedMotion}
        layoutKey={layoutKey}
        onLayout={recordLayout("tab", route)}
        sizeClass={sizeClass}
        hitSlop={hitSlop}
        onPress={handlePress}
      />
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={{ bottom: insets.bottom + NAV_BOTTOM_GAP }}
      className="absolute inset-x-0 items-center px-5"
    >
      <View
        onLayout={recordLayout("pill")}
        style={{ boxShadow: PILL_SHADOW[resolvedScheme] }}
        role="tablist"
        className="flex-row items-center rounded-full bg-nav-pill p-1"
      >
        {geometry && activeRoute && (
          <BottomNavIndicator
            geometry={geometry}
            route={activeRoute}
            layoutKey={layoutKey}
            reducedMotion={reducedMotion}
          />
        )}
        <View
          testID="bottom-nav-left"
          onLayout={recordLayout("left")}
          className="flex-row items-center gap-1"
        >
          {left.map(renderItem)}
        </View>
        <View
          testID="bottom-nav-fab-gap"
          onLayout={recordLayout("gap")}
          style={{ zIndex: 1, elevation: 0 }}
          className="-my-3 rounded-full bg-nav-pill p-3"
        >
          <AddExpenseFAB onPress={onAddPress} />
        </View>
        <View
          testID="bottom-nav-right"
          onLayout={recordLayout("right")}
          className="flex-row items-center gap-1 pl-1"
        >
          {right.map(renderItem)}
        </View>
      </View>
    </View>
  );
}

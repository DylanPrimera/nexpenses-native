import { Icon } from "@/shared/components/ui/Icon";
import { navTourTarget } from "@/shared/tour/tour-targets";
import { useTourTarget } from "@/shared/tour/use-tour-target";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Pressable, type LayoutChangeEvent } from "react-native";
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type WithSpringConfig,
  type WithTimingConfig,
} from "react-native-reanimated";
import type { NavItem, navItemHitSlop } from "./nav-items";

type NavTabButtonProps = NavItem & {
  active: boolean;
  indicatorReady: boolean;
  reducedMotion: boolean;
  layoutKey: string;
  sizeClass: string;
  hitSlop: ReturnType<typeof navItemHitSlop>;
  onLayout: (event: LayoutChangeEvent) => void;
  onPress: () => void;
};

export function NavTabButton({
  route, label, icon, active, indicatorReady, reducedMotion, layoutKey, sizeClass, hitSlop, onLayout, onPress,
}: NavTabButtonProps) {
  const targetRef = useTourTarget(navTourTarget(route));
  const progress = useSharedValue(active ? 1 : 0);
  const scale = useSharedValue(1);
  const previous = useRef({ active, layoutKey });
  const fade = useMemo<WithTimingConfig>(() => ({ duration: 180, reduceMotion: ReduceMotion.System }), []);
  const pop = useMemo<WithTimingConfig>(() => ({ duration: 80, reduceMotion: ReduceMotion.System }), []);
  const spring = useMemo<WithSpringConfig>(() => ({ stiffness: 500, damping: 28, mass: 0.8, reduceMotion: ReduceMotion.System }), []);

  useLayoutEffect(() => {
    const changed = previous.current.active !== active;
    const resized = previous.current.layoutKey !== layoutKey;
    previous.current = { active, layoutKey };
    if (reducedMotion || resized) {
      cancelAnimation(progress);
      cancelAnimation(scale);
      progress.value = active ? 1 : 0;
      scale.value = 1;
    } else if (changed) {
      progress.value = withTiming(active ? 1 : 0, fade);
      cancelAnimation(scale);
      if (active) {
        scale.value = withTiming(1.06, pop, (finished) => {
          "worklet";
          if (finished) scale.value = withSpring(1, spring);
        });
      } else {
        scale.value = 1;
      }
    }
  }, [active, layoutKey, reducedMotion, progress, scale, fade, pop, spring]);

  useEffect(() => () => {
    cancelAnimation(progress);
    cancelAnimation(scale);
  }, [progress, scale]);

  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const inactiveStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const activeStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Pressable
      ref={targetRef}
      collapsable={false}
      role="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={hitSlop}
      onLayout={onLayout}
      onPress={onPress}
      className={`items-center justify-center rounded-full ${sizeClass} ${active ? indicatorReady ? "" : "bg-nav-active" : "active:bg-accent"}`}
    >
      <Animated.View
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[{ width: 22, height: 22 }, iconStyle]}
      >
        <Animated.View className="absolute inset-0" style={inactiveStyle}>
          <Icon as={icon} size={22} strokeWidth={1.75} className="text-muted-foreground" />
        </Animated.View>
        <Animated.View className="absolute inset-0" style={activeStyle}>
          <Icon as={icon} size={22} strokeWidth={2.25} className="text-primary-action" />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

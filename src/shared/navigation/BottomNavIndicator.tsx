import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig,
} from "react-native-reanimated";
import type { NavIndicatorGeometry } from "./nav-indicator-geometry";

type BottomNavIndicatorProps = {
  geometry: NavIndicatorGeometry;
  route: string;
  layoutKey: string;
  reducedMotion: boolean;
};

export function BottomNavIndicator({ geometry, route, layoutKey, reducedMotion }: BottomNavIndicatorProps) {
  const { x, y, width, height, minX, maxX } = geometry;
  const rawX = useSharedValue(x);
  const previous = useRef({ route, layoutKey });
  const spring = useMemo<WithSpringConfig>(() => ({
    stiffness: 500,
    damping: 28,
    mass: 0.8,
    overshootClamping: false,
    reduceMotion: ReduceMotion.System,
  }), []);

  useLayoutEffect(() => {
    const moved = previous.current.route !== route;
    const resized = previous.current.layoutKey !== layoutKey;
    previous.current = { route, layoutKey };
    if (reducedMotion || resized || !moved) {
      cancelAnimation(rawX);
      rawX.value = x;
    } else {
      rawX.value = withSpring(x, spring);
    }
  }, [x, route, layoutKey, reducedMotion, rawX, spring]);

  useEffect(() => () => cancelAnimation(rawX), [rawX]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentX = Math.min(maxX, Math.max(minX, rawX.value));
    return {
      width,
      height,
      opacity: 1,
      zIndex: 0,
      elevation: 0,
      transform: [{ translateX: currentX }, { translateY: y }],
    };
  }, [y, width, height, minX, maxX]);

  return (
    <Animated.View
      testID="bottom-nav-indicator"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute left-0 top-0 rounded-full bg-nav-active"
      style={animatedStyle}
    />
  );
}

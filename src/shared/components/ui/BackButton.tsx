import { Icon } from "@/shared/components/ui/Icon";
import { fadeTiming } from "@/shared/motion/motion-presets";
import { useAppTheme } from "@/shared/theme";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { router, type Href } from "expo-router";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type BackButtonProps = {
  href?: Href;
  replace?: boolean;
  accessibilityLabel: string;
  className?: string;
  onPress?: () => void;
};

export function BackButton({
  href,
  replace = true,
  accessibilityLabel,
  className,
  onPress,
}: BackButtonProps) {
  const { colors } = useAppTheme();
  const reduced = useReducedMotion();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - pressed.value * 0.25,
    transform: [{ scale: 1 - pressed.value * 0.06 }],
  }));

  const handlePress = () => {
    if (onPress) return onPress();
    if (href) return replace ? router.replace(href) : router.push(href);
    if (router.canGoBack()) router.back();
  };

  return (
    <AnimatedPressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      onPressIn={() => {
        pressed.value = withTiming(1, fadeTiming(reduced));
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, fadeTiming(reduced));
      }}
      onPress={handlePress}
      style={animatedStyle}
      className={`size-11 items-center justify-center rounded-xl bg-gray-400/20 dark:bg-input/30 ${className ?? ""}`}
    >
      <Icon as={IconArrowLeft} size={22} color={colors.muted} />
    </AnimatedPressable>
  );
}

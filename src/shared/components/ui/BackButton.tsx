import { Icon } from "@/shared/components/ui/Icon";
import {
  ROUND_ICON_BUTTON_CLASS,
  ROUND_ICON_BUTTON_HIT_SLOP,
  ROUND_ICON_BUTTON_ICON_CLASS,
  ROUND_ICON_BUTTON_ICON_SIZE,
} from "@/shared/components/ui/icon-button-classes";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { router, type Href } from "expo-router";
import { Pressable } from "react-native";

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
  const handlePress = () => {
    if (onPress) return onPress();
    if (href) return replace ? router.replace(href) : router.push(href);
    if (router.canGoBack()) router.back();
  };

  return (
    <Pressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={ROUND_ICON_BUTTON_HIT_SLOP}
      onPress={handlePress}
      className={`${ROUND_ICON_BUTTON_CLASS} ${className ?? ""}`}
    >
      <Icon
        as={IconArrowLeft}
        size={ROUND_ICON_BUTTON_ICON_SIZE}
        className={ROUND_ICON_BUTTON_ICON_CLASS}
      />
    </Pressable>
  );
}

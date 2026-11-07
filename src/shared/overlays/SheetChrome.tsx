import { Icon } from "@/shared/components/ui/Icon";
import {
  ROUND_ICON_BUTTON_CLASS,
  ROUND_ICON_BUTTON_HIT_SLOP,
  ROUND_ICON_BUTTON_ICON_CLASS,
  ROUND_ICON_BUTTON_ICON_SIZE,
} from "@/shared/components/ui/icon-button-classes";
import { messages } from "@/shared/i18n";
import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { IconX } from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";

export function SheetBackground({ style }: BottomSheetBackgroundProps) {
  return <View pointerEvents="none" style={style} className="rounded-t-[1.125rem] bg-popover" />;
}

export function SheetHandle() {
  return (
    <View className="items-center pb-2 pt-3">
      <View className="h-1 w-10 rounded-full bg-foreground/20" />
    </View>
  );
}

export function SheetCloseButton({
  onPress,
  ref,
  ...props
}: React.ComponentProps<typeof Pressable>) {
  return (
    <Pressable
      ref={ref}
      {...props}
      role="button"
      accessibilityLabel={messages.Common.close}
      hitSlop={ROUND_ICON_BUTTON_HIT_SLOP}
      onPress={onPress}
      className={`absolute right-4 top-0 ${ROUND_ICON_BUTTON_CLASS}`}
    >
      <Icon
        as={IconX}
        size={ROUND_ICON_BUTTON_ICON_SIZE}
        className={ROUND_ICON_BUTTON_ICON_CLASS}
      />
    </Pressable>
  );
}

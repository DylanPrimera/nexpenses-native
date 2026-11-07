import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { tx } from "@/shared/i18n/format";
import type { Icon as TablerIconType } from "@tabler/icons-react-native";
import type { TooltipProps } from "@wrack/react-native-tour-guide";
import { useEffect, useRef, useState } from "react";
import { focusAccessibilityTarget } from "@/shared/overlays/accessibility-focus";
import { ScrollView, View } from "react-native";

const MAX_WIDTH = 360;
const SCREEN_MARGIN = 16;
const TARGET_GAP = 14;

const NO_INSETS = { top: 0, bottom: 0, left: 0, right: 0 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

type TourTooltipProps = TooltipProps & { icon: TablerIconType };

export function TourTooltip({
  title,
  description,
  icon,
  position,
  tooltipPosition,
  currentStep,
  totalSteps,
  targetWidth = 0,
  targetHeight = 0,
  screenWidth = 0,
  screenHeight = 0,
  insets = NO_INSETS,
  isLastStep,
  onNext,
  onPrev,
  onSkip,
}: TourTooltipProps) {
  const [height, setHeight] = useState(0);
  const headingRef = useRef<React.ComponentRef<typeof Text>>(null);
  useEffect(() => {
    if (height > 0) focusAccessibilityTarget(headingRef);
  }, [height, currentStep]);
  const hasTarget = targetWidth > 0 && targetHeight > 0;
  const isLast = isLastStep ?? currentStep === totalSteps - 1;

  const minX = SCREEN_MARGIN + insets.left;
  const width = Math.min(MAX_WIDTH, screenWidth - minX - SCREEN_MARGIN - insets.right);
  const left = hasTarget
    ? clamp(
        position.x + targetWidth / 2 - width / 2,
        minX,
        screenWidth - width - SCREEN_MARGIN - insets.right,
      )
    : (screenWidth - width) / 2;

  const minY = insets.top + SCREEN_MARGIN;
  const maxY = screenHeight - insets.bottom - SCREEN_MARGIN;
  const spaceAbove = position.y - TARGET_GAP - minY;
  const spaceBelow = maxY - (position.y + targetHeight + TARGET_GAP);
  const preferBelow =
    tooltipPosition === "bottom" || (tooltipPosition !== "top" && spaceBelow >= spaceAbove);
  const fitsPreferred = (preferBelow ? spaceBelow : spaceAbove) >= height;
  const below = fitsPreferred ? preferBelow : !preferBelow;
  const anchored = below
    ? position.y + targetHeight + TARGET_GAP
    : position.y - TARGET_GAP - height;
  const top = hasTarget ? clamp(anchored, minY, maxY - height) : (screenHeight - height) / 2;

  const bodyMaxHeight = Math.max(120, maxY - minY - 140);

  return (
    <View
      onLayout={(event) => setHeight(event.nativeEvent.layout.height)}
      style={{ position: "absolute", left, top, width, opacity: height > 0 ? 1 : 0 }}
      className="gap-3 rounded-[0.875rem] border border-border bg-popover p-4"
    >
      <View className="flex-row items-center gap-3">
        <View className="size-9 items-center justify-center rounded-[0.75rem] bg-primary/15">
          <Icon as={icon} size={20} strokeWidth={2} className="text-primary-action" />
        </View>
        <Text
          ref={headingRef}
          role="heading"
          className="flex-1 font-figtree-bold text-base tracking-tight"
        >
          {title}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: bodyMaxHeight }}
        bounces={false}
      >
        <Text className="text-sm leading-5 text-muted-foreground">{description}</Text>
      </ScrollView>

      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-xs text-muted-foreground">
          {tx(messages.Tour.progress, { current: currentStep + 1, total: totalSteps })}
        </Text>
        <View className="flex-row items-center gap-2">
          {isLast ? null : (
            <Button variant="ghost" size="sm" onPress={onSkip}>
              <Text>{messages.Tour.skip}</Text>
            </Button>
          )}
          {onPrev ? (
            <Button variant="outline" size="sm" onPress={onPrev}>
              <Text>{messages.Tour.previous}</Text>
            </Button>
          ) : null}
          <Button size="sm" onPress={onNext}>
            <Text>{isLast ? messages.Tour.done : messages.Tour.next}</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

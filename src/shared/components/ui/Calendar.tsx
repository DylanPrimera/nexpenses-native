import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { DURATION_UI_MS, EASE_OUT, fadeTiming } from "@/shared/motion/motion-presets";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react-native";
import { useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInRight,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  buildMonthGrid,
  isDayDisabled,
  monthCaption,
  monthKey,
  shiftMonth,
  todayKey,
  weekdayLabels,
  type CalendarDay,
} from "./calendar-grid";

type CalendarProps = {
  value?: string;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
};

const WEEKDAYS = weekdayLabels();
const SWIPE_DISTANCE = 48;
const SWIPE_VELOCITY = 500;
const DRAG_DAMPING = 0.35;

function monthEntering(direction: number) {
  const base = direction < 0 ? FadeInLeft : FadeInRight;
  return base.duration(DURATION_UI_MS).easing(EASE_OUT).reduceMotion(ReduceMotion.System);
}

function dayCircleClass(selected: boolean, today: boolean) {
  if (selected) return "bg-primary";
  if (today) return "border-2 border-primary/40 group-active:bg-muted";
  return "group-active:bg-muted";
}

function dayTextClass(selected: boolean, outside: boolean) {
  if (selected) return "text-primary-foreground";
  if (outside) return "text-muted-foreground";
  return "text-foreground";
}

function CalendarCell({
  day,
  selected,
  today,
  disabled,
  onPress,
}: {
  day: CalendarDay;
  selected: boolean;
  today: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={day.key}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`group aspect-square flex-1 p-0.5 ${disabled ? "opacity-50" : ""}`}
    >
      <View
        className={`flex-1 items-center justify-center rounded-full ${dayCircleClass(selected, today)}`}
      >
        <Text className={`text-sm ${dayTextClass(selected, day.outside)}`}>{day.day}</Text>
      </View>
    </Pressable>
  );
}

export function Calendar({ value, onChange, minDate, maxDate, className }: CalendarProps) {
  const [month, setMonth] = useState(() => monthKey(value));
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const dragX = useSharedValue(0);
  const days = buildMonthGrid(month);
  const today = todayKey();
  const selectedKey = value?.slice(0, 10);
  const weeks = Array.from({ length: 6 }, (_, week) => days.slice(week * 7, week * 7 + 7));

  const goToMonth = (step: number) => {
    setDirection(step);
    setMonth((current) => shiftMonth(current, step));
  };

  const swipe = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      dragX.value = event.translationX * DRAG_DAMPING;
    })
    .onEnd((event) => {
      const passed =
        Math.abs(event.translationX) > SWIPE_DISTANCE || Math.abs(event.velocityX) > SWIPE_VELOCITY;
      if (passed) scheduleOnRN(goToMonth, event.translationX < 0 ? 1 : -1);
      dragX.value = withTiming(0, fadeTiming(reduced));
    })
    .onFinalize(() => {
      if (dragX.value !== 0) dragX.value = withTiming(0, fadeTiming(reduced));
    });

  const dragStyle = useAnimatedStyle(() => ({ transform: [{ translateX: dragX.value }] }));

  return (
    <View className={`w-full gap-3 ${className ?? ""}`}>
      <View className="h-9 flex-row items-center justify-between">
        <Button
          variant="ghost"
          size="icon-sm"
          accessibilityLabel={messages.Common.previous_month}
          onPress={() => goToMonth(-1)}
        >
          <Icon as={IconChevronLeft} size={18} />
        </Button>
        <Text className="font-figtree-medium text-sm capitalize">{monthCaption(month)}</Text>
        <Button
          variant="ghost"
          size="icon-sm"
          accessibilityLabel={messages.Common.next_month}
          onPress={() => goToMonth(1)}
        >
          <Icon as={IconChevronRight} size={18} />
        </Button>
      </View>

      <View className="flex-row">
        {WEEKDAYS.map((label) => (
          <Text key={label} className="flex-1 text-center text-xs text-muted-foreground">
            {label}
          </Text>
        ))}
      </View>

      <GestureDetector gesture={swipe}>
        <Animated.View style={[styles.clip, dragStyle]}>
          <Animated.View key={month} entering={monthEntering(direction)}>
            {weeks.map((week) => (
              <View key={week[0].key} className="flex-row">
                {week.map((day) => (
                  <CalendarCell
                    key={day.key}
                    day={day}
                    selected={day.key === selectedKey}
                    today={day.key === today}
                    disabled={isDayDisabled(day.key, minDate, maxDate)}
                    onPress={() => onChange(day.key)}
                  />
                ))}
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: "hidden" },
});

export type { CalendarProps };

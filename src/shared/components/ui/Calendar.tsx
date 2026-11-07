import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { DURATION_UI_MS, EASE_OUT, fadeTiming } from "@/shared/motion/motion-presets";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react-native";
import { useMemo, useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
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
  month?: string;
  onMonthChange?: (month: string) => void;
  markedDays?: ReadonlySet<string>;
  showHeader?: boolean;
  showOutsideDays?: boolean;
  paddingBottom?: number;
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
  if (selected) return "bg-primary-action";
  if (today) return "border-2 border-primary/40 group-active:bg-muted";
  return "group-active:bg-muted";
}

function dayTextClass(selected: boolean, outside: boolean) {
  if (selected) return "text-primary-foreground";
  if (outside) return "text-muted-foreground";
  return "text-foreground";
}

function dayDotClass(selected: boolean, marked: boolean) {
  if (!marked) return "bg-transparent";
  return selected ? "bg-primary-foreground" : "bg-primary";
}

function CalendarCell({
  day,
  selected,
  today,
  disabled,
  marked,
  showDots,
  onPress,
}: {
  day: CalendarDay;
  selected: boolean;
  today: boolean;
  disabled: boolean;
  marked: boolean;
  showDots: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={`${new Date(`${day.key}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}${today ? `, ${messages.Common.today}` : ""}${marked ? `, ${messages.History.has_expenses}` : ""}`}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`group aspect-square flex-1 p-0.5 ${disabled ? "opacity-50" : ""}`}
    >
      <View
        className={`flex-1 items-center justify-center rounded-full ${dayCircleClass(selected, today)}`}
      >
        <Text className={`text-sm ${dayTextClass(selected, day.outside)}`}>{day.day}</Text>
        {showDots ? (
          <View className={`mt-0.5 size-1 rounded-full ${dayDotClass(selected, marked)}`} />
        ) : null}
      </View>
    </Pressable>
  );
}

export function useCalendarModel({
  value,
  onChange,
  minDate,
  maxDate,
  className,
  month: controlledMonth,
  onMonthChange,
  markedDays,
  showHeader = true,
  showOutsideDays = true,
}: CalendarProps) {
  const [innerMonth, setInnerMonth] = useState(() => monthKey(value));
  const month = controlledMonth ?? innerMonth;
  const [shownMonth, setShownMonth] = useState(month);
  const [direction, setDirection] = useState(1);
  if (shownMonth !== month) {
    setDirection(month > shownMonth ? 1 : -1);
    setShownMonth(month);
  }
  const reduced = useReducedMotion();
  const dragX = useSharedValue(0);
  const days = buildMonthGrid(month);
  const today = todayKey();
  const selectedKey = value?.slice(0, 10);
  const weeks = Array.from({ length: 6 }, (_, week) => days.slice(week * 7, week * 7 + 7)).filter(
    (week) => showOutsideDays || week.some((day) => !day.outside),
  );

  const goToMonth = (step: number) => {
    const next = shiftMonth(month, step);
    if (controlledMonth === undefined) setInnerMonth(next);
    onMonthChange?.(next);
  };

  const dragStyle = useAnimatedStyle(() => ({ transform: [{ translateX: dragX.value }] }));

  return {
    month,
    weeks,
    today,
    selectedKey,
    goToMonth,
    dragX,
    dragStyle,
    direction,
    reduced,
    onChange,
    minDate,
    maxDate,
    markedDays,
    showOutsideDays,
    showHeader,
    className,
  };
}

export type CalendarModel = ReturnType<typeof useCalendarModel>;

export function CalendarHeader({ model }: { model: CalendarModel }) {
  return (
    <View className="gap-3 pb-2">
      {model.showHeader ? (
        <View className="min-h-12 flex-row items-center justify-between">
          <Button
            variant="ghost"
            size="icon-sm"
            accessibilityLabel={messages.Common.previous_month}
            onPress={() => model.goToMonth(-1)}
          >
            <Icon as={IconChevronLeft} size={18} />
          </Button>
          <Text className="font-figtree-medium text-sm capitalize">
            {monthCaption(model.month)}
          </Text>
          <Button
            variant="ghost"
            size="icon-sm"
            accessibilityLabel={messages.Common.next_month}
            onPress={() => model.goToMonth(1)}
          >
            <Icon as={IconChevronRight} size={18} />
          </Button>
        </View>
      ) : null}
      <View className="flex-row">
        {WEEKDAYS.map((label) => (
          <Text key={label} className="flex-1 text-center text-xs text-muted-foreground">
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function CalendarWeekRow({ week, model }: { week: CalendarDay[]; model: CalendarModel }) {
  const [width, setWidth] = useState(0);
  const { dragX, goToMonth, reduced } = model;
  const resetTiming = useMemo(() => fadeTiming(reduced), [reduced]);
  const swipe = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      dragX.set(event.translationX * DRAG_DAMPING);
    })
    .onEnd((event) => {
      if (
        Math.abs(event.translationX) > SWIPE_DISTANCE ||
        Math.abs(event.velocityX) > SWIPE_VELOCITY
      )
        scheduleOnRN(goToMonth, event.translationX < 0 ? 1 : -1);
      dragX.set(withTiming(0, resetTiming));
    })
    .onFinalize(() => {
      if (dragX.get() !== 0) dragX.set(withTiming(0, resetTiming));
    });
  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <GestureDetector gesture={swipe}>
        <Animated.View style={[styles.clip, model.dragStyle]}>
          <Animated.View key={model.month} entering={monthEntering(model.direction)}>
            <FlatList
              horizontal
              scrollEnabled={false}
              data={week}
              keyExtractor={(day) => day.key}
              style={{ height: Math.max(44, width / 7), flexGrow: 0 }}
              extraData={[model.selectedKey, model.markedDays, width]}
              renderItem={({ item: day }) => (
                <View style={{ width: width / 7 }}>
                  {day.outside && !model.showOutsideDays ? (
                    <View />
                  ) : (
                    <CalendarCell
                      day={day}
                      selected={day.key === model.selectedKey}
                      today={day.key === model.today}
                      disabled={isDayDisabled(day.key, model.minDate, model.maxDate)}
                      marked={model.markedDays?.has(day.key) ?? false}
                      showDots={model.markedDays !== undefined}
                      onPress={() => model.onChange(day.key)}
                    />
                  )}
                </View>
              )}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export function Calendar(props: CalendarProps) {
  const model = useCalendarModel(props);
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={model.weeks}
      keyExtractor={(week) => week[0].key}
      ListHeaderComponent={<CalendarHeader model={model} />}
      renderItem={({ item }) => <CalendarWeekRow week={item} model={model} />}
    />
  );
}

export function CalendarSheet(props: CalendarProps) {
  const model = useCalendarModel(props);
  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      data={model.weeks}
      keyExtractor={(week) => week[0].key}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: props.paddingBottom }}
      ListHeaderComponent={<CalendarHeader model={model} />}
      renderItem={({ item }) => <CalendarWeekRow week={item} model={model} />}
    />
  );
}

const styles = StyleSheet.create({ clip: { overflow: "hidden" } });
export type { CalendarProps };

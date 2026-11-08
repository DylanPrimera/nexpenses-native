import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { useThemeColors } from "@/shared/hooks";
import type { ThemePalette } from "@/shared/theme/colors";
import { useCalendarPager } from "./use-calendar-pager";
import { CalendarSkeleton } from "./CalendarSkeleton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react-native";
import { useCallback, useEffect, useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureDetector } from "react-native-gesture-handler";
import {
  FlatList,
  Pressable,
  View,
  Text as NativeText,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, { useAnimatedStyle, type SharedValue } from "react-native-reanimated";
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
const EMPTY_ROWS: never[] = [];

function monthWeeks(month: string, showOutsideDays: boolean) {
  const days = buildMonthGrid(month);
  return Array.from({ length: 6 }, (_, week) => days.slice(week * 7, week * 7 + 7)).filter(
    (week) => showOutsideDays || week.some((day) => !day.outside),
  );
}

function CalendarCell({
  day,
  selected,
  today,
  disabled,
  marked,
  showDots,
  onPress,
  cellWidth,
  colors,
}: {
  day: CalendarDay;
  selected: boolean;
  today: boolean;
  disabled: boolean;
  marked: boolean;
  showDots: boolean;
  onPress: () => void;
  cellWidth: number;
  colors: ThemePalette;
}) {
  const [pressed, setPressed] = useState(false);
  const backgroundColor = selected
    ? colors.primaryAction
    : pressed
      ? colors.mutedSurface
      : "transparent";
  const height = Math.max(44, cellWidth);
  const size = Math.max(0, Math.min(cellWidth, height) - 4);
  const radius = size / 2;
  return (
    <Pressable
      role="button"
      accessibilityLabel={`${new Date(`${day.key}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}${today ? `, ${messages.Common.today}` : ""}${marked ? `, ${messages.History.has_expenses}` : ""}`}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ width: cellWidth, height, justifyContent: "center" }}
    >
      <View
        testID={`calendar-indicator-${day.key}`}
        collapsable={false}
        style={[
          styles.indicator,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            borderBottomLeftRadius: radius,
            borderBottomRightRadius: radius,
            backgroundColor,
            borderWidth: today && !selected ? 2 : 1,
            borderColor: today && !selected ? `${colors.primary}66` : backgroundColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <NativeText
          style={[
            styles.dayText,
            {
              color: selected
                ? colors.primaryForeground
                : day.outside
                  ? colors.mutedForeground
                  : colors.foreground,
            },
          ]}
        >
          {day.day}
        </NativeText>
        {showDots ? (
          <View
            style={[
              styles.dot,
              {
                backgroundColor: marked
                  ? selected
                    ? colors.primaryForeground
                    : colors.primary
                  : "transparent",
              },
            ]}
          />
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
  const colors = useThemeColors();
  const today = todayKey();
  const selectedKey = value?.slice(0, 10);
  const setMonth = useCallback(
    (next: string) => {
      if (controlledMonth === undefined) setInnerMonth(next);
      onMonthChange?.(next);
    },
    [controlledMonth, onMonthChange],
  );
  const goToMonth = useCallback(
    (step: number) => setMonth(shiftMonth(month, step)),
    [month, setMonth],
  );

  return {
    month,
    today,
    selectedKey,
    goToMonth,
    setMonth,
    colors,
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

export function CalendarHeader({
  model,
  width,
  disabled = false,
}: {
  model: CalendarModel;
  width: number;
  disabled?: boolean;
}) {
  return (
    <View className="gap-3 pb-2">
      {model.showHeader ? (
        <View className="min-h-12 flex-row items-center justify-between">
          <Button
            disabled={disabled}
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
            disabled={disabled}
            variant="ghost"
            size="icon-sm"
            accessibilityLabel={messages.Common.next_month}
            onPress={() => model.goToMonth(1)}
          >
            <Icon as={IconChevronRight} size={18} />
          </Button>
        </View>
      ) : null}
      <FlatList
        horizontal
        scrollEnabled={false}
        data={WEEKDAYS}
        initialNumToRender={7}
        maxToRenderPerBatch={7}
        windowSize={21}
        updateCellsBatchingPeriod={0}
        removeClippedSubviews={false}
        keyExtractor={(label) => label}
        style={{ width, flexGrow: 0 }}
        contentContainerStyle={{ width }}
        getItemLayout={(_, index) => ({ length: width / 7, offset: (index * width) / 7, index })}
        renderItem={({ item }) => (
          <Text style={{ width: width / 7 }} className="text-center text-xs text-muted-foreground">
            {item}
          </Text>
        )}
      />
    </View>
  );
}

export function CalendarWeekRow({
  week,
  model,
  width,
}: {
  week: CalendarDay[];
  model: CalendarModel;
  width: number;
}) {
  return (
    <FlatList
      horizontal
      scrollEnabled={false}
      data={week}
      keyExtractor={(day) => day.key}
      style={{ width, height: Math.max(44, width / 7), flexGrow: 0 }}
      contentContainerStyle={{ width }}
      getItemLayout={(_, index) => ({ length: width / 7, offset: (index * width) / 7, index })}
      initialNumToRender={7}
      maxToRenderPerBatch={7}
      windowSize={21}
      updateCellsBatchingPeriod={0}
      removeClippedSubviews={false}
      extraData={[model.selectedKey, model.markedDays, width]}
      renderItem={({ item: day }) => (
        <View style={{ width: width / 7 }}>
          {day.outside && !model.showOutsideDays ? null : (
            <CalendarCell
              day={day}
              cellWidth={width / 7}
              colors={model.colors}
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
  );
}

function CalendarPage({
  model,
  width,
  month,
  position,
  active,
  transitioning,
  scrollOffset,
}: {
  model: CalendarModel;
  width: number;
  month: string;
  position: number;
  active: boolean;
  transitioning: boolean;
  scrollOffset: SharedValue<number>;
}) {
  const weeks = monthWeeks(month, model.showOutsideDays);
  const rowHeight = Math.max(44, width / 7);
  const pageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position * width - scrollOffset.get() }],
  }));
  return (
    <Animated.View
      testID={`calendar-page-${month}`}
      collapsable={false}
      pointerEvents={active && !transitioning ? "auto" : "none"}
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? "auto" : "no-hide-descendants"}
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height: rowHeight * weeks.length,
          overflow: "hidden",
        },
        pageStyle,
      ]}
    >
      <FlatList
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        style={{ width, height: rowHeight * weeks.length, flexGrow: 0 }}
        contentContainerStyle={{ width }}
        data={weeks}
        keyExtractor={(week) => week[0].key}
        getItemLayout={(_, index) => ({ length: rowHeight, offset: rowHeight * index, index })}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={21}
        updateCellsBatchingPeriod={0}
        removeClippedSubviews={false}
        extraData={[model.selectedKey, model.markedDays, width]}
        renderItem={({ item: week }) => <CalendarWeekRow week={week} model={model} width={width} />}
      />
    </Animated.View>
  );
}

function MeasuredCalendarMonth({ model, width }: { model: CalendarModel; width: number }) {
  const pager = useCalendarPager({ month: model.month, width, onMonthChange: model.setMonth });
  const previous = pager.target < pager.month ? pager.target : shiftMonth(pager.month, -1);
  const next = pager.target > pager.month ? pager.target : shiftMonth(pager.month, 1);
  const rowCount = Math.max(
    monthWeeks(pager.month, model.showOutsideDays).length,
    monthWeeks(pager.target, model.showOutsideDays).length,
  );
  const headerModel = { ...model, month: pager.month, goToMonth: pager.goToMonth };
  const pageProps = {
    model,
    width,
    transitioning: pager.transitioning,
    scrollOffset: pager.scrollOffset,
  };
  return (
    <>
      <CalendarHeader model={headerModel} width={width} disabled={pager.transitioning} />
      <GestureDetector gesture={pager.gesture}>
        <View
          testID="calendar-month-grid"
          collapsable={false}
          style={{ width, height: Math.max(44, width / 7) * rowCount, overflow: "hidden" }}
        >
          <CalendarPage
            key={previous}
            {...pageProps}
            month={previous}
            position={pager.position - 1}
            active={false}
          />
          <CalendarPage
            key={pager.month}
            {...pageProps}
            month={pager.month}
            position={pager.position}
            active
          />
          <CalendarPage
            key={next}
            {...pageProps}
            month={next}
            position={pager.position + 1}
            active={false}
          />
        </View>
      </GestureDetector>
    </>
  );
}

export function CalendarMonth({
  model,
  estimatedWidth,
}: {
  model: CalendarModel;
  estimatedWidth?: number;
}) {
  const { width: windowWidth } = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const [firstFrame, setFirstFrame] = useState(true);
  const width = Math.max(7, measuredWidth ?? estimatedWidth ?? windowWidth - 40);
  const weekCount = monthWeeks(model.month, model.showOutsideDays).length;
  const minHeight = (model.showHeader ? 84 : 24) + Math.max(44, width / 7) * weekCount;
  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (mounted) setFirstFrame(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <View
      testID="calendar-month-viewport"
      style={{ width: "100%", minHeight, overflow: "hidden" }}
      onLayout={(event) => {
        const nextWidth = event.nativeEvent.layout.width;
        if (Number.isFinite(nextWidth) && nextWidth > 0) setMeasuredWidth(nextWidth);
      }}
    >
      <MeasuredCalendarMonth key={width} model={model} width={width} />
      {firstFrame && measuredWidth === null ? (
        <CalendarSkeleton width={width} weekCount={weekCount} showHeader={model.showHeader} />
      ) : null}
    </View>
  );
}

export function Calendar(props: CalendarProps) {
  const model = useCalendarModel(props);
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={EMPTY_ROWS}
      className={props.className}
      ListHeaderComponent={<CalendarMonth model={model} />}
      renderItem={() => null}
    />
  );
}

export function CalendarSheet(props: CalendarProps) {
  const model = useCalendarModel(props);
  return (
    <BottomSheetFlatList
      showsVerticalScrollIndicator={false}
      data={EMPTY_ROWS}
      className={props.className}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: props.paddingBottom }}
      ListHeaderComponent={<CalendarMonth model={model} />}
      renderItem={() => null}
    />
  );
}

export type { CalendarProps };

const styles = StyleSheet.create({
  indicator: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dayText: { fontFamily: "Figtree_400Regular", fontSize: 14, lineHeight: 20 },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
});

import { FlatList, View } from "react-native";
import { Skeleton } from "./skeleton";

const COLUMNS = Array.from({ length: 7 }, (_, index) => index);

type Props = { width: number; weekCount: number; showHeader: boolean };

export function CalendarSkeleton({ width, weekCount, showHeader }: Props) {
  const cellWidth = width / 7;
  const rowHeight = Math.max(44, cellWidth);
  const size = Math.max(0, Math.min(cellWidth, rowHeight) - 4);
  const rows = Array.from({ length: Math.min(5, weekCount) }, (_, index) => index);
  return (
    <View
      testID="calendar-skeleton"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="bg-card"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height: (showHeader ? 84 : 24) + weekCount * rowHeight,
      }}
    >
      <View className="gap-3 pb-2">
        {showHeader ? (
          <View style={{ height: 48 }} className="flex-row items-center justify-between">
            <Skeleton className="rounded-full" style={{ width: 32, height: 32 }} />
            <Skeleton style={{ width: width * 0.4, height: 14 }} />
            <Skeleton className="rounded-full" style={{ width: 32, height: 32 }} />
          </View>
        ) : null}
        <FlatList
          horizontal
          scrollEnabled={false}
          data={COLUMNS}
          keyExtractor={String}
          initialNumToRender={7}
          maxToRenderPerBatch={7}
          removeClippedSubviews={false}
          style={{ width, height: 16, flexGrow: 0 }}
          contentContainerStyle={{ width }}
          getItemLayout={(_, index) => ({ length: cellWidth, offset: cellWidth * index, index })}
          renderItem={({ item }) => (
            <View
              style={{
                width: cellWidth,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Skeleton
                testID={`calendar-skeleton-weekday-${item}`}
                style={{ width: Math.min(16, cellWidth), height: 8 }}
              />
            </View>
          )}
        />
      </View>
      <FlatList
        scrollEnabled={false}
        data={rows}
        keyExtractor={String}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={21}
        removeClippedSubviews={false}
        style={{ width, height: weekCount * rowHeight, flexGrow: 0 }}
        contentContainerStyle={{ width }}
        getItemLayout={(_, index) => ({ length: rowHeight, offset: rowHeight * index, index })}
        renderItem={({ item: row }) => (
          <FlatList
            horizontal
            scrollEnabled={false}
            data={COLUMNS}
            keyExtractor={String}
            initialNumToRender={7}
            maxToRenderPerBatch={7}
            removeClippedSubviews={false}
            style={{ width, height: rowHeight, flexGrow: 0 }}
            contentContainerStyle={{ width }}
            getItemLayout={(_, index) => ({ length: cellWidth, offset: cellWidth * index, index })}
            renderItem={({ item: column }) => (
              <View
                style={{
                  width: cellWidth,
                  height: rowHeight,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.5,
                }}
              >
                <Skeleton
                  testID={`calendar-skeleton-day-${row}-${column}`}
                  className="rounded-full"
                  style={{ width: size, height: size, borderRadius: size / 2 }}
                />
              </View>
            )}
          />
        )}
      />
    </View>
  );
}

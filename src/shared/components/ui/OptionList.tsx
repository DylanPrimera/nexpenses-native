import { useState, type ReactNode } from "react";
import { FlatList, View, useWindowDimensions, type ViewProps } from "react-native";

type OptionListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => string;
  renderOption: (item: T) => ReactNode;
  extraData?: unknown;
  minHeight?: number;
} & Pick<ViewProps, "role" | "accessibilityLabel" | "className">;

type OptionListRowsProps<T> = Pick<
  OptionListProps<T>,
  "items" | "getKey" | "renderOption" | "extraData"
> & { width: number; minHeight: number };

function OptionListRows<T>({
  items,
  getKey,
  renderOption,
  extraData,
  width,
  minHeight,
}: OptionListRowsProps<T>) {
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const itemWidth = Math.max(
    64,
    (width - Math.max(0, items.length - 1) * 8) / Math.max(1, items.length),
  );

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={getKey}
      extraData={[extraData, width]}
      style={{ height: Math.max(minHeight, measuredHeight), flexGrow: 0 }}
      contentContainerStyle={{ gap: 8, alignItems: "flex-start" }}
      renderItem={({ item }) => (
        <View
          style={{ width: itemWidth }}
          onLayout={(event) => {
            const height = event.nativeEvent.layout.height;
            setMeasuredHeight((previous) => Math.max(previous, height));
          }}
        >
          {renderOption(item)}
        </View>
      )}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
}

export function OptionList<T>({
  items,
  getKey,
  renderOption,
  extraData,
  minHeight = 68,
  ...props
}: OptionListProps<T>) {
  const [width, setWidth] = useState(0);
  const { fontScale } = useWindowDimensions();
  const layoutKey = JSON.stringify([width, fontScale, items.map((item) => getKey(item))]);

  return (
    <View
      {...props}
      style={{ width: "100%" }}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <OptionListRows
        key={layoutKey}
        items={items}
        getKey={getKey}
        renderOption={renderOption}
        extraData={extraData}
        width={width}
        minHeight={minHeight}
      />
    </View>
  );
}

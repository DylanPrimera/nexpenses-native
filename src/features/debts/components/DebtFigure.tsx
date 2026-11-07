import { Text } from "@/shared/components/ui/text";
import { View, useWindowDimensions } from "react-native";

type DebtFigureProps = {
  label: string;
  value: string;
  size?: "sm" | "md";
};

export function DebtFigure({ label, value, size = "sm" }: DebtFigureProps) {
  const { fontScale } = useWindowDimensions();
  const sizeClass = size === "md" ? "text-sm" : "text-xs";

  return (
    <View
      className={`${fontScale >= 1.3 ? "flex-col items-start" : "flex-row items-baseline"} justify-between gap-3`}
    >
      <Text className={`${sizeClass} text-muted-foreground`}>{label}</Text>
      <Text className={`font-figtree-semibold tabular-nums ${sizeClass}`}>{value}</Text>
    </View>
  );
}

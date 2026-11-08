import { useThemeColors } from "@/shared/hooks";
import { Text } from "@/shared/components/ui/text";
import { View } from "react-native";
import { DEFAULT_CATEGORY_COLOR, categoryBadgeForeground, withAlpha } from "../lib/category-colors";

type CategoryBadgeProps = {
  name: string;
  color?: string;
  size?: "sm" | "md";
  truncate?: boolean;
};

export function CategoryBadge({
  name,
  color = DEFAULT_CATEGORY_COLOR,
  size = "md",
  truncate = true,
}: CategoryBadgeProps) {
  const { card } = useThemeColors();
  const foreground = categoryBadgeForeground(color, card);
  return (
    <View
      style={{ backgroundColor: withAlpha(color, 0.12) }}
      className={`flex-row items-center gap-1.5 rounded-md ${size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1"}`}
    >
      <View style={{ backgroundColor: foreground }} className="size-1.5 rounded-full" />
      <Text
        style={{ color: foreground }}
        numberOfLines={truncate ? 1 : undefined}
        className={`${truncate ? "max-w-[120px]" : "shrink"} font-figtree-medium text-xs capitalize`}
      >
        {name}
      </Text>
    </View>
  );
}

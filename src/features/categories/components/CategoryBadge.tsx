import { Text } from "@/shared/components/ui/text";
import { View } from "react-native";
import { DEFAULT_CATEGORY_COLOR, withAlpha } from "../lib/category-colors";

type CategoryBadgeProps = {
  name: string;
  color?: string;
  size?: "sm" | "md";
};

export function CategoryBadge({ name, color = DEFAULT_CATEGORY_COLOR, size = "md" }: CategoryBadgeProps) {
  return (
    <View
      style={{ backgroundColor: withAlpha(color, 0.12) }}
      className={`flex-row items-center gap-1.5 rounded-md ${size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1"}`}
    >
      <View style={{ backgroundColor: color }} className="size-1.5 rounded-full" />
      <Text numberOfLines={1} style={{ color }} className="max-w-[120px] font-figtree-medium text-xs capitalize">
        {name}
      </Text>
    </View>
  );
}

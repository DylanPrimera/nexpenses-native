import { ThemedText } from "@/shared";
import { useThemeColors } from "@/shared/hooks";
import { Pressable } from "react-native";
import type { Item } from "../interfaces";

interface ItemCardProps {
  item: Item;
  onPress: () => void;
}

export const ItemCard = ({ item, onPress }: ItemCardProps) => {
  const { card, border } = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-xl p-4"
      style={{ backgroundColor: card, borderWidth: 1, borderColor: border }}
    >
      <ThemedText variant="subtitle" numberOfLines={2}>
        {item.title}
      </ThemedText>
      <ThemedText muted className="mt-1" numberOfLines={2}>
        {item.body}
      </ThemedText>
    </Pressable>
  );
};

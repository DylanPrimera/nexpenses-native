import { ItemList } from "@/features/example";
import { ThemedView } from "@/shared";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1">
      <ItemList onPressItem={(id) => router.push(`/(app)/details/${id}`)} />
    </ThemedView>
  );
}
